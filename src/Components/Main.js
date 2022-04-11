import React, { Component } from "react";
import {
  Card,
  Button, Modal, Form
} from "react-bootstrap";
import '../css/Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      message: "",
      searchText: "",
      showCartModal: false,
      currentSelection: {},
      showRentModal: false,
      showRentModalForCart: false,
      rentDuration: 0
    }
  }

  componentDidMount() {
    let uri = '/ebooks/'
    let userId = localStorage.getItem('userId')
    if (userId)
      uri = '/ebooks/fetchBooks?userId=' + userId 
    this.fetchBooks(process.env.REACT_APP_BACKEND_EBOOK_URL + uri);
  }

  onFilterTextChange(searchTextField) {
    this.setState({
      searchText: searchTextField.target.value
    })
    console.log(this.state)
    this.fetchBooksBasedOnSearch(searchTextField.target.value);
  }

  fetchBooksBasedOnSearch(searchText) {
    let url = process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/";
    if (searchText !== "" && searchText !== undefined) {
      url += "search?searchText=" + searchText
    }
    this.fetchBooks(url);
  }

  buy(bookId) {
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      console.log('buying')
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/billing/buy', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          'userId': parseInt(userId),
          'bookId': bookId
        })
      })
        .then(data => data.json())
        .then((data) => {
          console.log('success: ', data)
          if (data !== undefined && data !== null && (data.error === undefined || data.error === null))
            alert('Ebook bought successfully');
          else
            alert(data.error);
          
        })
        .catch((err) => {
          alert("Failed to buy this ebook");
          console.log('error: ', err)
        })
    }
    console.log('bookId: ', bookId, ' userId: ', userId)
  }

  showRentModal(bookId, price) {
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      this.setState({
        showRentModal: true,
        currentSelection: {
          'bookId': bookId,
          'price': price
        }
      })      
    }
  }

  updateRentDuration(duration) {
    this.setState({
      rentDuration: duration
    })
  }

  rent() {
    this.setState({
      showRentModal: false
    })
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      let numberOfDays = parseInt(this.state.rentDuration)
      if (numberOfDays !== undefined && numberOfDays > 45) {
        alert("Rent Duration should not be greater than 45");
        return
      }
      let startDate = new Date();
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + numberOfDays);
      console.log(startDate, endDate, numberOfDays)
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/rent', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          'userId': userId,
          'bookId': this.state.currentSelection.bookId,
          'startDate': startDate,
          'endDate': endDate,
          'rentAmount': this.state.currentSelection.price * 0.01 * numberOfDays
        })
      }).then(rentObj => rentObj.json())
      .then((rentObj) => {
        if (rentObj !== undefined && rentObj !== null &&  (rentObj.error === undefined || rentObj.error === null)) {
          fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/billing/addBookToBilling', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'userId': userId,
              'bookId': this.state.currentSelection.bookId,
              'action': 'rent',
              'rentId': rentObj.id
            })
          })
          .then(billing => billing.json())
          .then((billing) => {
            console.log('success: ', billing)
            if (billing !== undefined && billing !== null && (billing.error === undefined || billing.error === null))
              alert('Ebook rent successfully');
            else
              alert(billing.error);
          })
          .catch((err) => {
            console.log('error: ', err)
            fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/rent?rentId='+rentObj.id, {
              method: 'DELETE'
            })
            alert('Failed to rent this ebook');
          })
        } else
          alert(rentObj.error);
      })
      .catch((err) => {
        alert("Failed to rent this ebook");
        console.log('error: ', err)
      })
    }
  }

  showCartModal(bookId, price, actions) {
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      console.log('add to cart')
      if (actions.includes("rent") && actions.includes("buy"))
        this.setState({
          showCartModal: true,
          currentSelection: {
            'bookId': bookId,
            'price': price
          }
        })
      else if (actions.includes("rent")) {
        this.setState({
          showCartModal: false,
          showRentModalForCart: true,
          currentSelection: {
            'bookId': bookId,
            'price': price
          }
        })
      }
      else {
        this.addToCart('onylybuy', bookId);
      }
    }
  }

  addToCart(action, bookId) {
    this.setState({showCartModal: false})
    let userId = localStorage.getItem('userId');
    if (userId == null) {
      alert("Kindly login first.");
    } else {
      console.log('add to cart');
      let payload = {
        'userId': userId,
        'action': action,
        'bookId': this.state.currentSelection.bookId
      };
      if (action === 'onylybuy') {
        payload.action = 'buy'
        payload['bookId'] = bookId
      }
      if (action === 'rent') {
        payload.rentDuration = parseInt(this.state.rentDuration)
        this.setState({showRentModalForCart: false});
      }
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/cart/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then((response) => {
          console.log('success: ', response)
          if (response !== undefined && response !== null && (response.error === undefined || response.error === null))
            alert('Ebook added to cart successfully');
          else
            alert(response.error);
        })
        .catch((err) => {
          alert("Failed to add this book to cart");
          console.log('error: ', err)
        })
      
    }
  }

  fetchBooks(url) {
    fetch(url)
    .then(data=> 
      data.json()
    ).then(
      (data) => {
        this.setState({books: data.filter(ebook => ebook.actions.includes('buy') || ebook.actions.includes('rent'))
              .map(ebook => (
          <div className="col" key={ebook.id} style={{ marginBottom:"3rem" }}>
            <Card style={{ width: '20rem' }}>
              <a className="viewlink" href={"/view/" + ebook.id}>
                <Card.Img variant="top" width="100%" height="400px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/" + ebook.image} />
              </a>
                <Card.Body>
                  <a className="viewlink" href={"/view/" + ebook.id}>
                    <Card.Title>{ebook.booktitle}</Card.Title>
                    <Card.Text>
                      <span className="authorSpan">&ensp;by <em>{ebook.author}</em></span><br/>
                      <span className="text-danger">₹{ebook.price}</span>
                    </Card.Text>
                  </a>
                  <div className="row button-content">
                    {
                      ebook.actions.includes('buy') ?
                        <Button className="col custom-button" onClick={this.buy.bind(this, ebook.id)} style={{marginTop: "5%",marginRight:"1rem"}} variant="secondary">Buy</Button>
                      : <></>
                    }
                    {
                      ebook.actions.includes('rent') ?
                        <Button className="col custom-button" onClick={this.showRentModal.bind(this, ebook.id, ebook.price)} style={{marginTop: "5%",marginRight:"1rem"}} variant="secondary">Rent</Button>
                      : <></>
                    }
                    <Button className="col custom-button" onClick={this.showCartModal.bind(this, ebook.id, ebook.price, ebook.actions)} style={{marginTop: "5%"}} variant="secondary">+ Cart</Button>
                    {/* <a target="_blank" rel="noreferrer" href={process.env.REACT_APP_BACKEND_EBOOK_URL + '/uploads/' + ebook.booktitle + '.pdf'}><Button>View Book</Button></a> */}
                  </div>
                </Card.Body>
            </Card>
          </div>
        ))});
      }
    )
    .catch((err) => {
      this.setState({message: "No Book available"});
      console.log(err);
    });
  }

  render() {
  return <div className="container">
      <input className="mt-3 mb-3 form-control me-2" onChange={this.onFilterTextChange.bind(this)} type="search" placeholder="Search" aria-label="Search"/>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {this.state.books}
        <Modal show={this.state.showCartModal} onHide={() => {this.setState({showCartModal: false})}}>
          <Modal.Header closeButton>
            <Modal.Title>Ebook Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>Select one of the following options</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.addToCart.bind(this, 'buy')}>
              Buy
            </Button>
            <Button variant="primary" onClick={() => (this.setState({showRentModalForCart: true}))}>
              Rent
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showRentModal || this.state.showRentModalForCart} onHide={() => {this.setState({showRentModal: false, showRentModalForCart: false})}}>
          <Modal.Header closeButton>
            <Modal.Title>Rent Duration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>For how many days do you want to rent this book?</Form.Label>
              <Form.Control
                type="number"
                placeholder="Rent Duration"
                onChange={(e) => this.updateRentDuration(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {this.setState({showRentModal: false, currentSelection: {}, showRentModalForCart: false})}}>
              Cancel
            </Button>
            <Button variant="primary" onClick={ (this.state.showRentModalForCart) ? this.addToCart.bind(this, 'rent') : this.rent.bind(this)}>
              Rent
            </Button>
          </Modal.Footer>
        </Modal>
        {this.state.message}
      </div>
    </div>;
  }
}

export default Main;