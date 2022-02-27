import React, { Component } from "react";
import { hotDealsURL } from "../BackendURL";
import { Redirect } from "react-router-dom";
import Axios from "axios";
//Package component
class HotDeals extends Component {
    constructor() {
        super();
        this.state = {
            dealsData: [],
            errorMessage: "",
            book:false
        }
    }
 // Making Axios get request to get the Hot deals
    fetchHotDeals = () => {
        Axios.get(hotDealsURL).then(response => {
            this.setState({ dealsData: response.data, errorMessage: null });
        }).catch(error => {
            if (error.response) {
                this.setState({ dealsData: null, errorMessage: error.response.data.message });
            } else {
                this.setState({ dealsData: null, errorMessage: "Deals cannot be fetched currently" });
            }
        })
    }
    componentDidMount() {
        this.fetchHotDeals();
    }
    // to handle the booking event
    createBooking = event => {
        sessionStorage.setItem("destination",event.target.value)
        this.setState({book : true})
    }
    render() {
        if(this.state.book === true) {
            return <Redirect to={"/booking/"}/>;
         }
        return (
            <div className="container-fluid allBg" style={{ "padding": "100px 10px 10px 10px" }}>
                {this.state.dealsData == null ? (<div className="container rounded bg-light  text-center shadow-lg p-3 mb-5 bg-white rounded" style={{ "padding": "20px 20px 20px 20px" }}>
                    <span className="display-4 text-danger">Sorry!! No Hot Deals Available </span>
                </div>) : <span>{this.state.dealsData.map(deal => (
                    <div key = {deal.destinationId}>
                        <div className="container rounded  shadow-lg p-3 mb-5 bg-white rounded mx-auto" style={{ "padding": "70px 70px 70px 70px" }}>
                            <div className="row">
                                <div className="col-sm mx-auto">
                                    <img src={deal.imageUrl} className="rounded mx-auto d-block"  alt = "Destination"style = {{width:"500px","margin":"auto", "display": "block"}} />
                                </div>
                                <div className="col-lg border-left border-info">
                                    <h3 className="text-center">{deal.destinationName}</h3>
                                    <h5 className = "text-danger text-center" style={{padding : "5px 5px 5px 5px"}}>{deal.discount}% Instant Discount</h5>
                                    <div><p className ="text-justify">{deal.details.about}</p></div>
                                    <div>
                                        <br />
                                        <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target={"#" + deal.destinationId}>Check Itinerary</button>
                                        <button type="button" className="btn btn-info btn-block" onClick={this.createBooking} value={JSON.stringify(deal)}>Book</button>
                                        <div className="modal fade" id={deal.destinationId} tabIndex="-1" aria-labelledby={deal.destinationId + "Label"} aria-hidden="true">
                                            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id={deal.destinationId + "Label"}>Itinerary</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="container rounded bg-white">
                                                            <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded justify-content-center">
                                                                <h1 className = "text-center">{deal.destinationName}</h1>
                                                            </div>
                                                            <div className="row shadow-lg p-3 mb-5 bg-white rounded shadow-lg p-3 mb-5 bg-white rounded">
                                                                <img src={deal.imageUrl} alt = "Destination" style = {{width:"400px"}} className="rounded mx-auto image-fluid" />
                                                            </div>
                                                            <div className="row  shadow-lg p-3 mb-5 bg-white rounded">
                                                                <div className="col-sm">
                                                                    <h3 className="text-center">Tour Highlights:</h3>
                                                                    {deal.details.highlights.split(",").map(highlight => (
                                                                        <ul className="list-group list-group-flush" key = {"H" + deal.destinationId + "-" + highlight}>
                                                                            <li className="list-group-item" key = {highlight}>{highlight}</li>
                                                                        </ul>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="row shadow-lg p-3 mb-5 bg-white rounded">
                                                                <div className="col-sm">
                                                                    <h3 className="text-center">Packages Inclusions:</h3>
                                                                    {deal.details.packageInclusion.split(",").map(pack => (
                                                                        <ul className="list-group list-group-flush"  key = {"PA" + deal.destinationId + "-" + pack}>
                                                                            <li className="list-group-item" key = {pack}>{pack}</li>
                                                                        </ul>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                                <div className = "col-sm">
                                                                    <h3 className = "text-center">Prices starting form <span className = "text-success">${deal.chargePerPerson.toLocaleString()}</span></h3>
                                                                </div>
                                                            </div>
                                                            <div className = "row bg-white shadow-lg p-3 mb-5 bg-white rounded">
                                                                <div className = "col-sm">
                                                                    <h3 className = "text-center">Tour Pace:</h3>
                                                                    <p className = "text-justify">{deal.details.pace}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-info" data-dismiss="modal" onClick={this.createBooking} value={JSON.stringify(deal)}>Book</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                ))}</span>}
            </div>  
        );
    }
};

export default HotDeals;