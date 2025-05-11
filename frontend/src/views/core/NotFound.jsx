import React from "react";
import { Link } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function NotFound() {
    return (
        <>
            <Header />
            <section className="container text-center">
                <div className="mt-3">
                    <h3> 404 </h3>
                    <h4 className="text-danger">Page Not Found</h4>
                    <h5 className="text-muted">Sorry, the page you are looking for does not exist.</h5>
                    <h5 className="text-muted">Please check the URL or go back to the {" "}
                        <Link to="/" className="text-decoration-none text-dark " >
                            <button className=" btn btn-primary text-decoration-none text-white " >
                                <i className="fa-solid fa-house me-2"></i>Home.
                            </button>
                        </Link>
                    </h5>
                    <div className="m-0">
                        <img src="https://i.pinimg.com/originals/e4/30/10/e430101033efff9a294eaafecbac846a.gif" alt="404-img" />
                    </div>


                </div>
            </section>
            <Footer />
        </>
    );
}

export default NotFound;