import React from "react";
import { Link } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function NotFound() {
    return (
        <>
            <Header />
            <section className="container text-center">
                <Link to="/" className="text-decoration-none text-dark  " >
                    <div className="m-0">
                        <img src="https://i.pinimg.com/originals/e4/30/10/e430101033efff9a294eaafecbac846a.gif" alt="404-img" />
                    </div>
                    <h6 className="mt-0">
                        The page you are looking for does not exist. It might have been moved or deleted.
                    </h6>
                    <button className="btn btn-primary mt-1 mb-5">
                        <i className="fa-solid fa-house me-2"></i>
                    Go Back to Home
                    </button>
                </Link>
            </section>
            <Footer />
        </>
    );
}

export default NotFound;