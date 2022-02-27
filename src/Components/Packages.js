import React, { Component } from "react";
import Axios from "axios";
import { packagesURL } from "../BackendURL";
import { Redirect } from "react-router-dom";

//Package component

class MyHeader extends React.Component {
    render() {
      const mystyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "10px",
        fontFamily: "Arial"
      };
      const searchStyle={
        width: "130px",
        boxSizing: "border-box",
        border: "2px solid #ccc",
        borderRadius: "4px",
        fontSize: "16px",
        backgroundColor: "yellow",
        backgroundPosition: "10px 10px", 
        backgroundRepeat: "no-repeat",
        padding: "12px 20px 12px 40px",
        "-webkit-transition": "width 0.4s ease-in-out",
        transition: "width 0.4s ease-in-out",
        "input[type=text]:focus": {
            width: "100%"
          }
      }
      
      

      return (
        <div>
        <form>
            <input type="text" name="search" placeholder="Search.." style={searchStyle}/>
        </form>
        </div>
      );
    }
  }

class Packages extends Component {
    constructor(props)  {
        super(props);
        this.state = {
            destinations :[],
            errorMessage : "",
            rangeFilters: {
                priceRange:"10000",
                nightsRange:"20"
            },
            book:false
        }
    }
    // Making Axios get request to get the destinations based on the continent
    getDestinations = () => {
        Axios.get(packagesURL+this.props.match.params.continent).then(response => {
            this.setState({ destinations: response.data, errorMessage : null });
        }).catch(error => {
            if(error.response) {
                this.setState({ destinations: null , errorMessage: error.response.data.message});
            } else {
                this.setState({ destinations: null , errorMessage: "Destinations cannot be fetched currently, please try again after some time"});
            }
        })
    }
    componentDidMount() {
        this.getDestinations();
    }
    //To handle the change
    handleChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { rangeFilters } = this.state;
        this.setState({ rangeFilters: { ...rangeFilters, [name]: value } });
    }
    // method to handle booking event
    createBooking = event => {
        sessionStorage.setItem("destination", event.target.value);
        this.setState({book : true})
    }
    
    //  sliderValue =()=> {var slider=document.getElementById("myRange");
    //                             var output = document.getElementById("demo");
    //                         output.innerHTML = slider.value; 
    //                             slider.oninput = function() {
    //                         output.innerHTML = this.value}
    //                             }

    //to render the component



        






    render() {
        if(this.state.book === true) {
           return <Redirect to={"/booking/"}/>;
        }
        return(
            <div className = "container-fluid packageBg" style = {{"padding": "50px 10px 10px 10px"}}>
                <div className = "container rounded bg-white">
                    <div className = "row">


                        <div className="container-fluid justify-center "> 
                            <div className="row  border-bottom border-black rounded shadow p-3" >
                            <div className="col-md-3 text-center">
                               <div className="row" style={{"margin-top":"4px"}}>
                                  <div className="col-md-9 text-center">
                                     <span className="text-center h6 font-weight-bold">Choose a continent</span>
                                  </div>
                                  <div className="col-md-3 text-center" style={{"margin-top":"6px","margin-left":"-45px"}}>
                                    <span className="pi pi-arrow-circle-right"></span>
                                  </div>
                               </div>
                            </div>

                                <div className="col-md-1 text-center" >
                                   <a href="http://localhost:3000/Packages/allPackages" target="_self" style={{"margin-left":"-65px"}}> <button className="btn btn-success">All</button></a>
                                 </div>  
                                 <div className="col-md-1 text-center">
                                   <a href="http://localhost:3000/Packages/asia" target="_self" style={{"margin-left":"-10px"}}> <button className="btn btn-success" >ASIA</button></a>
                                 </div>
                                 <div className="col-md-2 text-center">
                                   <a href="http://localhost:3000/Packages/europe" target="_self"> <button className="btn btn-success">EUROPE </button></a>
                                 </div>
                                 <div className="col-md-2 text-center">
                                    <a href="http://localhost:3000/Packages/australia" target="_self"> <button className="btn btn-success">AUSTRALIA</button></a>
                                 </div>
                                 <div className="col-md-3 text-center">
                                  <a href="http://localhost:3000/Packages/south america" target="_self"> <button className="btn btn-success">SOUTH AMERICA</button></a>
                                </div>
                            </div>
                        </div>
                    {this.state.destinations != null? (
                    <div className="container-fluid justify-center">    
                        <div className="row col-md-12 border-bottom border-black rounded p-2" >
                                <div className = "col-sm h5  text-success text-center rounded" style = {{"padding": "20px 20px 20px 20px","marginRight":"5px"}}>
                                    <div   className="text-center col-lg" style={{"background":"#8dcdff0d","height": "40px"}}><label htmlFor="priceRange" style={{"margin-top":"7px"}}><h4><span className="text-center"> Price Range: ${this.state.rangeFilters.priceRange} </span></h4></label></div>
                                        <input
                                            type="range"
                                            className="form-control-range"
                                            name="priceRange"
                                            id = "priceRange"
                                            min = "2000"
                                            max = "10000"
                                            step = "500" 
                                            value = {this.state.rangeFilters.priceRange}
                                            onChange={this.handleChange}
                                        />                                    
                                    </div> 
                                    <div className = "col-sm h5  text-success text-center rounded"  style = {{"padding": "20px 20px 20px 20px","marginLeft":"5px"}}>
                                        <div className="text-center col-lg" style={{"background": "#8dcdff0d","height": "40px"}}><label htmlFor="priceRange" style={{"margin-top":"7px"}}><h4><span className="text-center"> Nights:{this.state.rangeFilters.nightsRange} </span></h4></label></div>
                                            <input
                                                type="range"
                                                className="form-control-range"
                                                name="nightsRange"
                                                id = "nightsRange"
                                                min = "1"
                                                max = "20"
                                                step = "1"
                                                value = {this.state.rangeFilters.nightsRange}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                </div>  
                            </div> ):null}    
                        </div>
                    </div>
                <br/>
                {this.state.destinations == null?(<div className = "container shadow-sm p-3 mb-5 bg-white rounded" style = {{"padding": "20px 20px 20px 20px"}}>
                        <span className = "h3 text-danger">{this.state.errorMessage}</span>
                </div>):<span>
                {this.state.destinations.filter(destination => {
                    if(destination.noOfNights <= this.state.rangeFilters.nightsRange && destination.chargePerPerson <= this.state.rangeFilters.priceRange) {
                        return true;
                    } else {
                        return false;
                    }
                }).map(destination => (
                    <div key = {destination.destinationId}>
                        <div className = "container rounded bg-light mx-auto  shadow-lg p-3 mb-5 bg-dark text-white rounded" style = {{"padding": "20px 20px 20px 20px"}}>

                           {/* <marquee width="100%" direction="left" ><h5 className="text-warning"> !!! Book your Dream Destination !!!</h5> </marquee>  */}
                           <h2 className="text-info text-center font-weight-bold "> {destination.destinationName.split(":")[0]}<span className="text-info font-weight-normal text-muted">:{destination.destinationName.split(":")[1]}</span></h2>
                            <br />
                            <br />
                            <div className = "row">
                                                             
                            

                               <div className = "col-sm mx-auto  bg-image hover-zoom">
                                    <img src = {destination.imageUrl} alt = "destination" className = "hover-shadow rounded mx-auto d-block"  style = {{width:"400px","margin":"auto", "display": "block"}}/>
                                </div>
                                <div className = "col-lg border-left border-info">
                                    <span className = "badge badge-warning">{destination.noOfNights} Nights</span>
                                    <br/>
                                    <div className = "badge badge-danger" style={{padding : "5px 5px 5px 5px"}}>{destination.discount > 0 ? (<span>{destination.discount}% Instant Discount</span>):null}</div>
                                    <div><p className = "text-justify">{destination.details.about}</p></div>
                                </div>
                                <div className = "col-sm">
                                    <h3 className="text-center">Prices Starting From:</h3>
                                    <h4 className = "text-center text-success">${destination.chargePerPerson.toLocaleString()}</h4>
                                    <div>
                                    <br/>
                                    <br/>
                                    <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target={"#"+ destination.destinationId}>View Details</button>
                                    <button type="button" className="btn btn-info btn-block" onClick = {this.createBooking} value ={JSON.stringify(destination)}>Book <i className="pi pi-check-square "></i></button> 
                                    <div className = "modal fade" id = {destination.destinationId} tabIndex="-1" aria-labelledby={destination.destinationId + "Label"} aria-hidden="true">
                                        <div className = "modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                            <div className = "modal-content">
                                                <div className = "modal-header">
                                                    <h5 className = "modal-title" id = {destination.destinationId + "Label"}>Itinerary</h5>
                                                    <button type="button" className="close " data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className = "modal-body">
                                                    <div className = "container rounded bg-white text-dark">
                                                        <div className = "row bg-white  shadow-lg p-3 mb-5 bg-white  rounded justify-content-center">
                                                            <h1 className = "text-center">{destination.destinationName}</h1>
                                                        </div>
                                                        <div className = "row bg-light bg-white  shadow-lg p-3 mb-5 bg-white  rounded">
                                                            <img src = {destination.imageUrl} alt = "destination" style = {{width:"400px"}} className = "rounded mx-auto image-fluid"/>
                                                        </div>
                                                        <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                            <div className = "col-sm">
                                                                <h3 className = "text-center">Tour Highlights:</h3>
                                                                {destination.details.highlights.split(",").map(highlight => (
                                                                    <ul className = "list-group list-group-flush" key = {"H" + destination.destinationId + "-" + highlight}>
                                                                        <li className = "list-group-item" key = {highlight}>{highlight}</li>
                                                                    </ul>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                            <div className = "col-sm">
                                                                <h3 className = "text-center">Packages Inclusions:</h3>
                                                                {destination.details.packageInclusion.split(",").map(pack => (
                                                                    <ul className = "list-group list-group-flush"key = {"PA" + destination.destinationId + "-" + pack}>
                                                                        <li className = "list-group-item" key = {pack}>{pack}</li>
                                                                    </ul>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                            <div className = "col-sm">
                                                                <h3 className = "text-center">Prices starting form <span className = "text-success">${destination.chargePerPerson.toLocaleString()}</span></h3>
                                                            </div>
                                                        </div>
                                                        <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                            <div className = "col-sm">
                                                                <h3 className = "text-center">Tour Pace:</h3>
                                                                <p className = "text-justify">{destination.details.pace}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className = "modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-info" data-dismiss="modal" onClick = {this.createBooking} value ={JSON.stringify(destination)}>Book</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                              </div> 
                              </div>
                            </div>
                        </div>
                        <br/>
                    </div>
                ))} </span>}
            </div>
        );
    }
}
export default Packages;