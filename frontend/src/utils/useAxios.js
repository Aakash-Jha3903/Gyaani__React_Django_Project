import axios from 'axios';
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from './auth'; 
import { API_BASE_URL } from './constants'; 
import Cookies from 'js-cookie'; 

const useAxios = () => {
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');

    const axiosInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    axiosInstance.interceptors.request.use(async (req) => {
        if (!isAccessTokenExpired(accessToken)) {
            return req; // If not expired, return the original request
        }

        // If the access token is expired, refresh it
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);

        // Update the request's 'Authorization' header with the new access token
        req.headers.Authorization = `Bearer ${response?.data?.access}`;
        return req;
    });

    return axiosInstance; 
};

export default useAxios; 
