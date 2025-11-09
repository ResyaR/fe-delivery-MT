'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, User, logout as authLogout, login as authLogin, signup as authSignup, refreshToken as refreshAuthToken } from '../lib/auth';
import { getTokenExpiryTime } from '../lib/jwtHelper';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  checkAuth: async () => {},
  logout: async () => {},
  login: async () => {},
  register: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authLogin(email, password);
      
      // Don't clear cart here - let CartContext handle syncing from backend
      // Cart will be synced from database when user is set and CartContext detects the user
      
      // After successful login, get the current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const response = await authSignup(email, password, username);
      console.log('Registration response in context:', response);
      
      // Don't set user or get current user after registration
      // User needs to verify email first
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      
      // Clear cart data when user logs out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('foodCart');
        window.location.href = '/signin';  // Force a full page reload
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
      
      // Clear cart data even if logout API fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('foodCart');
        window.location.href = '/signin';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  // Auto-refresh token mechanism
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      // Clear timer jika tidak ada token atau user
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      return;
    }

    const setupAutoRefresh = () => {
      const expiryTime = getTokenExpiryTime(token);
      if (!expiryTime) return;

      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;
      
      // Refresh 2 menit sebelum expire (atau 80% dari waktu expire, whichever is earlier)
      const refreshTime = Math.max(
        timeUntilExpiry - (2 * 60 * 1000), // 2 menit sebelum
        Math.min(timeUntilExpiry * 0.8, timeUntilExpiry - (2 * 60 * 1000)) // 80% waktu atau 2 menit sebelum
      );

      if (refreshTime > 0) {
        console.log(`[Auth] Auto-refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
        
        const timer = setTimeout(async () => {
          try {
            console.log('[Auth] Auto-refreshing token...');
            const newToken = await refreshAuthToken();
            
            if (newToken) {
              console.log('[Auth] Token refreshed successfully');
              // Token updated, trigger re-setup
              // The new token will be picked up in next effect run
            } else {
              console.error('[Auth] Failed to refresh token');
              // Token refresh gagal, logout user
              await handleLogout();
            }
          } catch (error) {
            console.error('[Auth] Auto refresh error:', error);
            // Jika refresh gagal, logout user
            await handleLogout();
          }
        }, refreshTime);

        setRefreshTimer(timer);
      } else if (timeUntilExpiry > 0) {
        // Token akan expire segera, refresh sekarang
        console.log('[Auth] Token expiring soon, attempting refresh now');
        refreshAuthToken().catch(() => handleLogout());
      }
    };

    setupAutoRefresh();

    // Cleanup timer saat component unmount atau dependencies berubah
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading,
      checkAuth,
      logout: handleLogout,
      login: handleLogin,
      register: handleRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
