import axios from "axios";
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constants";
import Cookies from "js-cookie";

const useAxios = () => {
    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
    });

    axiosInstance.interceptors.request.use(async (req) => {
        let accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");

        // Check if the access token is expired
        if (isAccessTokenExpired(accessToken)) {
            try {
                // Refresh the access token
                const response = await getRefreshToken(refreshToken);
                accessToken = response.access;
                setAuthUser(response.access, response.refresh);
            } catch (error) {
                console.error("Error refreshing token:", error);
                throw error; // Handle token refresh failure
            }
        }

        // Attach the Authorization header
        req.headers.Authorization = `Bearer ${accessToken}`;
        return req;
    });

    return axiosInstance;
};

export default useAxios;
