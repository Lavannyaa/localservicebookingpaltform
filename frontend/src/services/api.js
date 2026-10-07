import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'localserve_auth_token';
const REFRESH_TOKEN_KEY = 'localserve_refresh_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('lsb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401s & Token Expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          if (res.data?.token) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        // Clear tokens on invalid refresh and redirect to login if needed
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('localserve_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: (url, params = {}) => api.get(url, { params }).then(r => r.data),
  post: (url, data = {}) => api.post(url, data).then(r => r.data),
  put: (url, data = {}) => api.put(url, data).then(r => r.data),
  patch: (url, data = {}) => api.patch(url, data).then(r => r.data),
  delete: (url) => api.delete(url).then(r => r.data)
};

export default api;
