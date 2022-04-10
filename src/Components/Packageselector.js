import React from 'react';
import { useState, useEffect } from "react";
import {
    Card,
    Carousel,
    Button,
    Navbar,
    Container,
    Nav
  } from "react-bootstrap";

export function Packageselector(props) {
 const [Pack, setPack] = useState([]);
 useEffect(() => {
 fetch("http://localhost:5000/package/")
     .then(res => res.json())
     .then((result) => { setPack(result); }
 );
 }, []);
    console.log(Pack);
return (
 <div className="container">
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
   
   { Pack.map(pack => (
        <div class="col">
    <Card style={{ width: '18rem' }}>
  {/* <Card.Img variant="top"  /> */}
  <Card.Body>
    <Card.Title>{pack.packageName}</Card.Title>
    <Card.Text> {pack.noOfDays} Days </Card.Text>
    <Card.Text> ₹ {pack.lendAmount} </Card.Text>
    <Card.Text> For {pack.noOfBooks} Books </Card.Text>
    <Button variant="primary">Select Package </Button>
  </Card.Body>
</Card>
    </div>
      ))}
 
    </div>
    </div>
 );
    }
export default Packageselector;
