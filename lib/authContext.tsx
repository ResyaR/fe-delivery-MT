'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, User, logout as authLogout } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  checkAuth: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authLogout();
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';  // Force a full page reload
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
      if (typeof window !== 'undefined') {
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading,
      checkAuth,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
