import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

import Header from '../partials/Header'
import Footer from '../partials/Footer'
import apiInstance from "../../utils/axios";
import useAxios from '../../utils/useAxios';


const AllCategory = () => {
    const axiosInstance = useAxios();
    const [category, setCategory] = useState([]);
    const fetchCategory = async () => {
        // const response = await apiInstance.get(`post/category/list/`);
        const response = await axiosInstance.get(`post/category/list/`);
        setCategory(response.data);
    };

    useEffect(() => {
        fetchCategory();
    }, []);



    return (
        <>
            <Header />

            <div className="bg-light pt-5 pb-5 mb-3 mt-3">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12 ">
                            <div className="mb-4">
                                <h2>Categories</h2>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between ">
                                {category?.map((c, index) => (
                                    <div className="mt-2  " key={index}>
                                        <Link to={`/category/${c.slug}/`} className="text-decoration-none text-dark">
                                            <div className="card bg-transparent ">
                                                <img className="card-img" src={c.image} style={{ width: "150px", height: "80px", objectFit: "cover" }} alt="card image" />
                                                <div className="d-flex flex-column align-items-center mt-3 pb-2">
                                                    <h5 className="mb-0 ">{c.title}</h5>
                                                    <small>{c.post_count} Articles</small>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </>
    )
}

export default AllCategory
