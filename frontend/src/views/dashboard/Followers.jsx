import React, { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";
import { SERVER_URL } from "../../utils/constants";

import Header from "../partials/Header";
import Footer from "../partials/Footer";

function Followers() {
    const [followers, setFollowers] = useState([]); // List of followers
    const userId = useUserData()?.user_id;

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await apiInstance.get(`/user/followers/${userId}/`);
                setFollowers(response.data);
            } catch (error) {
                console.error("Error fetching followers data:", error);
                Toast("error", "Failed to fetch followers data.");
            }
        };
        fetchFollowers();
    }, [userId]);

    return (
        <>
            <Header />
            <div className="followers-page">
                <h1>Followers</h1>
                {followers.length > 0 ? (
                    <ul className="list-group">
                        {followers.map((follower) => (
                            <li key={follower.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <img
                                        src={
                                                follower.following.profile?.image
                                                ? `${SERVER_URL}/${follower.following.profile?.image}`
                                                : `${SERVER_URL}/default-profile.png`
                                        }
                                        alt="Follower Avatar"
                                        className="rounded-circle me-2"
                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                    {follower.following.full_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no followers yet.</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Followers;