import axios from 'axios';

const axiosInstance = axios.create({
 baseURL:'http://localhost:8080', // Backend URL
  withCredentials: true, // Cookies ko bhejne ke liye
});

export default axiosInstance;
