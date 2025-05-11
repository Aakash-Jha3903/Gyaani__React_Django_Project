import React, { useState, useEffect } from "react";
// import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../../utils/constants";
import Toast from "../../plugin/Toast";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import useAxios from "../../utils/useAxios";

function Bookmarks() {
    const apiInstance = useAxios();
    const [bookmarks, setBookmarks] = useState([]);
    const userId = useUserData()?.user_id;

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await apiInstance.get(`/user/bookmarks/${userId}/`);
                setBookmarks(response.data);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
                Toast("error", "Failed to fetch bookmarks.");
            }
        };
        fetchBookmarks();
    }, [userId]);

    const handleUnbookmark = async (postID,bookmarkId) => {
        try {
            await apiInstance.post(`/post/bookmark-post/`, { user_id: userId, post_id: postID });
            Toast("success", "Bookmark removed successfully.");
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
        } catch (error) {
            console.log(`Unbookmarked post ID: ${postID} and Bookmark ID: ${bookmarkId}`);
            Toast("error", `Failed to remove bookmark.${error}`);
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h1 className="mb-4">My Bookmarks</h1>
                {bookmarks.length > 0 ? (
                    <ul className="list-group">
                        {bookmarks.map((bookmark) => (
                            <li key={bookmark.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={`${SERVER_URL}/${bookmark.post?.image}` || "https://via.placeholder.com/100"}
                                        alt="Post"
                                        className="rounded me-3"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div>
                                        <Link to={`/${bookmark.post?.slug}/`} className="h5 text-decoration-none text-dark">
                                            {bookmark.post?.title}
                                        </Link>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="text-muted small me-3">{new Date(bookmark.date).toLocaleDateString()}</span>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleUnbookmark(bookmark.post.id,bookmark.id)}
                                    >
                                        Unbookmark
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no bookmarks yet.</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Bookmarks;