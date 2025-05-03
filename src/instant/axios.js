import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-a5nn.onrender.com', // Backend URL
 // baseURL: 'http://localhost:8080', // Localhost URL for development
  withCredentials: true, // Cookies ko bhejne ke liye
});

export default axiosInstance;
