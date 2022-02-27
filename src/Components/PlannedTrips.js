import React, { Component } from "react";
import Axios from "axios";
import {viewBookingURL} from "../BackendURL"
import { Redirect } from "react-router-dom";
// import { deleteURL} from "../BackendURL";
class PlannedTrips extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings : [],
            successMessage : "",
            errorMessage : "",
            userId : sessionStorage.getItem("userId"),
            userName : sessionStorage.getItem("userName"),
            hotDeal: false,
            refundAmout: "",
            dem: ""
        }
    }
    //Making a GET request to get all the bookings associated with a particular user
    getBookings = () => {
        Axios.get(viewBookingURL+this.state.userId).then(response => {
            this.setState({ bookings: response.data, errorMessage : null });
        }).catch(error => {
            if(error.response) {
                this.setState({ bookings: null , errorMessage: error.response.data.message});
            } else {
                this.setState({ bookings: null , errorMessage: "Bookings cannot be fetched currently, please try again after some time"});
            }
        })
    }
    //Making a DELETE request to delete the booking
    // cancelBooking = event => {
    //     Axios.delete(deleteURL + event.target.value).then(response => {
    //         this.setState({refundAmout: response.data, dem: null});
    //         sessionStorage.setItem("refundedAmount", this.state.refundAmout);
    //         window.location.reload(false);
    //     }).catch(error => {
    //         if(error.response) {
    //             this.setState({refundAmout : null, dem : error.response.data.message});
    //         } else {
    //             this.setState({refundAmout : null, dem : "Your request could not be processed, please try again after some time"});
    //         }
    //     });
    // }
    componentDidMount() {
        this.getBookings();
    }
    //If user has no bookings, offer him to go  to hot deals section
    goToHotDeals = () => {
        this.setState({hotDeal: true});
    }
    //To get the date in Month Day, Year Format
    getGoodDateFormat = (changeThis) => {
        var date = new Date(changeThis);
        let year = date.getFullYear();
        let day = date.getDate();
        let monthNumber = date.getMonth();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sptember", "October", "November", "December"];
        let newDate= months[monthNumber] +" " + day.toString() + ", " + year.toString();
        return newDate;
    }
    componentWillUnmount() {
        sessionStorage.removeItem("refundedAmount");
    }
    render()  {
        if(this.state.hotDeal === true) {
            return <Redirect to = {"/hotDeals"}/>
        }
        return(
            <div className="container-fluid allBg" style={{ "padding": "100px 10px 10px 10px" }}>
                {sessionStorage.getItem("refundedAmount") ? (<div  className="container rounded bg-light  text-center shadow-lg p-3 mb-5 bg-white rounded" style={{ "padding": "20px 20px 20px 20px" }}>
                    <span className = "text-success font-weight-bold">Trip successfully canceled, and ${parseInt(sessionStorage.getItem("refundedAmount"),10).toLocaleString()} as been refunded.</span>
                </div>):null}
                {this.state.bookings == null ? (<div className="container rounded bg-light  text-center shadow-lg p-3 mb-5 bg-white rounded" style={{ "padding": "20px 20px 20px 20px" }}>
                    <span className="display-4">Sorry!! You don't have any trips planned </span>
                    <br/>
                    <br/>
                    <button className = "btn btn-primary" onClick = {this.goToHotDeals}>Click Here to Hot Deals</button>
                </div>) : this.state.bookings.map(booking => (
                    <div key = {"B" + booking.bookingId}>
                        <div className="container rounded  shadow-lg p-3 mb-5 bg-white rounded mx-auto" style={{ "padding": "70px 70px 70px 70px" }}>
                            <div className = "row">
                                <div className = "col-sm">
                                    <img src = {booking.destination.imageUrl} className="rounded mx-auto d-block" alt = "destination" style = {{width:"400px","margin":"auto", "display": "block"}}/>
                                </div>
                                <div className = "col-lg-5" style ={{"width":"500px"}}>
                                    <h3 className = "font-weight-bold">{booking.destination.destinationName}</h3>
                                    <br/>
                                    <div className = "row">
                                        <div className = "col-sm-4"><span className = "font-weight-bold text-secondary">From: </span></div>
                                        <div className = "col-md  font-weight-bold"><em>{this.getGoodDateFormat(booking.checkIn)}</em></div>
                                    </div>
                                    <div className = "row">
                                        <div className = "col-sm-4"><span className = "font-weight-bold text-secondary">To: </span></div>
                                        <div className = "col-sm font-weight-bold"><em>{this.getGoodDateFormat(booking.checkOut)}</em></div>
                                    </div> 
                                    <div className = "row">
                                        <div className = "col-sm-4"><span className = "font-weight-bold text-secondary">No of People: </span></div>
                                        <div className = "col-sm font-weight-bold"><em>{booking.noOfPeople}</em></div>
                                    </div> 
                                </div>
                                <div className = "col-sm">
                                    <h2 className = "text-center font-weight-bold">You Paid: <span className = "text-success">${(booking.totalCost).toLocaleString()}</span></h2>
                                    <br/><br/>
                                    <button type="button" className="btn btn-danger btn-block" data-toggle="modal" data-target={"#B" + booking.bookingId}>Claim Refund</button>
                                    <div className="modal fade" id={"B" + booking.bookingId} tabIndex="-1" aria-labelledby={"B" + booking.bookingId + "Label"} aria-hidden="true">
                                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                                <div className="modal-content">         
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id={"B" + booking.bookingId + "Label"}>Claim refund?</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Are you sure you want to cancel your trip to "<em>{booking.destination.destinationName}</em>" and claim refund?</p>   
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.cancelBooking} value = {booking.bookingId}>Cancel Trip</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>     
                    </div>
                ))}            
            </div>
        );
    }
}
export default PlannedTrips;