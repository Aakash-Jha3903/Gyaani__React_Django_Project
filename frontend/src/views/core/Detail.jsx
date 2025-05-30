import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";
import '../../App.css';
import useAxios from "../../utils/useAxios";
import { useLocation } from 'react-router-dom';

function Detail() {
    const axiosInstance = useAxios();
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [createComment, setCreateComment] = useState({ full_name: "", email: "", comment: "" });

    const param = useParams();
    const [reply, setReply] = useState({});

    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [following, setFollowing] = useState([]);

    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);

    const userData = useUserData();
    const userId = userData?.user_id;
    const userName = userData?.full_name;
    const userEmail = userData?.email;

    // Fetch the post details
    const fetchPost = async () => {
        try {
            const response = await axiosInstance.get(`post/detail/${slug}/`);
            // console.log(JSON.stringify(response.data))
            setPost(response.data);
            setTags(response.data.tags.split(',').map(tag => tag.trim()));

            // Check if the logged-in user is following the post author
            const followStatusResponse = await axiosInstance.get(`/user/following/${userId}/`);
            const isFollowingAuthor = followStatusResponse.data.some(
                (follow) => follow.following.id === response.data.user?.id
            );
            setIsFollowing(isFollowingAuthor);

            // Check if the post is liked by the user in the past 
            setIsLiked(response.data.likes?.includes(userId));
            // Check if the post is bookmarked by the user in the past 
            setIsBookmarked(response.data.bookmarks?.includes(userId));

        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };
    const incrementViewCount = async () => {
        try {
            await axiosInstance.post(`/post/increment-view/${slug}/`);
        } catch (error) {
            navigate(`/404${location.pathname}/`);
            console.error("Error incrementing view count:", error);
        }
    };
    useEffect(() => {
        incrementViewCount();
        fetchPost();
    }, [slug]);
    // useEffect(() => {
    // fetchPost();
    // incrementViewCount();
    // }, []);

    const handleFollow = async () => {
        if (!userId || !post.user?.id) {
            Toast("error", "Invalid user data. Please try again.");
            return;
        }

        if (isFollowing) {
            Toast("info", "You are already following this user.");
            return;
        }

        setLoadingFollow(true);
        try {
            await axiosInstance.post("/user/follow/", {
                follower_id: userId,
                following_id: post.user?.id,
            });
            Toast("success", "User followed successfully.");
            setIsFollowing(true);
        } catch (error) {
            console.error("Error following user:", error);
            Toast("error", `Unable to follow the user. ${error.response?.data?.error || "An error occurred."}`);
        } finally {
            setLoadingFollow(false);
        }
    };


    const handleUnfollow = async (followingId) => {
        try {
            await axiosInstance.post("/user/unfollow/", { follower_id: userId, following_id: followingId });
            Toast("success", "Unfollowed successfully!");

            // Refresh the following data
            const updatedFollowing = await axiosInstance.get(`/user/following/${userId}/`);
            setFollowing(updatedFollowing.data); // Update the following state
            setIsFollowing(false); // Update the follow status
        } catch (error) {
            console.error("Error unfollowing user:", error);
            Toast("error", `Failed to unfollow the user. ${error.response?.data?.error || "An error occurred."}`);
        }
    };

    const handleCreateCommentChange = (event) => {
        setCreateComment({
            ...createComment,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            Toast("error", "You need to log in to comment on a post.");
            navigate("/login/");
            return;
        }
        if (createComment.comment.trim() === "") {
            Toast("error", "Comment cannot be empty.");
            return;
        }

        const jsonData = {
            post_id: post?.id,
            name: createComment.full_name,
            email: createComment.email,
            comment: createComment.comment,
        };

        try {
            const response = await axiosInstance.post(`post/comment-post/`, jsonData);
            Toast("success", "Comment Posted.", "");
            setCreateComment({
                full_name: "",
                email: "",
                comment: "",
            });
            fetchPost(); // Refresh the post data to include the new comment
        } catch (error) {
            console.error("Error posting comment:", error);
            Toast("error", "Unable to post the comment.");
        }
    };
    const handleReplyChange = (commentId, value) => {
        setReply((prevReply) => ({
            ...prevReply,
            [commentId]: value, // Update the reply for the specific comment
        }));
    };

    const handleReplySubmit = async (commentId) => {
        if (!userId) {
            Toast("error", "You need to log in to reply to a comment.");
            navigate("/login/");
            return;
        }

        const jsonData = {
            comment_id: commentId,
            name: userName,
            email: userEmail,
            reply: reply[commentId],
        };

        try {
            const response = await axiosInstance.post(`/post/reply-comment/`, jsonData);
            Toast("success", "Reply Posted.", "");

            // Update the local state to include the new reply without re-fetching the entire post
            setPost((prevPost) => {
                const updatedComments = prevPost.comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies, response.data], // Add the new reply to the replies array
                        };
                    }
                    return comment;
                });

                return {
                    ...prevPost,
                    comments: updatedComments,
                };
            });

            // Clear the reply input for the specific comment
            setReply((prevReply) => ({
                ...prevReply,
                [commentId]: "",
            }));
        } catch (error) {
            console.error("Error posting reply:", error);
            Toast("error", "Unable to post the reply.");
        }
    };
    const [showReplies, setShowReplies] = useState({}); // State to track visibility of replies

    const toggleReplies = (commentId) => {
        setShowReplies((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId], // Toggle visibility for the specific comment
        }));
    };

    useEffect(() => {
        if (post.likes?.includes(userId)) {
            setIsLiked(true);
        }
        setLikesCount(post.likes?.length || 0);
    }, [post, userId]);
    const handleLikePost = async () => {
        if (!userId) {
            Toast("error", "You need to log in to like a post.");
            navigate("/login/");
            return;
        }

        try {
            const response = await axiosInstance.post("/post/like-post/", {
                user_id: userId,
                post_id: post.id,
            });

            if (response.data.message === "Post Liked") {
                Toast("success", "Post Liked.");
                setLikesCount((prev) => prev + 1);
                setIsLiked(true);
            } else if (response.data.message === "Post Disliked") {
                Toast("success", "Post Disliked.");
                setLikesCount((prev) => prev - 1);
                setIsLiked(false);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            Toast("error", "Unable to like the post.");
        }
    };
    const [isBookmarked, setIsBookmarked] = useState(false);
    useEffect(() => {
        if (post.bookmarks?.includes(userId)) {
            setIsBookmarked(true);
        }
    }, [post, userId]);
    const handleBookmarkPost = async () => {
        if (!userId) {
            Toast("error", "You need to log in to bookmark a post.");
            navigate("/login/");
            return;
        }

        try {
            const response = await axiosInstance.post("/post/bookmark-post/", {
                user_id: userId,
                post_id: post.id,
            });

            if (response.data.message === "Post Bookmarked") {
                setIsBookmarked(true);
                setPost((prevPost) => ({
                    ...prevPost,
                    bookmarks: [...prevPost.bookmarks, userId], // Add the user ID to the bookmarks array
                }));
                Toast("success", "Post bookmarked.");
            } else if (response.data.message === "Post Un-Bookmarked") {
                setIsBookmarked(false);
                setPost((prevPost) => ({
                    ...prevPost,
                    bookmarks: prevPost.bookmarks.filter((id) => id !== userId), // Remove the user ID from the bookmarks array
                }));
                Toast("success", "Post unbookmarked.");
            }
        } catch (error) {
            console.error("Error bookmarking post:", error);
            Toast("error", "Unable to bookmark the post.");
        }
    };

    return (
        <>
            {/* {JSON.stringify(post)} */}
            {/* {JSON.stringify(post?.user?.id)} */}
            <Header />
            <section className="mt-4 ">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <Link to={`/category/${post?.category?.toLowerCase()}/`} className="badge bg-primary p-3 text-decoration-none">
                                <i className="  fw-bold " />
                                {post.category}
                            </Link>
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="position-relative">
                                    <div className="avatar avatar-xl">
                                        <img className="avatar-img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                                            src={post.profile?.image || "https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"}
                                            alt="Author's avatar" />
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                        {post.user?.full_name || post.profile?.username}
                                    </a>
                                    <p>{post.profile?.bio}</p>


                                    {/* Follow/Unfollow Button */}
                                    {userId !== post.user?.id && (
                                        <button
                                            className={`btn ${isFollowing ? "btn-danger" : "btn-primary"} mt-3`}
                                            onClick={() =>
                                                isFollowing
                                                    ? handleUnfollow(post.user?.id)
                                                    : handleFollow(post.user?.id)
                                            }
                                            disabled={loadingFollow}
                                        >
                                            {loadingFollow
                                                ? "Processing..."
                                                : isFollowing
                                                    ? "Unfollow"
                                                    : "Follow"}
                                        </button>



                                    )}


                                </div>
                                <hr className="d-none d-lg-block " />

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-clock"></i> 7 min read
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start" >
                                        <span className={` text-body btn btn-link p-0 text-primary ${isLiked ? "liked" : ""}`}
                                            onClick={handleLikePost}>
                                            <i className={`fas fa-heart me-1 ${isLiked ? "text-danger" : ""}`} />
                                        </span>
                                        {likesCount} Likes
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start  ">
                                        <span
                                            className={`text-decoration-none btn btn-link p-0 text-dark ${isBookmarked ? "bookmarked" : ""}`}
                                            onClick={handleBookmarkPost}
                                        >
                                            <i className={`fas fa-bookmark me-1 ${isBookmarked ? "text-warning" : ""}`}></i> {post.bookmarks?.length}{" "}
                                            {isBookmarked ? "Bookmarked" : "Bookmark"}
                                        </span>
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye me-1" />
                                        {post.view} Views
                                    </li>
                                </ul>
                                <br />
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.map((t, index) => (
                                        <li className="list-inline-item">
                                            <span className="text-body text-decoration-none fw-bold ">
                                                #{t}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Left sidebar END */}
                        {/* Main Content START */}
                        <div className="col-lg-10 mb-5">
                            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>


                            <hr />
                            {/* Add a New Comment */}
                            <h4>Write a comment</h4>
                            <div className="bg-light p-3 rounded">
                                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                                    <div className="col-md-6">
                                        <label className="form-label">Name *</label>
                                        <input onChange={handleCreateCommentChange} name="full_name" value={userName || " "} type="text" className="form-control" aria-label="First name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email *</label>
                                        <input onChange={handleCreateCommentChange} name="email" value={userEmail || " "} type="email" className="form-control" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Write Comment *</label>
                                        <textarea onChange={handleCreateCommentChange} name="comment" value={createComment.comment} className="form-control" rows={3} />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            Post comment <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            <div>
                                <h3>{post.comments?.length} comments</h3>
                                <div style={{
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                }}
                                >
                                    {post.comments?.map((c) =>
                                        (c && (c.parent === null || c.parent === undefined)) && (
                                            <div className="my-4 d-flex bg-light p-3 mb-3 rounded" key={c.id}>
                                                <img
                                                    className="avatar avatar-md rounded-circle float-start me-3"
                                                    src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                                                    style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }}
                                                    alt="avatar"
                                                />
                                                <div>
                                                    <div className="mb-2">
                                                        <h5 className="m-0">{c.name}</h5>
                                                        <span className="me-3 small">{moment(c.date).format("DD MMM, YYYY")}</span>
                                                    </div>
                                                    <p className="fw-bold comment-box">{c.comment}</p>

                                                    {/* Reply Icon */}
                                                    <button
                                                        className="btn btn-link p-0 text-primary text-decoration-none "
                                                        onClick={() => toggleReplies(c.id)}
                                                    >
                                                        {showReplies[c.id] ? "Hide Replies" : "Show Replies"}
                                                        <i className={`fas fa-reply ms-1`}></i>
                                                        {/* <i className={`fas fa-${showReplies[c.id] ? "minus" : "reply"} ms-1`}></i> */}

                                                    </button>

                                                    {/* Nested Replies */}
                                                    {showReplies[c.id] && (
                                                        <>
                                                            {c.replies?.map((reply) => (
                                                                <div className="bg-white p-2 mt-2 rounded reply-box" key={reply.id}>
                                                                    <h6 className="m-0">{reply.name}</h6>
                                                                    <p className="small">{reply.comment}</p>
                                                                </div>
                                                            ))}

                                                            {/* Reply Input */}
                                                            <div className="mt-3">
                                                                <textarea
                                                                    className="form-control"
                                                                    rows={2}
                                                                    placeholder="Write a reply..."
                                                                    value={reply[c.id] || ""}
                                                                    onChange={(e) => handleReplyChange(c.id, e.target.value)}
                                                                />
                                                                <button
                                                                    className="btn btn-primary mt-2"
                                                                    onClick={() => handleReplySubmit(c.id)}
                                                                >
                                                                    Post Reply
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                                <hr />
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Detail;