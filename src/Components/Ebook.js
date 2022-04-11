import {
  Card,
  Carousel,
  Button,
  Navbar,
  Container,
  Nav
} from "react-bootstrap";
import React, { Component } from "react";


import '../css/Main.css';

class Ebook extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      message: "",
      searchText: ""
    }
  }

  componentDidMount() {
    this.fetchBooks(process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/");
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
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/billing/buy', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          'userId': userId,
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
        this.setState({books: data.map(ebook => (
          <div class="col" key={ebook.id} style={{ marginBottom:"3rem" }}>
            <Card style={{ width: '20rem' }}>
            <a className="viewlink" href={"/view/" + ebook.id}>
                <Card.Img variant="top" width="100%" height="200px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/" + ebook.image} />
              </a>
                <Card.Body>
                  <a className="viewlink" href={"/view/" + ebook.id}>
                    <Card.Title>{ebook.booktitle}</Card.Title>
                    <Card.Text>
                      <span className="authorSpan">&ensp;by <em>{ebook.author}</em></span><br/>
                      <span className="text-danger">₹{ebook.price}</span>
                    </Card.Text>
                  </a>
                  <div className="row">
                    <Button className="col" onClick={this.buy.bind(this, ebook.id)} style={{marginTop: "5%",marginRight:"1rem"}} variant="secondary">Buy</Button>
                    <Button className="col custom-button" onClick={this.showCartModal.bind(this, ebook.id, ebook.price, ebook.actions)} style={{marginTop: "5%"}} variant="secondary">Add to Cart</Button>
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
        {this.state.message}
      </div>
    </div>;
  }
}

export default Ebook;