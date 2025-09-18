import axios from 'axios';

const API_URL = 'https://be-mt-trans.vercel.app'; 

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
        // Try to refresh the token
        const newToken = await refreshToken();
        if (newToken) {
          // Update the token in the original request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, remove tokens and reject
        removeToken();
        localStorage.removeItem('refresh_token');
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
    
    return data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to login');
  }
};

export const signup = async (email: string, password: string): Promise<void> => {
  try {
    await api.post('/auth/register', { email, password });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create account');
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

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

export const refreshToken = async (): Promise<string | null> => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refresh_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setToken(data.access_token);
    return data.access_token;
  } catch (error) {
    removeToken();
    localStorage.removeItem('refresh_token');
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
