// import UserData from "../views/plugin/UserData";
import useUserData from "../plugin/useUserData";

export const API_BASE_URL = "http://127.0.0.1:8000/api/v1/";
export const SERVER_URL = "http://127.0.0.1:8000";
export const CLIENT_URL = "http://localhost:5173";

export const userId = useUserData()?.user_id;
