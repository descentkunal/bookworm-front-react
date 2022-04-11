import React, {useEffect, useState} from 'react';
import { Card, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { Container,Row,Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [book, setBook] = useState();
  const [count, setcount] = useState(0);
  const {id} = useParams();
  const [message, setMessage] = useState("Book unavailable");
  const [index] = useState(-1);
  let history = useNavigate();

  function RemoveBook(cartId) {
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/cart/deleteBookFromCart?cartId=" + cartId,{ method: 'DELETE' })
    .then(data=> 
      data.json()
    ).then((data)=>{
      setcount(0);
      fetchData();
    });
  }

   function fetchData() {
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/cart/fetchAllItemsByUserId?userId=" + 
    (localStorage.getItem('userId') || ''))
    .then(data=> 
      data.json()
    ).then(
      (data) => {
        data.map((d) => {
          if (d.action === 'rent' ) {
          d.rentAmount = d.bookId.price * 0.01 * d.rentDuration
          setcount((prev) => {return prev + parseInt(d.rentAmount.toString())})
          }
          if (d.action === 'buy')
          {
            setcount((prev) => {return prev + parseInt(d.bookId.price.toString())})
          }
          return d
        })
        if (data.length === 0) {
          setMessage("Cart is empty")
          setBook(null);
        } else
          setBook(data);
      }
    ).catch(err => (setMessage("Cart is empty")))
  }

  useEffect(() => {
    fetchData();
  },[]);

  const buyAndRent = () => {
    console.log('books: ', book)
    let bookIds = book.map((b) => {
      return b.bookId.id
    })
    console.log('bookds:', bookIds)
    let setBooks = new Set(bookIds)
    console.log('setBookds:', setBooks)
    if (setBooks.size !== bookIds.length){
      alert('You are trying to buy and rent a same book. Kindly remove redundant books from cart.');
      return;
    }
    //buy and rent books
    book.forEach((info)=> {
      let url = process.env.REACT_APP_BACKEND_EBOOK_URL;
      info.bookId = info.bookId.id
      if (info.action === 'buy') {
        url = url + '/billing/buy'
      } else if (info.action === 'rent') {
        info.startDate = new Date()
        let numberOfDays = parseInt(info.rentDuration)
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + numberOfDays);
        info.endDate = endDate;
        url = url + '/rent/'
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      }).then(res => res.json())
      .then((res) => {
        if (info.action === 'rent'){
          info.rentId = res.id
          fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/billing/addBookToBilling', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
          })
          .then(billing => billing.json())
          .then((billing) => {
            console.log('success: ', billing)
          }).catch((err) => {
            console.log('error: ', err)
            fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/rent?rentId='+res.id, {
              method: 'DELETE'
            })
          });
        }
      })
    });
    alert('All eBooks are purchased');
    clearCart();
  }

  const redirectToHomePage = () => {
    history("/Main");
  }

  const clearCart = () => {
    let userId = localStorage.getItem('userId');
      fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/cart/clearCart?userId="+ userId,{ method: 'DELETE' })
      .then(data=> 
        data.json()
      ).then((data)=>{
        setcount(0);
        fetchData();
      });
  }
  
  function cartdata() {
    return(<Container fluid>
      <Row>     
          <Col xs={8} md={10} >
            {
            book
            .map((info,i) => (
              (i!==index) ?
              <div className="d-flex align-items-center" key={info.id}>
                <div>
                <h3 className="mb-4" style={{ marginLeft: "1rem", marginTop: "1rem" }}>
                </h3>
                <div>
                  <Card style={{ width: "65rem", marginLeft: "1rem" }}>
                    <Card.Body>
                      <div className="d-flex">
                        <img
                          src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/" + info.bookId.img} 
                          height={"120rem"}
                          width={"100rem"} alt="NA" />
                        <div
                          className="d-flex flex-column "
                          style={{ marginLeft: "1rem" }}
                        >
                          <Card.Title>{info.bookId.booktitle}</Card.Title>
                          <Card.Text>
      
                           by {info.bookId.author}
                           </Card.Text>
                           <Card.Text>
                           {
                              info.action === 'buy' ?
                              <span className="text-danger">₹{info.bookId.price}</span>
                              :
                              info.action === 'rent' ?
                              <span className="text-danger">₹{(info.bookId.price * info.rentDuration * 0.01).toFixed(2)}</span>
                              : <></>
                            }
                           </Card.Text>
                           <Card.Text>
                           <b>for {info.action}</b>
                           </Card.Text>
      
                          <Button
                            variant="danger"
                            onClick={(e) => RemoveBook(info.cartId)}
                            
                            style={{
                              width: "10rem",
                              marginLeft: "45rem",
                              marginTop: "1rem",
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              </div>
              :<></>
            ))}
          </Col>
          <Col xs={4} md={2}>
            <Card>
            <div className="d-flex flex-column " style={{ marginLeft: "1rem" ,marginRight: "1rem" }}>
              <h3>Subtotal ({book.length} items): ₹{count}</h3>
                <Button variant="warning" className="mt-2 ml-2 " onClick={() => {buyAndRent()}}>
                    Proceed to buy and rent
                </Button>
                <Button variant="primary" className="mt-2 ml-2 mb-2" onClick={() => {redirectToHomePage()}}>
                Continue shopping on bookworm
                </Button>
                <Button variant="danger" className="mt-2 ml-2 mb-2" onClick={() => {clearCart()}}>
                Clear Cart
                </Button>
               </div>
            </Card>
          </Col>
        </Row>
        </Container>);
  }

  return <div>
      {
    book ?
      cartdata()
      : <div style={{margin:"3rem"}}><b>{message}</b></div>
    }
    </div>;
};

export default Cart;