'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, User, logout as authLogout, login as authLogin, signup as authSignup } from '../lib/auth';

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
      logout: handleLogout,
      login: handleLogin,
      register: handleRegister
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
