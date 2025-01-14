import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout for requests
  params: {
    apikey: API_KEY, // Automatically adds the API key to every request
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Request sent to ${config.baseURL}${config.url} with params:`, config.params);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
