import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/ViewEbook.css';

function ViewEbook(props) {

    const [book, setBook] = useState();
    const [message] = useState("Book unavailable");
    const {id} = useParams();

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/view?id=" + id)
        .then(data=> 
          data.json()
        ).then(
          (data) => {
            setBook(data);
          }
        )
    }, []);

    const expand = ()=> {
        const description = document.getElementsByClassName("bookDescription")[0];
        description.className = "bookDescription-expanded";
        const moreButton = document.getElementsByClassName("expandLink")[0];
        moreButton.style.display = "none";
        const lessButton = document.getElementsByClassName("shrinkLink")[0];
        lessButton.style.display = "block";
    }

    const shrink = () => {
        const description = document.getElementsByClassName("bookDescription-expanded")[0];
        description.classList = ["bookDescription"];
        const moreButton = document.getElementsByClassName("expandLink")[0];
        moreButton.style.display = "block";
        const lessButton = document.getElementsByClassName("shrinkLink")[0];
        lessButton.style.display = "none";
    }
  
    return <div>
        {
            book ?
            <div className="container row" style={{'marginBottom': '1%'}}>
                <div>{book.category} / {book.subcategory}</div>
                <br/><br/>
                <div className="col-3" style={{'alignItems': 'center'}}>
                    <img className="img img-responsive" width="100%" height="400px" src={process.env.REACT_APP_BACKEND_EBOOK_URL+ '/' + book.img} alt="Not available"/>
                </div>
                <div className='col-6'>
                    <h2>{book.booktitle}</h2>
                    <h6>&emsp;by {book.author}</h6>
                    <span><em>Published by:</em> {book.publisher}</span><br/>
                    <br/>
                    <div>
                        <p className="bookDescription">{book.description}</p>
                        <button className="expandLink" onClick={expand}>more</button>
                        <button className="shrinkLink" onClick={shrink}>less</button>
                    </div>
                    <p>Buy now at <span className='text-danger'>₹ {book.price}</span><br></br>
                    <span>Inclusive of all taxes</span>
                    </p>
                    {book.availability === 'true' ? <b><p className='text-success'>Currently available</p></b> :
                    <b><p className='text-danger'>Currently unavailable</p></b>}

                    <div>
                        <Button className="addToCartButton">Add to cart</Button><br/>
                        <Button className="buyNowButton">Buy Now</Button>
                    </div>
                </div>
                <div className='col-3'></div>
            
            
            </div>
            : <div>{message}</div>
        }
    </div>;
}

export default ViewEbook;