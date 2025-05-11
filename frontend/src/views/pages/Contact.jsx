import React, { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "axios";
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
import Swal from 'sweetalert2';
import useUserData from "../../plugin/useUserData";

function Contact() {
    const apiInstance = useAxios();
    const userGmail = useUserData()?.email;
    const name = useUserData()?.full_name;
    const [formData, setFormData] = useState({
        name: `${name}`,
        email: `${userGmail}`,
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            Toast("info", "Sending message..."); 
            const response = await apiInstance.post("/sendGmail/contact/", formData);
            Swal.fire({
                title: 'Success',
                html: `Message successfully sent to Aakash Jha.<br>A copy has also been sent to you(${formData.email}).`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setFormData({
                name: `${name}`,
                email: `${formData.email}`,
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Error sending message:", error);
            Toast("error", "Failed to send the message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 mx-auto text-center">
                            <h1 className="fw-bold">Contact us</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto" >
                                <iframe 
                                    className="w-100 h-300 grayscale"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28018.57213968286!2d77.33659953853697!3d28.62012444294469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9f%3A0x3b7191b1286136c8!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1745297774298!5m2!1sen!2sin"
                                    height={500}
                                    loading="lazy"
                                    style={{ border: "1px solid black" }}
                                    aria-hidden="false"
                                    tabIndex={0}
                                />
                            <div className="row mt-5">
                                <div className="col-sm-6">
                                    <h3 className="fw-bold">Let's Work Together</h3>
                                    <p>I'm actively looking for job opportunities. Feel free to reach out and let’s discuss how I can contribute to your organization.</p>
                                    <ul className="list-unstyled">
                                        <li><MdEmail className="me-2" /> <strong>Email:</strong> aakashjha343@gmail.com</li>
                                        <li><MdPhone className="me-2" /> <strong>Phone:</strong> +91-8130586062</li>
                                        <li>
                                            <FaLinkedin className="me-2" />
                                            <strong>LinkedIn:</strong>{' '}
                                            <a href="https://www.linkedin.com/in/aakash-jha-a11931257/" target="_blank" rel="noopener noreferrer">
                                                https://www.linkedin.com/in/aakash-jha-a11931257/
                                            </a>
                                        </li>
                                        <li>
                                            <FaGithub className="me-2" />
                                            <strong>GitHub:</strong>{' '}
                                            <a href="https://github.com/Aakash-Jha3903" target="_blank" rel="noopener noreferrer">
                                                https://github.com/Aakash-Jha3903
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <hr className="my-5" />
                            <div className="row mb-5">
                                <div className="col-12">
                                    <h2 className="fw-bold">Send us a message</h2>
                                    <p>Please fill in the form below and we will contact you very soon. Your email address will not be published.</p>
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <input
                                                        required
                                                        name="name"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <input
                                                        required
                                                        name="email"
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="E-mail"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <input
                                                        required
                                                        name="subject"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <textarea
                                                        required
                                                        name="message"
                                                        cols={40}
                                                        rows={6}
                                                        className="form-control"
                                                        placeholder="Message...... "
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 text-start">
                                                <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                                                    {isSubmitting ? "Sending..." : "Send Message"}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Contact;