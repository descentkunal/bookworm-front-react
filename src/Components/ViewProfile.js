import React, {useEffect, useState} from 'react';
import { Form } from 'react-bootstrap';
import pic from "../images/avatar.jpg";

function ViewProfile(props) {

    const [user, setUser] = useState();
    const id = localStorage.getItem('userId')
  console.log(id)

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_USER_URL + "/user/view?id=" + id)
        .then(data=> 
          data.json()
        ).then(
          (data) => {
              console.log(data)
            setUser(data);
          }
        )
    }, []);

  
    return <div>
        {
            user ?
            <div className="container row" style={{'marginBottom': '1%'}}>
                    <Form style={{ 'marginLeft': '10%','marginTop':'4rem','marginBottom':'4rem','border': '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <h2 style={{ 'marginTop': '1rem', 'marginLeft': '30rem' }}>Your Information</h2>
                        {/* <Image src={"./images/avatar.jpg"}></Image> */}
                        <img  src={pic}
                         width="400" 
                         height="400"/ >
                    <fieldset disabled><br></br>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Fullname</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.fullname}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Email Id</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.emailId}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Occupation</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.occupation}/>
                            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Professional Domain</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.professionalDomain}/>
                            
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Contact</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.contact}/>
                        </Form.Group> 
                         <Form.Group className="mb-3">
                            <Form.Label htmlFor="disabledTextInput" style={{'fontWeight':'bold'}}>Address</Form.Label>
                            <Form.Control id="disabledTextInput" value={user.address}/>
                        </Form.Group><br></br> 
                        
                      
                </fieldset>
            </Form>
                
            </div>
            :<div>{localStorage.getItem('userId')} </div>
        }
    </div>;
}

export default ViewProfile;