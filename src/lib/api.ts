
import axios from 'axios';
import { toast } from "sonner";

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // This helps with CORS credentials
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors specially
    if (!error.response) {
      console.error('Network Error:', error);
      toast.error('Network error. Please check your connection or the server might be down.');
      return Promise.reject(new Error('Network error. Please try again later.'));
    }
    
    const message = error.response?.data?.error || 'Something went wrong';
    
    // Only show toast for network or server errors
    if (error.response.status >= 500) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
