import React, {useEffect, useState} from 'react';
import { Card, Popover, OverlayTrigger } from "react-bootstrap";
import '../css/PurchaseHistory.css';
import {BsCaretDownFill} from 'react-icons/bs';

function PurchaseHistory(props) {

    const [billingInfo, setBillingInfo] = useState([]);

    useEffect(() => {
        fetchBillingInfo();
    }, []);
    
    const fetchBillingInfo = async () => {
        // localStorage.setItem('userId', '6247e52dc7bdf6b72fb1dcb0')
        let response = await fetch(process.env.REACT_APP_BACKEND_EBOOK_URL + '/billing/fetchAllBooksByUserId?userId=' 
        + (localStorage.getItem('userId') || ''))
        response.json()
            .then( res => setBillingInfo(res));
    }

    return <div>
            &emsp;&emsp;&emsp;&emsp;<span>My Account</span>&nbsp;›&nbsp;<span>Purchase History</span>
            <br/> <br/>
            <h2>&emsp;&emsp;Purchase History</h2><br/>
        <table style={{width: '100%'}}><tbody>
        {
            billingInfo? (
                billingInfo.map(info => (
                    <tr key={info.id}><td>
                    <div className = "container row">
                    <div className='col'></div>
                    <div className='col-10 details'>
                        <Card style={{padding: '0', margin: '1% 1%'}}>
                            <Card.Header>
                                <div className="row">
                                    <div className="col-3">
                                        <span style={{textTransform: 'uppercase'}}><b>Order Placed</b></span>
                                        <br/>
                                        <span>
                                            {new Date(info.createdAt).getDate()+'-' + (new Date(info.createdAt).getMonth()+1) + '-'+new Date(info.createdAt).getFullYear()}
                                        </span>
                                    </div>
                                    <div className='col-5'>
                                        <span><b>ORDER TYPE</b></span>
                                        <br/>
                                        <div>
                                            {info.action === 'buy' ? 'Buy': 
                                            info.action === 'rent' ? <div>
                                                <OverlayTrigger trigger={["hover", "click", "focus"]} key='bottom' placement='bottom'
                                                        overlay={
                                                            <Popover id='popover-positioned-bottom'>
                                                            <Popover.Body>
                                                                <strong>Rent Duration</strong><br/>
                                                                <span>From: {new Date(info.rentId.startDate).getDate()+'-' + (new Date(info.rentId.startDate).getMonth()+1) + '-'+new Date(info.rentId.startDate).getFullYear()} </span><br/>
                                                                <span> To: {new Date(info.rentId.endDate).getDate()+'-' + (new Date(info.rentId.endDate).getMonth()+1) + '-'+new Date(info.rentId.endDate).getFullYear()} </span>
                                                            </Popover.Body>
                                                            </Popover>}>
                                                    <span variant="secondary">Rent <BsCaretDownFill /></span>
                                                </OverlayTrigger>
                                            </div> 
                                            : <div>
                                            <OverlayTrigger trigger={["hover", "click", "focus"]} key='bottom' placement='bottom'
                                                    overlay={
                                                        <Popover id='popover-positioned-bottom'>
                                                        <Popover.Body>
                                                            <strong>Lend Duration</strong><br/>
                                                            <span>From: {new Date(info.createdAt).getDate()+'-' + (new Date(info.createdAt).getMonth()+1) + '-'+new Date(info.createdAt).getFullYear()} </span><br/>
                                                            <span> To: {new Date(info.lendId.endDate).getDate()+'-' + (new Date(info.lendId.endDate).getMonth()+1) + '-'+new Date(info.lendId.endDate).getFullYear()} </span>
                                                        </Popover.Body>
                                                        </Popover>}>
                                                <span variant="secondary">Lend <BsCaretDownFill /></span>
                                            </OverlayTrigger>
                                        </div> }
                                        </div>
                                    </div>
                                    <div className='col-4'>
                                        <b>ORDER #</b> {info.id}
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className='row'>
                                <div className='col-2'>
                                    <img width="100%" height="200px" src={process.env.REACT_APP_BACKEND_EBOOK_URL + "/" + info.bookId.img} alt="NA"/>
                                </div>
                                <div className='col-10'>
                                    <Card.Title>{info.bookId.booktitle}</Card.Title>
                                    <Card.Text>
                                    <span className="authorSpan">&ensp;by <em>{info.bookId.author}</em></span><br/>
                                    {
                                        info.action === 'buy' ?
                                        <span className="text-danger">Paid ₹{info.bookId.price}</span>
                                        :
                                        info.action === 'rent' ?
                                        <span className="text-danger">Paid ₹{info.rentId.rentAmount}</span>
                                        : <></>
                                    }
                                    
                                    </Card.Text>
                                </div></div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className='col'></div>
                    </div>
                    </td>
                    </tr>
                ))
            ) : <></>
        }
        </tbody>
        </table>
    </div>;
}

export default PurchaseHistory;