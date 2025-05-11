import { faReact, faPython } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div className="row bg-dark  mx-0 card card-header flex-row justify-content-between align-items-center text-md-start">
                <div className="col-md-3 mb-1 mb-md-0">
                    <Link className="nav-link active text-white " to="/">Home</Link>
                    <Link className="nav-link active text-white " to="/all-category/">Category</Link>
                </div>
                <div className="col-md-3 mb-1 mb-md-0">
                    <Link className="nav-link active text-white " to="/contact/">Contact</Link>
                    <Link className="nav-link active text-white " to="/about/">About</Link>
                </div>
                <div className="col-md-4">
                    <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://linkedin.com/in/aakash-jha-a11931257">
                                <i className="fab fa-linkedin-in" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://github.com/Aakash-Jha3903">
                                <i className="fab fa-github" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://facebook.com/">
                                <i className="fab fa-facebook-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://twitter.com/">
                                <i className="fab fa-twitter-square" />
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://youtube.com/">
                                <i className="fab fa-youtube-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" target="_blank" href="https://instagram.com/">
                                <i className="fab fa-instagram" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className=" m-0 pb-2 mb-md-0 bg-dark text-center ">
                <div className="text-primary-hover text-white text-center">

                    <Link className="text-center text-decoration-none text-white   " to="/">
                            <FontAwesomeIcon
                                icon={faReact}
                                spin
                                size="lg"
                                style={{ marginRight: '10px', color: "#61dafb" }} 
                            />
                            <FontAwesomeIcon
                                icon={faPython}
                                size="lg"
                            />
                        </Link> {' '}
                    Gyaani | Made with ❤️ by Aakash Jha 


                </div>
            </div>
        </footer>
    );
}

export default Footer;
