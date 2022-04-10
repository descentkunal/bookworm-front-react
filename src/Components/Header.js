import { useState, useEffect } from 'react';
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsFillCartFill } from "react-icons/bs";

function Header() {

  const [userDetails, setUserDetails] = useState(undefined);
  const [uType, setUserType] = useState(1);
  let history = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    setUserDetails(loggedInUser);
    setUserType(userType);
    console.log('loggedIN' , loggedInUser, userType)  
  }, []);

  const signout = function () {
    localStorage.clear();
    setUserDetails(undefined);
    setUserType(undefined);
    history('/');
    window.location.reload(false);
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky='top'>
      <Container fluid>
        <Navbar.Brand href="#"><img
            src={require("../images/logbook.png")}
            width="170"
            height="70"
            alt="React Bootstrap logo"
          /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll>
            <Nav.Link href={"/main"}>Home</Nav.Link>
            <Nav.Link href={"/ebook"}>ebook</Nav.Link>
            <Nav.Link href={"/lending-library"}>Lending Library</Nav.Link>

          </Nav>
            
            
            {
            (userDetails === null) ? 
            <></>
            :<>
            <Nav.Link href={"/my-shelf"} style={{display: 'block',color:'white' }}>My Shelf</Nav.Link>
            <Nav.Link href={"/cart"} style={{display: 'block',color:'white'}}><BsFillCartFill size="3em" color="white"/></Nav.Link>
            </>
            }

            {
            (userDetails === null) ? 
            <NavDropdown title="My Account" id="navbarScrollingDropdown" style={{display: 'none'}}>
              <NavDropdown.Item href="#action3">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item href="/purchase-history">Purchase History</NavDropdown.Item>
                <NavDropdown.Item href="/Packageselector">Packageselector</NavDropdown.Item>
              <NavDropdown.Item href="/View">View Profile</NavDropdown.Item>
                
            </NavDropdown>
            :
            <NavDropdown title="My Account" id="navbarScrollingDropdown" style={{display: 'block'}}>
              <NavDropdown.Item href="#action3">Edit Profile</NavDropdown.Item>

              {
                (uType === 0) ?
                <NavDropdown.Item href="#action3">List Ebooks</NavDropdown.Item>
                :<></>
              }

              <NavDropdown.Item href="/purchase-history">Purchase History</NavDropdown.Item>
                <NavDropdown.Item href="/Packageselector">Packageselector</NavDropdown.Item>
                <NavDropdown.Item href="/View">View Profile</NavDropdown.Item>
                
            </NavDropdown>
          }


          {
            (userDetails !== null)? 
            <>
            <Nav.Link href={"/signin"} style={{display: 'none',color:'white'}}>Signin</Nav.Link>
            <Nav.Link href={"/signup"} style={{display: 'none',color:'white'}}>Signup</Nav.Link>
            </>
            :
            <>
            <Nav.Link href={"/signin"} style={{display: 'block',color:'white'}}>Signin</Nav.Link>
            <Nav.Link href={"/signup"} style={{display: 'block',color:'white'}}>Signup</Nav.Link>
            </>
          }

          {
            (userDetails === null)? 
            <></>
            :
            <Nav.Link onClick={signout} style={{display: 'block',color:'white'}}>Signout</Nav.Link>
          }

        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
  }

export default Header;