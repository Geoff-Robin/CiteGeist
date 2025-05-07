import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/auth-context"; // Adjust path as necessary

//const API_URL = "http://127.0.0.1:8000/api/";
const isDevelopment=import.meta.env.VITE_MODE==='development'
const API_URL=isDevelopment? import.meta.env.VITE_API_BASE_URL_LOCAL :import.meta.env.VITE_API_BASE_URL_DEPLOY
export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivateInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh token function
async function refreshAccessToken(setAccessToken) {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken"); // Get the refresh token from localStorage
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_URL}token/refresh/`,
      { refresh: refreshToken }, // Send the refresh token in the body
      { withCredentials: true }
    );
    const newAccessToken = response?.data?.access;
    const newRefreshToken = response?.data?.refresh; // You can choose to update the refresh token if necessary

    if (newAccessToken) {
      setAccessToken(newAccessToken);
      sessionStorage.setItem("refreshToken", newRefreshToken); 
      return newAccessToken;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
  return null;
}

// Custom Axios Hook
export function useAxiosPrivate() {
  const { accessToken, setAccessToken } = useContext(AuthContext);

  useEffect(() => {
    const requestInterceptor = axiosPrivateInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivateInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // If request was unauthorized and wasn't retried yet
        if ((error?.response?.status === 401 || error?.response?.status === 403) && !prevRequest?.sent) {
          prevRequest.sent = true; // Prevent multiple retries

          // Refresh the access token
          const newAccessToken = await refreshAccessToken(setAccessToken);

          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivateInstance(prevRequest); // Retry the request with the new token
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivateInstance.interceptors.request.eject(requestInterceptor);
      axiosPrivateInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, setAccessToken]);

  return axiosPrivateInstance;
}
