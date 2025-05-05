import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Search() {
    const [searchInput, setsearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allPosts, setAllPosts] = useState([]);

    // Fetch all posts initially
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await apiInstance.get("post/lists/");
                setAllPosts(response.data);
                setSearchResults(response.data); // Display all posts initially
            } catch (error) {
                console.error("Error fetching all posts:", error);
            }
        };
        fetchAllPosts();
    }, []);

    const handleSearchInput = (event) => {
        setsearchInput(event.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await apiInstance.get(
                `search-posts/?query=${searchInput}`
            );
            if (response.data.length === 0) {
                toast.error("No blog posts match your search query."); // Show toast message
            }
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div>
            <Header />
            <ToastContainer /> {/* Add ToastContainer to render toast messages */}
            <section className="p-0 pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h2 className="text-start d-block mt-1">
                                <i className="fas fa-search"></i> Search the Article
                            </h2>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search All Articles"
                                    value={searchInput}
                                    onChange={handleSearchInput}
                                    onKeyDown={(event => {
                                        if (event.key === "Enter") {
                                            handleSearch();
                                        }
                                    }
                                    )}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        {searchResults.map((result, index) => (
                            <div className="col-sm-6 col-lg-3" key={index}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img
                                            className="card-img img-fluid"
                                            style={{
                                                width: "100%",
                                                height: "160px",
                                                objectFit: "cover",
                                            }}
                                            src={`${result.image}`}
                                            alt="Blog image"
                                        />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link
                                                to={`/${result.slug}`}
                                                className="btn-link text-reset stretched-link fw-bold text-decoration-none"
                                            >
                                                {result.title?.slice(0, 32) + "..."}
                                            </Link>
                                        </h4>
                                        <ul
                                            className="mt-3 list-style-none"
                                            style={{ listStyle: "none" }}
                                        >
                                            <li>
                                                <a
                                                    href="#"
                                                    className="text-dark text-decoration-none"
                                                >
                                                    <i className="fas fa-user"></i>{" "}
                                                    {result.profile?.full_name || "Unknown"}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i>{" "}
                                                {moment(result.date).format("DD MMM, YYYY")}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i>{" "}
                                                {result.view || 0} Views
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Search;