import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL = API_BASE_URL; 

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
}

export interface User {
  email: string;
  id: string;
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const refreshTokenValue = localStorage.getItem('refresh_token');
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshTokenValue
        });

        const { access_token, refresh_token } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }

        // Update Authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Update Authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        removeToken();
        if (isBrowser) {
          // Store the current path to redirect back after login
          sessionStorage.setItem('returnUrl', window.location.pathname);
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;
    
    // Store the access token
    if (data.access_token) {
      setToken(data.access_token);
    }
    
    // Store the refresh token
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    // Update Authorization header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    
    // Get and set user data immediately after login
    const userResponse = await api.get('/auth/profile');
    data.user = userResponse.data;

    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to login');
  }
};

export const signup = async (email: string, password: string, username: string): Promise<any> => {
  try {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      username 
    });
    
    // Log the response for debugging
    console.log('Signup response:', response.data);
    
    // Return the raw response data from the server
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error.response?.data || error);
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Failed to create account. Please try again.');
  }
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token) {
      try {
        // Call logout API with both tokens
        await api.post('/auth/logout', { 
          refreshToken 
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (apiError) {
        console.error('Logout API error:', apiError);
        // Continue with cleanup even if API call fails
      }
    }
  } finally {
    // Always clean up local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    
    // Remove Authorization header
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

export const refreshToken = async (): Promise<string | null> => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return null;

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;

    // Update both tokens
    setToken(access_token);
    if (new_refresh_token) {
      localStorage.setItem('refresh_token', new_refresh_token);
    }

    // Update Authorization header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return access_token;
  } catch (error) {
    // If refresh fails, clear tokens and return null
    removeToken();
    return null;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error: any) {
    // Check if error is due to expired token (401)
    if (error.response?.status === 401) {
      // Try to refresh the token
      const newToken = await refreshToken();
      if (newToken) {
        // Retry the request with new token
        try {
          const response = await api.get('/auth/profile', {
            headers: { Authorization: `Bearer ${newToken}` }
          });
          return response.data;
        } catch (retryError) {
          removeToken();
          return null;
        }
      }
    }
    removeToken();
    return null;
  }
};
