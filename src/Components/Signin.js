import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const Signin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setMessage] = useState("");

  let history = useNavigate();

  const loginPage = () => {
    const payload = {
      "emailId": email,
      "password": password,
    };
    fetch(process.env.REACT_APP_BACKEND_USER_URL + "/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(data=> 
      data.json()
    ).then(
      (data) => {
        console.log("Data fetched", data)
        
        if (data !== undefined && data !== null && data.error !== undefined && data.error !== null) {
          setMessage("Authentication Failed");
        } else {
          console.log(data);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userType', data.userType)
          history("/main");
          window.location.reload(false);
        }
      }
    )
    .catch((err) => {
      setMessage("Authentication Failed");
      console.log("Error:", err);
    });
  };
  return (
    <div style={{ marginLeft: "9rem", marginTop: "3rem", marginBottom:"3rem" }}>
      <div className="d-flex">
        <img src={require("../images/login.jpg")} alt="Login"/>
        <div style={{ marginLeft: "4rem" }}>
          <h3>Sign in to your account</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                style={{ width: "25rem" }}
                onChange={(e) => setemail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                style={{ width: "25rem" }}
                onChange={(e) => setpassword(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{ width: "25rem" }}
              variant="success"
              onClick={loginPage}>
              Login
            </Button>
          </Form>
          {(message === "") &&
            <div></div>
          }
          {(message !== "") ? <div><span>{message}</span></div> : <div><span>{message}</span></div>}
        </div>
      </div>
    </div>
  );
};

export default Signin;
