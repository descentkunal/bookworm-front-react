import React, { Component } from "react";
import {
  Card,
  Button, OverlayTrigger, Tooltip
} from "react-bootstrap";
import '../css/Main.css';

class MyShelf extends Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      message: "",
      searchText: ""
    }
  }

  componentDidMount() {
    let userId = localStorage.getItem("userId");
    if (userId === null) {
      alert("Kindly login first.");
      return;
    }
    this.fetchBooks(process.env.REACT_APP_BACKEND_EBOOK_URL + "/billing/fetchAllBooksByUserId?userId=" + userId);
  }

  onFilterTextChange(searchTextField) {
    this.setState({
      searchText: searchTextField.target.value
    })
    console.log(this.state)
    this.fetchBooksBasedOnSearch(searchTextField.target.value);
  }

  fetchBooksBasedOnSearch(searchText) {
    let url = process.env.REACT_APP_BACKEND_EBOOK_URL + "/billing/";
    if (searchText !== "" && searchText !== undefined) {
      url += "search?searchText=" + searchText
    }
    this.fetchBooks(url);
  }

  openBook(url) {
    // const fileURL = URL(url);
    // const pdfWindow =  window.open()
    // pdfWindow.location.href = fileURL;
    console.log(url);
  }

  fetchBooks(url) {
    fetch(url)
    .then(data=> 
      data.json()
    ).then(
      (ebooks) => {
        console.log(ebooks)
        this.setState({books: ebooks.map(ebook => (
          <div class="col" key={ebook.id} style={{ marginBottom:"3rem" }}>
            <Card style={{ width: '20rem' }}>
              <Card.Img variant="top" width="100%" height="400px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/" + ebook.bookId.imagePath} />
              
                <Card.Body>
                   <Card.Title>{ebook.bookId.booktitle}</Card.Title>
                    <Card.Text>
                      <span className="authorSpan">&ensp;by <em>{ebook.bookId.author}</em></span><br/>
                      {
                        ebook.action === 'buy' ? 
                          <span><b>Purchase Type:</b> Buy</span>
                        : ebook.action === 'rent' ?
                          <>
                            {/* <span><b>Purchase Type:</b> Rent</span><br/> */}
                            <OverlayTrigger
                              delay={{ hide: 450, show: 300 }}
                              overlay={(props) => (
                                <Tooltip {...props}>
                                  <span><b>Available till:</b> {new Date(ebook.rentId.endDate).getDate()+'-' + (new Date(ebook.rentId.endDate).getMonth()+1) + '-'+new Date(ebook.rentId.endDate).getFullYear() + ' ' + new Date(ebook.rentId.endDate).getHours() + ':' + new Date(ebook.rentId.endDate).getMinutes()}</span>
                                </Tooltip>
                              )}
                              placement="bottom">
                                <button class="myShelfTooltipButton"><span><b>Purchase Type:</b> Rent</span><br/></button>
                            </OverlayTrigger>
                            </>
                        : ebook.action === 'lend' ?
                        <>
                          <span><b>Purchase Type:</b> Lend</span>
                        </>
                        : <></>
                      }
                    </Card.Text>
                    <a className="viewlink" target="_blank" rel="noreferrer" href={process.env.REACT_APP_BACKEND_EBOOK_URL + '/ebooks/' + ebook.bookId.pdfPath}>
                      <div className="row button-content">
                        <Button className="col custom-button"  style={{marginTop: "5%"}} variant="secondary">View eBook</Button>
                      </div>
                    </a>
                </Card.Body>
            </Card>
          </div>
        ))})
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

export default MyShelf;
