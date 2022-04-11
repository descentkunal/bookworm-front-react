import {Card,Button,} from "react-bootstrap";
import React from 'react';
import { useState, useEffect } from "react";

export function AdminViewEbook(props) {
 const [Ebook, setEbook] = useState([]);
 const [count, setcount] = useState(0);
    
    
 useEffect(() => {
 fetch("http://localhost:5000/ebooks/")
     .then(res => res.json())
     .then((result) => { setEbook(result); }
 );
 }, []);
    console.log(Ebook);

    function RemoveBook(id) {
        console.log(id);
        fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/?id=" + id,
            { method: 'DELETE' })
      .then(data=> 
        data.json()
      ).then((data)=>{
        setcount(0);
       
      });

      
  }
return (
 <div className="container">
       <Button href="/Upload" variant="primary">Add Book</Button>
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">


   { Ebook.map(ebook => (
        <div class="col">
    <Card style={{ width: '18rem' }}>
    <a className="viewlink" href={"/view/" + ebook.id}>
                <Card.Img variant="top" width="100%" height="200px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebooks/" + ebook.image} />
              </a>
  <Card.Body>

    <Card.Title>Title:{ebook.booktitle}</Card.Title>
    <Card.Text>
    <span className="authorSpan">&ensp;by <em>{ebook.author}</em></span><br/>
    <span className="text-danger">₹{ebook.price}</span>
    </Card.Text>
    <Button
        variant="danger"
                       onClick={(e) => RemoveBook(ebook.id)}
                   >
        Remove
    </Button>
  </Card.Body>
</Card>
    </div>
      ))}
 
    </div>
    </div>
 );
    }
export default AdminViewEbook;