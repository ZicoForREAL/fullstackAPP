import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:8000/api
  withCredentials: true, // Needed for Sanctum authentication
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;