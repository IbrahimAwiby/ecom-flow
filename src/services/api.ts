import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "@/hooks/use-toast";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; statusMsg?: string }>) => {
    const message = error.response?.data?.message || "An error occurred";
    
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
