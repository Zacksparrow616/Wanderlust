import React, { Component } from "react";
import Axios from "axios";
import { Redirect } from "react-router-dom";
import { bookPackageURL } from "../BackendURL";
class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged_userId: sessionStorage.getItem("userId"),
            logged_userName: sessionStorage.getItem("userName"),
            dialog_visible: false,
            logged_out: false,
            goToLogin : false,
            destination : JSON.parse(sessionStorage.getItem("destination")),
            booking: {
                checkIn: "",
                checkOut:"",
                noOfPeople:"",
                totalCost:"",
                timeOfBooking:"",
                user: {
                    userId : sessionStorage.getItem("userId"),
                    userName : sessionStorage.getItem("userName"),
                    emailId: "",
                    password: ""
                },
                destination : JSON.parse(sessionStorage.getItem("destination"))
            },
            formValue: {
                noOfPeople: "",
                checkIn: "",
            },
            formErrorMessage: {
                noOfPeople: "",
                checkIn: "",
            },
            formValid: {
                noOfPeople: false,
                checkIn: false,
                buttonActive: false
            },
            flightCharge :false,
            successMessage: "",
            errorMessage: "",
            goBack : false,
            viewPlannedTrips: false
        };
    }
    //To Handel Booking Event
    handleSubmit = event => {
        event.preventDefault();
        this.submitBooking();
    };
    //Making a POST request to the backend to make a booking
    submitBooking = event => {
        var booking = {...this.state.booking}
        booking.checkIn = new Date(this.state.formValue.checkIn);
        booking.checkOut = new Date(booking.checkIn);
        booking.checkOut.setDate(booking.checkIn.getDate() + this.state.destination.noOfNights);
        booking.noOfPeople = this.state.formValue.noOfPeople;
        booking.totalCost = (this.state.destination.chargePerPerson + this.state.destination.flightCharge) * this.state.formValue.noOfPeople;
        booking.timeOfBooking = new Date().getTime();
        Axios.post(bookPackageURL,booking).then(response => {
            this.setState({successMessage : response.data, errorMessage : ""});
        }).catch(error => {
            if(error.response) {
                this.setState({errorMessage: error.response.data.message, successMessage : ""});
            } else {
                this.setState({errorMessage: "Cannot Book currently"});
            }
        });
       }
    //Method to handle change in fields of the form
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { formValue } = this.state;
        this.setState({ formValue: { ...formValue, [name]: value } });
        this.validateField(name, value);
        
    };
    //Method to filp Checkbox state
    checkCheckbox = event => {
        this.setState({flightCharge: !this.state.flightCharge});
    }
    //Method to validate fields
    validateField = (fieldName, value) => {
        let fieldErrorMessage = this.state.formErrorMessage;
        let formValid = this.state.formValid;
        switch (fieldName) {
            case "noOfPeople" :
                if(value==="") {
                    fieldErrorMessage.noOfPeople = "Field Required";
                    formValid.noOfPeople = false;
                }   
                else if (value.match(/^[1-5]$/)) {
                        fieldErrorMessage.noOfPeople  = "";
                        formValid.noOfPeople = true;
                
                } else {
                    fieldErrorMessage.noOfPeople = "The Minimum is 1 Person and Maximum 5 People can go on this trp.";
                    formValid.noOfPeople = false;
                }
                break;
            case "checkIn" :
                var checkInDate = new Date(value);
                var today = new Date();
                today.setHours(0,0,0,0);
                checkInDate.setHours(0,0,0,0);
                if(checkInDate <= today) {
                    fieldErrorMessage.checkIn = "Check In date should be after today."
                    formValid.checkIn = false;
                } else {
                    fieldErrorMessage.checkIn = "";
                    formValid.checkIn = true;
                }
                break;
            default: break;
                
        }
        formValid.buttonActive = formValid.noOfPeople && formValid.checkIn;
        this.setState({ formErrorMessage: fieldErrorMessage, formValid: formValid, successMessage: "" });
    }
    //Method to go back to Home in case user chooses to go back
    goToHome = () => {
        this.setState({goBack: true})
    }

    goToLogin = event => {
        this.setState({goToLogin : true})
    }
    //Method to go to planned trips for a user
    goToPlannedTrips = event => {
        this.setState({goToPlannedTrips : true});
    }
    //Method to get total charge in a LocaleStirng format
    getCharge = () => {
        let totalCost = this.state.formValue.noOfPeople * this.state.destination.chargePerPerson;
        if(this.state.flightCharge) {
            totalCost = totalCost+ this.state.destination.flightCharge* this.state.formValue.noOfPeople;
        }
        return totalCost.toLocaleString();
    }
    //Method to get checkout Date in a Month Day, Year format
    getCheckOutDate = () => {
        var checkInDate = new Date(this.state.formValue.checkIn);
        let nights = parseInt(this.state.destination.noOfNights, 10);
        let days = nights;
        checkInDate.setDate(checkInDate.getDate() + days);
        let year = checkInDate.getFullYear();
        let day = checkInDate.getDate();
        let monthNumber = checkInDate.getMonth();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sptember", "October", "November", "December"];
        let checkOutDate = months[monthNumber] +" " + day.toString() + ", " + year.toString();
        return checkOutDate;
    }
    //Same as above, method to get checkin date in a Month Day, Year format
    getCheckInDate = () => {
        var checkInDate = new Date(this.state.formValue.checkIn);
        let year = checkInDate.getFullYear();
        let day = checkInDate.getDate();
        let monthNumber = checkInDate.getMonth();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "Sptember", "October", "November", "December"];
        let reqDate = months[monthNumber] +" " + day.toString() + ", " + year.toString();  
        return reqDate;
    }

    render() {
        if(this.state.goToLogin === true) {
            return <Redirect to={"/login"}/>;
        }
        if(this.state.goBack === true) {
            return <Redirect to={"/"}/>
        }
        if(this.state.goToPlannedTrips === true) {
            return <Redirect to = {"/viewBookings"}/>
        }
        return(
            <div className = "container-fluid" style = {{padding : "100px 20px 20px 20px"}}>
                {this.state.logged_userId?(<div>
                    <div className = "container-fluid mx-auto">
                        <div className = "row">
                            <div className = "col-lg">
                                <h1 className = "text-center font-weight-bold display-4">{this.state.destination.destinationName}</h1>
                                <br/>
                                <div className = "row bg-white">
                                    <img src = {this.state.destination.imageUrl} style = {{width:"400px"}} alt = "destination" className = " shadow-lg p-3 mb-5 bg-white rounded mx-auto image-fluid"/>
                                </div>
                                <div className = "card  shadow-lg p-3 mb-5 bg-white rounded border-0">
                                    <div className = "card-header bg-white border-0">
                                        <h2 className = "text-center font-weight-bold btn-block" data-toggle="collapse" href="#overviewCollapse" role="button" aria-expanded="false" aria-controls="overviewCollapse">Overview</h2>
                                    </div>
                                    <div className = "collapse" id = "overviewCollapse">
                                        <div className = "card-body border-top border-dark">
                                            <p class-name = "text-justify">{this.state.destination.details.about}</p>   
                                        </div>
                                    </div>
                                </div>  
                                 <div className = "card  shadow-lg p-3 mb-5 bg-white rounded border-0">
                                    <div className = "card-header bg-white border-0">
                                        <h2 className = "text-center font-weight-bold btn-block" data-toggle="collapse" href="#packageCollapse" role="button" aria-expanded="false" aria-controls="packageCollapse">Package Inclusion</h2>
                                    </div>
                                    <div className = "collapse" id = "packageCollapse">
                                        <div className = "card-body  border-top border-dark">
                                            {this.state.destination.details.packageInclusion.split(",").map( pack => (
                                                <ul className = "list-group list-group-flush" key = {"H" + this.state.destination.destinationId + "-" + pack}>
                                                    <li className = "list-group-item" key = {pack}>{pack}</li>
                                                </ul>
                                            ))}   
                                        </div>
                                    </div>
                                </div> 
                                <div className = "card  shadow-lg p-3 mb-5 bg-white rounded border-0">
                                    <div className = "card-header bg-white border-0">
                                        <h2 className = "text-center font-weight-bold btn-block" data-toggle="collapse" href="#itineraryCollapse" role="button" aria-expanded="false" aria-controls="itineraryCollapse">Itinerary</h2>
                                    </div>
                                    <div className = "collapse" id = "itineraryCollapse">
                                        <div className = "card-body  border-top border-dark">
                                            <h3>Day Wise Itinerary</h3>
                                            <br/>
                                            <h4>Day 1:</h4>
                                            <p className = "text-justify">{this.state.destination.details.itinerary.firstDay}</p>
                                            {this.state.destination.details.itinerary.restOfDays.split(",").map((day, count) => {
                                                return (<div key = {"Itinerary" + count}>
                                                    <h4>Day {count+2}:</h4>
                                                    <p className = "text-justify">{day}</p>
                                                </div>)
                                            })}
                                            <h4>Day {this.state.destination.details.itinerary.restOfDays.split(",").length + 2}:</h4>
                                            <p className = "text-justify">{this.state.destination.details.itinerary.lastDay}</p>
                                            <br/>
                                            <span className = "text-danger"><small>**Itinerary is just a suggestion, it is subjected to change as per circumstances.</small></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = "col-lg">
                                <div className = "conatiner">
                                    <h2 className = "text-center font-weight-bold display-4">Book Now!</h2>
                                    <br/>
                                    <form className = "form  shadow-lg p-3 mb-5 bg-white rounded" onSubmit={this.handleSubmit}  style = {{"padding": "20px 20px 20px 20px", "textAlign":"left", "width":"500px","marginLeft":"auto","marginRight":"auto"}}>
                                        <div className = "form-group" style = {{"paddingTop":"10px"}}>
                                            <label htmlFor = "noOfPeople" className = " font-weight-bold">Number of Travellers:</label>
                                            <input type = "number" min="0" name = "noOfPeople" id = "noOfPeople" value = {this.state.formValue.noOfPeople} onChange = {this.handleChange}  className = "form-control"/>
                                            <span htmlFor = "noOfPeople" id = "noOfPeopleError" className = "text-danger font-weight-bold">{this.state.formErrorMessage.noOfPeople}</span>
                                        </div>
                                        <div className = "form-group font-weight-bold">
                                            <label htmlFor = "checkIn">Tour Start Date:</label>
                                            <input  type = "date"  className = "form-control" name = "checkIn" value = {this.state.formValue.checkIn} onChange = {this.handleChange}/>
                                            <span htmlFor = "checkIn" id = "checkInError" className = "text-danger font-weight-bold">{this.state.formErrorMessage.checkIn}</span>
                                        </div>
                                        <br/>
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input className="form-check-input" name = "flightCharge" id = "flightCharge" onChange = {this.checkCheckbox}  type="checkbox"/>
                                                <label className="form-check-label  font-weight-bold" htmlFor="flightCharge">
                                                    Include Flight
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            {this.state.formValid.checkIn === true ? (
                                                <div>
                                                   <u>Your trip ends on: <em>{this.getCheckOutDate()}</em></u>
                                                </div>
                                            ) : null}
                                        </div>
                                        <br/>
                                        <div>
                                            {this.state.formValue.noOfPeople  !== "" ? (
                                                <div className = "h3 font-weight-bold ">
                                                    You Pay: <span className = "text-success text-center">${this.getCharge()}</span>
                                                </div>
                                            ) : null} 
                                        </div>
                                        <br/>
                                        <button type = "submit" disabled = {!(this.state.formValid.buttonActive && (this.state.successMessage ===""))} className = "btn btn-info btn-block">Confirm Booking</button>
                                        <button className = "btn btn-secondary btn-block" onClick = {this.goToHome}>Go Back</button>
                                    </form>             
                                </div>
                                <div className = "container">
                                    <div style = {{"padding": "20px 20px 20px 20px",  "width":"500px","marginLeft":"auto","marginRight":"auto"}} >
                                            {this.state.successMessage !== ""?(<div className = " shadow-lg p-3 mb-5 bg-white rounded border-0">
                                                <div className = "h4 text-success font-weight-bold text-center">{this.state.successMessage}</div>
                                                <br/>
                                                <div className = "text-center text-secondary font-weight-bold">
                                                    Your Trip Starts on : {this.getCheckInDate()}
                                                    <br/>
                                                    Your Trip Ends on : {this.getCheckOutDate()}
                                                    <br/>
                                                    <br/>
                                                    <button className = "btn btn-block btn-info" onClick = {this.goToPlannedTrips}>Go To Planned Trips</button>
                                                    <br/>
                                                </div>
                                            </div>):null}
                                    </div>
                                    <div style = {{"padding": "20px 20px 20px 20px",  "width":"500px","marginLeft":"auto","marginRight":"auto"}} >
                                            {this.state.errorMessage !== ""?(<div className = " shadow-lg p-3 mb-5 bg-white rounded border-0">
                                                <div className = "h4 text-danger font-weight-bold text-center">{this.state.errorMessage}</div>
                                                <br/>
                                                <button className = "btn btn-block btn-info" onClick = {this.goToHome}>Go To Home</button>
                                            </div>):null}
                                    </div>              
                                </div>
                            </div>
                        </div>
                    </div>
                </div>):(<div className = "container  shadow-lg p-3 mb-5 bg-white rounded text-center" style = {{padding : "100px 100px 100px 100px"}}>
                    <div className = "display-4">Your Must Login to Continue!!</div>
                    <br/><br/>
                    <button onClick = {this.goToLogin} className = "btn btn-primary btn-large">Click Here to Log In</button>
                </div>)}
            </div>
        );
    }
}
export default Booking;