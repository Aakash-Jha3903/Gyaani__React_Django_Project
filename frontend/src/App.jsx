import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Index from "./views/core";
import Detail from "./views/core/Detail";
import Search from "./views/core/Search";
import Category from "./views/core/Category";
import AllCategory from "./views/core/AllCategory";
import About from "./views/pages/About";
import Contact from "./views/pages/Contact";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import ChangePassword from "./views/auth/ChangePassword";
import Dashboard from "./views/dashboard/Dashboard";
import Following from "./views/dashboard/Following";
import Bookmarks from "./views/dashboard/Bookmarks";
import Followers from "./views/dashboard/Followers";
import Posts from "./views/dashboard/Posts";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Notifications from "./views/dashboard/Notifications";
import Profile from "./views/dashboard/Profile";
import React from "react";

import MainWrapper from "../src/layouts/MainWrapper";
import PrivateRoute from "./layouts/PrivateRoute";
function App() {
    return (
        <>
            <BrowserRouter>
                <MainWrapper>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/:slug/" element={<Detail />} />
                        <Route path="/category/:slug/" element={<Category />} />
                        <Route path="/all-category/" element={<AllCategory />} />
                        <Route path="/search/" element={<Search />} />

                        {/* Authentication */}
                        <Route path="/register/" element={<Register />} />
                        <Route path="/login/" element={<Login />} />
                        <Route path="/logout/" element={<Logout />} />
                        <Route path="/forgot-password/" element={<ForgotPassword />} />
                        <Route path="/change-password/" element={<ChangePassword />} />

                        {/* Dashboard */}
                        <Route path="/dashboard/" element={<Dashboard />} />
                        <Route path="/posts/" element={<Posts />} />
                        <Route path="/add-post/" element={<PrivateRoute >
                            <AddPost />
                        </PrivateRoute>} />
                        <Route path="/dashboard/following" element={<Following />} />
                        <Route path="/bookmarks/" element={<Bookmarks />} />
                        <Route path="/dashboard/followers" element={<Followers />} />

                        <Route path="/edit-post/:user_id/:post_id/" element={<EditPost />} />
                        <Route path="/notifications/" element={<Notifications />} />
                        <Route path="/profile/" element={<Profile />} />

                        {/* Pages */}
                        <Route path="/about/" element={<About />} />
                        <Route path="/contact/" element={<Contact />} />
                    </Routes>
                </MainWrapper>
            </BrowserRouter>
        </>
    );
}

export default App;
