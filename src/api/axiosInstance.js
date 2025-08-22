import axios from "axios";
import Cookies from "js-cookie"; // 👈 import cookies
import config from "./config";

const axiosInstance = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // 👈 read token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized");
      // Optionally, redirect to login or clear cookies here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
