import axios from 'axios';
import { API_BASE_URL } from './config';
import { isTokenExpiringSoon } from './jwtHelper';
import { refreshToken } from './auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - check and refresh token if expiring soon
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check jika token akan expire dalam 5 menit - lebih agresif untuk mencegah logout
      if (isTokenExpiringSoon(token, 5)) {
        console.log('[Axios] Token expiring soon, refreshing before request...');
        try {
          const newToken = await refreshToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
            console.log('[Axios] Token refreshed successfully before request');
          } else {
            // If refresh fails, use old token and let response interceptor handle
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('[Axios] Pre-request token refresh failed:', error);
          // Continue dengan token lama, let response interceptor handle
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors as fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('[Axios] Received 401, attempting to refresh token...');
      
      try {
        const newToken = await refreshToken();
        if (newToken) {
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('[Axios] Token refreshed, retrying request');
          return api(originalRequest);
        } else {
          // Refresh failed, redirect to login
          console.error('[Axios] Token refresh failed, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/signin';
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        console.error('[Axios] Token refresh error:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
