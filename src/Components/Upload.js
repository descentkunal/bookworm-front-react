import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const Upload = () => {
  const [booktitle, setbooktitle] = useState("");
  const [author, setauthor] = useState("");
  const [price, setprice] = useState("");
  const [description, setdescription] = useState("");
  const [availability, setavailability] = useState("");
  const [buy, setbuy] = useState("");

   
  const addbook = () => {
    const payload = {
      "booktitle": booktitle,
      "author": author,
      "price": price,
      "description": description,
      "availability": availability,
      "buy": buy,
    };
    
    fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + "/ebook/", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(data=> 
      data.json()
    ).then(
      (data) => {
        console.log(data);
        if (data !== undefined && data !== null && data.error === undefined) {
            alert("book cadded successfully");
           
        } else
          alert("failed: book cannot be added")
      }
    )
  
  };

  
  return (
    <div style={{marginLeft: "2rem",marginTop: "2rem",marginBottom:"3rem" }}>
      <div className="d-flex">
           {/* <div>                
               <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                   <input ref="file" type="file" name="file" className="upload-file"/>
                   <input type="button" ref="button" value="Upload" onClick={this.uploadFile} />
               </form>                
            </div> */}
            <div style={{ marginLeft: "4rem" }}>
              <Form>
                
                  <Form.Group className="mb-3 " style={{ marginRight: "1rem" }}>
                  <Form.Label>Book Name</Form.Label>
                  <Form.Control
                   type="text"
                   placeholder="Enter book name"
                   style={{ width: "15rem" }}
                   onChange={(e) => setbooktitle(e.target.value)}
                  />
              </Form.Group>
              

              <Form.Group className="mb-3" controlId="">
              <Form.Label>author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author"
                style={{ width: "31rem" }}
                onChange={(e) => setauthor(e.target.value)}
              />
            </Form.Group>
            

           
              <Form.Group className="mb-3 " style={{ marginRight: "1rem" }}>
                <Form.Label>price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  style={{ width: "15rem" }}
                  onChange={(e) => setprice(e.target.value)}
                />
              </Form.Group>
              

              <Form.Group className="mb-3 ">
                <Form.Label>description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter confirm description"
                  style={{ width: "15rem" }}
                  onChange={(e) => setdescription(e.target.value)}
                />
              </Form.Group>
              

              <Form.Group className="mb-3">
              <Form.Label>availability</Form.Label>
              <Form.Control
                type="text"
                placeholder="available/not available"
                style={{ width: "31rem" }}
                onChange={(e) => setavailability(e.target.value)}
              />
            </Form.Group>
            

            <Form.Group className="mb-3">
              <Form.Label>buy</Form.Label>
              <Form.Control
                type="text"
                placeholder="buy"
                style={{ width: "31rem" }}
                onChange={(e) => setbuy(e.target.value)}
              />
            </Form.Group>

            <Button variant='danger'>Upload File</Button>
            <br></br>
            <br></br>
            <Button>Submit</Button>
              </Form>
            </div>


      </div>
     
    </div>
  );
};

export default Upload;
