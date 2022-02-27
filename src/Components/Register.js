import React, { Component } from "react";
import axios from "axios";
import "../custom.css";
import { Redirect } from "react-router-dom";
import { backendUrlRegister } from "../BackendURL";

//Register Component
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //To store form values
            formValue: {
                userName: "",
                emailId: "",
                contactNumber: "",
                password: "",
                confirmPassword:""
            },
            //Display the form error message
            formErrorMessage: {
                userName: "",
                emailId: "",
                confirmPassword:"",
                contactNumber: "",
                password: ""
            },
            //form Validation
            formValid: {
                userName: false,
                emailId: false,
                contactNumber: false,
                password: false,
                confirmPassword:false,
                buttonActive: false
            },
            //Display the Success message
            successMessage: "",
            errorMessage: "",
            goToLogin : false
        };
    }
    //Method to make a POST call to the backend and Register the user
    submitRegistration = () => {
        const { formValue } = this.state;
        this.setState({ errorMessage: "", successMessage: "" })
        axios.post(backendUrlRegister, formValue)
            .then(response => {
                this.setState({ successMessage: response.data, errorMessage: "" });
                console.log(this.state.successMessage);
            }).catch(error => {
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message, successMessage: "" });
                } else {
                    this.setState({ errorMessage: "Please run the backend", successMessage: "" });
                }
            });
    }
    //Method to handle the Submit
    handleSubmit = event => {
        event.preventDefault();
        this.submitRegistration();
    };
    //Method to handle the change in any Field of the form
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { formValue } = this.state;
        this.setState({ formValue: { ...formValue, [name]: value } });
        this.validateField(name, value);
    };

    //Method to Validate fields of the form
    validateField = (fieldName, value) => {
        let fieldErrorMessage = this.state.formErrorMessage;
        let formValid = this.state.formValid;

        switch (fieldName) {
            case "userName":
                const nameRegex = /^[A-z]+( [A-z]+)*$/;
                if (value.trim() === "") {
                    fieldErrorMessage.userName = "Field required";
                    formValid.userName = false;

                } else if (!value.match(nameRegex)) {
                    fieldErrorMessage.userName = "Invalid name";
                    formValid.userName = false;

                } else {
                    fieldErrorMessage.userName = "";
                    formValid.userName = true;
                }
                break;
            case "emailId":
                const emailRegex = /[a-z0-9]+@[a-z0-9]+.com$/;
                if (value.trim() === "") {
                    fieldErrorMessage.emailId = "Field required";
                    formValid.emailId = false;

                } else if (!value.match(emailRegex)) {
                    fieldErrorMessage.emailId = "Invalid emailId";
                    formValid.emailId = false;

                } else {
                    fieldErrorMessage.emailId = "";
                    formValid.emailId = true;
                }
                break;
            case "contactNumber":
                const contactRegex = /^[6789][0-9]{9}$/;
                if (value.trim() === "") {
                    fieldErrorMessage.contactNumber = "Field required";
                    formValid.contactNumber = false;

                } else if (!value.match(contactRegex)) {
                    fieldErrorMessage.contactNumber = "Invalid Contact Number";
                    formValid.contactNumber = false;

                } else {
                    fieldErrorMessage.contactNumber = "";
                    formValid.contactNumber = true;
                }
                break;
            case "password":
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,20}$/;
                if (value.trim() === "" ){
                    fieldErrorMessage.password = "Field required";
                    formValid.password = false;

                } else if (!value.match(passwordRegex) || (value.trim().length<=7 || value.trim().length>=20)) {
                    fieldErrorMessage.password = "Invalid Password";
                    formValid.password = false;

                } else {
                    fieldErrorMessage.password = "";
                    formValid.password = true;
                }
                break;
                case "confirmPassword":
                let pswd=this.state.formValue.password;
                if (value.trim() === pswd ){
                    formValid.confirmPassword = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.userName && formValid.emailId && formValid.contactNumber && formValid.password && formValid.confirmPassword;
        this.setState({ formErrorMessage: fieldErrorMessage, formValid: formValid, successMessage: "" });
    }
    //Method to take the user to Login page
    goToLogin = event => {
        this.setState({goToLogin : true})
    }
    //Method to render the component
    render() {
        if(this.state.goToLogin === true) {
            return <Redirect to={"/login"}/>;
        } else if (!(sessionStorage.getItem("userId") === null)) {
            return <Redirect to = {"/"}/>
        }
        return (
            <div className = "container-fluid registerBg" style = {{"padding": "40px 10px 10px 10px" }}>
                <h3 className = "display-5 text-center text-white  styleh1 font-weight-bold">Welcome to WanderLust</h3>
                <h3 className = "display-5 text-center styleh1 text-white font-weight-bold">Join Us!</h3>
                <br/>
                <form className="form form-horizontal shadow-lg p-3 mb-5 bg-white rounded" onSubmit={this.handleSubmit} style = {{"opacity":"0.9","padding": "20px 20px 20px 20px", "textAlign":"left", "width":"500px","marginLeft":"auto","marginRight":"auto"}}>
                   <h3 className="text-info text-center border-bottom border-black rounded p-2 ">Registration form</h3>
                    <div className="form-group" style = {{"paddingTop":"20px"}}>
                        <label htmlFor="userName" className = "control-label font-weight-bold">Name:<span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            value={this.state.formValue.userName}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter your name"
                        />
                        <span name="userNameError" className="text-danger  font-weight-bold">
                            {this.state.formErrorMessage.userName}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailId" className = "control-label font-weight-bold">Email ID:<span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="emailId"
                            id="emailId"
                            value={this.state.formValue.emailId}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter your email id"

                        />
                        <span name="emailIdError" className="text-danger  font-weight-bold">
                            {this.state.formErrorMessage.emailId}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactNumber" className = "control-label font-weight-bold">Contact Number:<span className="text-danger">*</span></label>
                        <input
                            type="number"
                            name="contactNumber"
                            id="contactNumber"
                            value={this.state.formValue.contactNumber}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter your contact no"

                        />
                        <span name="contactNumberError" className="text-danger  font-weight-bold">
                            {this.state.formErrorMessage.contactNumber}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className = "control-label font-weight-bold">Password:<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.formValue.password}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter your password"

                        />
                        <span name="passwordError" className="text-danger  font-weight-bold">
                            {this.state.formErrorMessage.password}
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm password" className = "control-label font-weight-bold">Confirm Password:<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={this.state.formValue.confirmPassword}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter password again"

                        />
                        <span name="confirmPasswordError" className="text-danger  font-weight-bold">
                            {this.state.formErrorMessage.confirmPassword}
                        </span>
                    </div>
                    <span className="text-muted  font-weight-bold " >Fields marked <span className="text-danger">*</span> are mandatory</span><br/>
                    <button type="submit" className="btn btn-primary btn-block" data-toggle="modal" data-target="#myModal" style={{"margin-top":"14px"}}
                        disabled={!this.state.formValid.buttonActive}
                    >Register</button>
                    <br/>
                </form>
                <br/>

                        <div class="modal shadow" id="myModal">
                        <div class="modal-dialog">
                            <div class="modal-content">

                        {this.state.successMessage?(
                        <>
                            <div class="modal-header text-center">
                                <h4 className="modal-title text-center">Registraion Completed<span className="text-success pi pi-check"></span></h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div class="modal-body text-justify">
                                <h5 className="text-success text-justify text-center">{this.state.successMessage}</h5>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                <span><button className = "btn btn-primary btn-block" data-dismiss="modal" onClick = {this.goToLogin}>LOGIN</button></span>
                            </div>
                        </>

                        ):

                        <>
                        <div class="modal-header text-center">
                                <h4 className="modal-title text-center">Registration failed<span className="text-danger pi pi-times"></span></h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            
                            <div class="modal-body text-justify">
                                <h6 className="text-danger text-justify text-center">{this.state.errorMessage}</h6>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                       </> 
                    }
            </div>
        </div>
      </div>
                <div className = "container bg-white">
                    <div name="successMessage" className="font-weight-bold text-success text-bold text-center">
                        <span className = "h5 ">{this.state.successMessage}</span>
                        {this.state.successMessage?(<div>
                            <button className = "btn btn-primary btn-block" onClick = {this.goToLogin}>GO TO LOGIN</button>
                        </div>):null}
                    </div>
                    <span name="errorMessage" className="text-danger font-weight-bold">
                    <span className = "h4 ">{this.state.errorMessage}</span>
                    </span>
                </div>


 </div>
        );
    }
}

export default Register;