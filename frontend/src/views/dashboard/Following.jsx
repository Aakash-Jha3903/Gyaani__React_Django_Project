import React, { useState, useEffect } from "react";
// import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";
import { SERVER_URL } from '../../utils/constants';

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import useAxios from "../../utils/useAxios";

function Following() {
    const apiInstance = useAxios();
    const [following, setFollowing] = useState([]);
    const [unfollowedAuthors, setUnfollowedAuthors] = useState([]); // Temporarily track unfollowed authors
    const userId = useUserData()?.user_id;

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await apiInstance.get(`/user/following/${userId}/`);
                setFollowing(response.data);
            } catch (error) {
                console.error("Error fetching following data:", error);
                Toast("error", "Failed to fetch following data.");
            }
        };
        fetchFollowing();
    }, [userId]);

    const handleUnfollow = async (followingId) => {
        if (!userId || !followingId) {
            Toast("error", "Invalid user data. Please try again.");
            console.error("Invalid userId or followingId:", { userId, followingId }); // Debugging
            return;
        }

        console.log("Unfollow Payload:", { follower_id: userId, following_id: followingId }); // Debugging

        try {
            await apiInstance.post("/user/unfollow/", { follower_id: userId, following_id: followingId });
            Toast("success", "Unfollowed successfully!");

            // Remove the author from the following list and add to unfollowedAuthors
            const unfollowedAuthor = following.find((author) => author.following.id === followingId);
            setUnfollowedAuthors((prev) => [...prev, unfollowedAuthor]);
            setFollowing((prev) => prev.filter((author) => author.following.id !== followingId));
        } catch (error) {
            console.error("Error unfollowing user:", error.response?.data || error.message);
            Toast("error", `Failed to unfollow the user. ${error.response?.data?.error || "An error occurred."}`);
        }
    };

    const handleFollow = async (followingId) => {
        if (!userId || !followingId) {
            Toast("error", "Invalid user data. Please try again.");
            console.error("Invalid userId or followingId:", { userId, followingId }); // Debugging
            return;
        }

        console.log("Follow Payload:", { follower_id: userId, following_id: followingId }); // Debugging

        try {
            await apiInstance.post("/user/follow/", { follower_id: userId, following_id: followingId });
            Toast("success", "Followed successfully!");

            // Move the author back to the following list
            const refollowedAuthor = unfollowedAuthors.find((author) => author.following.id === followingId);
            setFollowing((prev) => [...prev, refollowedAuthor]);
            setUnfollowedAuthors((prev) => prev.filter((author) => author.following.id !== followingId));
        } catch (error) {
            console.error("Error following user:", error.response?.data || error.message);
            Toast("error", `Failed to follow the user. ${error.response?.data?.error || "An error occurred."}`);
        }
    };

    return (
        <>
            <Header />
            <div className="following-page p-5">
                <h1>Following</h1>
                {following.length > 0 ? (
                    <ul className="list-group">
                        {following.map((author) => (
                            <li key={author.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <img
                                        src={
                                            author.following?.profile?.image
                                                ? `${SERVER_URL}/${author.following.profile.image}`
                                                : `${SERVER_URL}/default-profile.png`
                                        }
                                        alt="Author Avatar"
                                        className="rounded-circle me-2"
                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                    {author.following.full_name}
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleUnfollow(author.following.id)}
                                >
                                    Unfollow
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are not following anyone yet.</p>
                )}

                {/* Show unfollowed authors with a Follow button */}
                {unfollowedAuthors.length > 0 && (
                    <div className="mt-0">
                        {/* <h2>Unfollowed Authors</h2> */}
                        <ul className="list-group">
                            {unfollowedAuthors.map((author) => (
                                <li key={author.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <img
                                            src={
                                                author.following?.profile?.image
                                                    ? `${SERVER_URL}/${author.following.profile.image}`
                                                    : `${SERVER_URL}/default-profile.png`
                                            }
                                            alt="Author Avatar"
                                            className="rounded-circle me-2"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        {author.following.full_name}
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleFollow(author.following.id)}
                                    >
                                        Follow
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Following;