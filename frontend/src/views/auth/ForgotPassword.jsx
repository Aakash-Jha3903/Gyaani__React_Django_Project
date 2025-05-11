import { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
// import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";
import useAxios from "../../utils/useAxios";

function ForgotPassword() {
    const apiInstance = useAxios();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP, Step 3: Reset password
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async () => {
        try {
            setIsLoading(true);
            await apiInstance.post("user/send-password-reset-otp/", { email });
            Swal.fire({
                icon: "success",
                title: "OTP Sent!",
                text: "Check your email for the OTP.",
            });
            setStep(2); // Move to OTP verification step
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || `Something went wrong. ${error}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async () => {
        try {
            setIsLoading(true);
            await apiInstance.post("user/reset-password-with-otp/", {
                email,
                otp,
                new_password: newPassword,
            });
            Swal.fire({
                icon: "success",
                title: "Password Reset!",
                text: "Your password has been reset successfully.",
            });
            setStep(1); // Reset to the first step
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "Invalid OTP or email.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">Forgot Password</h1>
                                    <span>Let's help you get back into your account</span>
                                </div>
                                {step === 1 && (
                                    <div className="needs-validation">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email Address
                                            </label>
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                name="email"
                                                placeholder="user123@gmail.com"
                                                required
                                            />
                                        </div>
                                        <div className="d-grid">
                                            <button onClick={handleEmailSubmit} className="btn btn-primary" disabled={isLoading}>
                                                {isLoading ? "Processing..." : "Send OTP"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="needs-validation">
                                        <div className="mb-3">
                                            <label htmlFor="otp" className="form-label">
                                                Enter OTP
                                            </label>
                                            <input
                                                onChange={(e) => setOtp(e.target.value)}
                                                value={otp}
                                                type="text"
                                                id="otp"
                                                className="form-control"
                                                name="otp"
                                                placeholder="Enter 4-digit OTP"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label">
                                                New Password
                                            </label>
                                            <input
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                value={newPassword}
                                                type="password"
                                                id="newPassword"
                                                className="form-control"
                                                name="newPassword"
                                                placeholder="Enter new password"
                                                required
                                            />
                                        </div>
                                        <div className="d-grid">
                                            <button onClick={handleOtpSubmit} className="btn btn-primary" disabled={isLoading}>
                                                {isLoading ? "Processing..." : "Reset Password"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default ForgotPassword;