import axios from 'axios';

// Using local development server
const API_URL = 'https://student-management-backend-mr.onrender.com';

// Create a public API instance that doesn't require authentication
const publicAPI = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Only skip auth for login endpoint
    if (config.url === '/auth/login') {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    
    // If no token and not on login page, redirect to login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return Promise.reject(new Error('No authentication token found'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access (no permission)
      console.error('Access forbidden:', error.response?.data?.message || 'You do not have permission to access this resource');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => publicAPI.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Students API
export const studentAPI = {
  // Use publicAPI for public endpoints that don't require authentication
  getAll: () => publicAPI.get('/students'),
  // Keep other methods using the authenticated api instance
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// Export both API instances
export { publicAPI };
export default api;
