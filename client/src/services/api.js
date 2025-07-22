import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set default auth header if token exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // For auth endpoints (login/register), don't add any token
    if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
      delete config.headers.Authorization;
      return config;
    }

    // For all other routes, try to add token if it exists
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Don't handle 401s for login/register
    if (error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // If the error is a network error or the server is down
    if (!error.response) {
      return Promise.reject(error);
    }

    // If the error is 401 and it's not a public route
    if (error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
      // Store the current path for redirect after login
      if (window.location.pathname !== '/login') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      
      // Dispatch unauthorized event
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    
    return Promise.reject(error);
  }
);

export default api; 