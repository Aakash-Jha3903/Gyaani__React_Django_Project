import axios from 'axios';

const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',

    // Set a timeout for requests made using this instance. If a request takes longer than 5 seconds to complete, it will be canceled.
    timeout: 50000, // timeout after 5 seconds

    headers: {
        'Content-Type': 'application/json', 
        Accept: 'application/json', 
    },
});

export default apiInstance;

// import axios from "axios";
// import Cookies from "js-cookie";
// import { getRefreshToken, isAccessTokenExpired, setAuthUser } from "./auth";

// const apiInstance = axios.create({
//     baseURL: "http://127.0.0.1:8000/api/v1/",
//     timeout: 100000, // timeout after 5 seconds
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// });

// // Flag to prevent multiple simultaneous token refresh attempts
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// // Add a request interceptor
// apiInstance.interceptors.request.use(
//     async (req) => {
//         let accessToken = Cookies.get("access_token");
//         const refreshToken = Cookies.get("refresh_token");

//         // Check if the access token is expired
//         if (isAccessTokenExpired(accessToken)) {
//             if (!isRefreshing) {
//                 isRefreshing = true;
//                 try {
//                     const response = await getRefreshToken(refreshToken);
//                     accessToken = response.access;
//                     setAuthUser(response.access, response.refresh);
//                     processQueue(null, accessToken);
//                 } catch (error) {
//                     processQueue(error, null);
//                     Cookies.remove("access_token");
//                     Cookies.remove("refresh_token");
//                     window.location.href = "/login"; // Redirect to login page
//                     throw error;
//                 } finally {
//                     isRefreshing = false;
//                 }
//             }

//             // Wait for the token refresh to complete
//             return new Promise((resolve, reject) => {
//                 failedQueue.push({
//                     resolve: (token) => {
//                         req.headers.Authorization = `Bearer ${token}`;
//                         resolve(req);
//                     },
//                     reject: (err) => {
//                         reject(err);
//                     },
//                 });
//             });
//         }

//         // Attach the Authorization header
//         req.headers.Authorization = `Bearer ${accessToken}`;
//         return req;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Add a response interceptor to handle errors globally
// apiInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             Cookies.remove("access_token");
//             Cookies.remove("refresh_token");
//             window.location.href = "/login"; // Redirect to login page
//         }
//         return Promise.reject(error);
//     }
// );

// export default apiInstance;