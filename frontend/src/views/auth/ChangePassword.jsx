import React from "react";
import { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";

import useAxios from "../../utils/useAxios";
import Cookies from "js-cookie";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const userId = useUserData()?.user_id;

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!userId) {
            Toast("error", "User ID not found");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            Toast("warning", "New passwords do not match");
            return;
        }
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Toast("error", "Please fill in all fields");
            return;
        }
        
        try {
        const axiosInstance = useAxios();
        // console.log("Access Token:", Cookies.get("access_token")); // Debugging

            setIsLoading(true);

            // await apiInstance.post("user/change-password/", {
            const response = await axiosInstance.post("user/change-password/", {
                user_id: userId,
                current_password: currentPassword,
                new_password: newPassword,
            });
            // console.log("Response:", response.data);

            Toast("success", "Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (error) {
            Toast("error", error.response?.data?.error || `An error occurred  ${error}`,);
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
                                    <h1 className="mb-1 fw-bold">Change Password</h1>
                                    <span>Update your account password</span>
                                </div>
                                <form className="needs-validation" onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label htmlFor="currentPassword" className="form-label">
                                            Current Password
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter current password"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="newPassword" className="form-label">
                                            New Password
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter new password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="confirmNewPassword" className="form-label">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Confirm new password"
                                            required
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <div className="d-grid">
                                            {isLoading ? (
                                                <button disabled className="btn btn-primary">
                                                    Processing <i className="fas fa-spinner fa-spin"></i>
                                                </button>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    Update Password <i className="fas fa-check-circle"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default ChangePassword;