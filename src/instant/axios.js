import axios from 'axios';

const axiosInstance = axios.create({
 baseURL:'https://backend-a5nn.onrender.com', // Backend URL
  withCredentials: true, // Cookies ko bhejne ke liye
});

export default axiosInstance;
