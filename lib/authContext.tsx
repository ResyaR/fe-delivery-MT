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
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [tokenVersion, setTokenVersion] = useState(0); // Force re-run when token changes

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      try {
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('user');
        }
      } catch {}
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      try {
        localStorage.removeItem('user');
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginResult = await authLogin(email, password);

      // Fast-path: gunakan user dari hasil login agar header update instan
      if ((loginResult as any)?.user) {
        const loggedInUser = (loginResult as any).user as User;
        setUser(loggedInUser);
        try {
          localStorage.setItem('user', JSON.stringify(loggedInUser));
        } catch {}
      } else {
        // Fallback: ambil profile jika server tidak mengembalikan user
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        try {
          if (currentUser) localStorage.setItem('user', JSON.stringify(currentUser));
        } catch {}
      }

      // Trigger token refresh setup with new token
      setTokenVersion(prev => prev + 1);
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
    // Clear all timers first
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }
    if (checkInterval) {
      clearInterval(checkInterval);
      setCheckInterval(null);
    }

    try {
      // Panggil API logout SEBELUM clear localStorage
      // Token masih ada di sini, jadi API bisa dipanggil dengan benar
      await authLogout();
      
      // Dispatch event untuk notifikasi sukses (sebelum redirect)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('logout-success', {
          detail: { message: 'Logout berhasil' }
        }));
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Meskipun API gagal, tetap lanjutkan logout untuk UX
      // Dispatch event untuk notifikasi (meskipun API gagal, logout tetap dilakukan)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('logout-success', {
          detail: { message: 'Anda telah logout' }
        }));
      }
    }

    // Setelah API selesai (atau gagal), baru clear localStorage
    try {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('foodCart');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
      }
    } catch {}

    // Redirect setelah delay singkat untuk memberi waktu notifikasi muncul
    if (typeof window !== 'undefined') {
      setTimeout(() => {
      window.location.href = '/signin';
      }, 1500); // Delay 1.5 detik untuk notifikasi terlihat
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Hydrate cepat dari cache agar header segera berubah
    try {
      const cached = localStorage.getItem('user');
      if (cached) {
        const cachedUser = JSON.parse(cached) as User;
        if (cachedUser?.email) {
          setUser(cachedUser);
          setLoading(false);
          // Sinkronisasi di background tanpa mengubah loading state
          checkAuth().catch(() => {});
          return;
        }
      }
    } catch {}

    // Jika tidak ada cache, lakukan checkAuth biasa
    checkAuth();
  }, []);

  // Auto-refresh token mechanism with periodic check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      // Clear timers jika tidak ada token atau user
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      if (checkInterval) {
        clearInterval(checkInterval);
        setCheckInterval(null);
      }
      return;
    }

    const setupAutoRefresh = () => {
      // Clear existing timer first
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }

      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const expiryTime = getTokenExpiryTime(currentToken);
      if (!expiryTime) {
        console.warn('[Auth] Cannot get token expiry time');
        return;
      }

      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;
      
      // Refresh lebih agresif: 5 menit sebelum expire atau 70% dari waktu expire
      // Access token biasanya 15 menit, jadi:
      // - 70% dari 15 menit = 10.5 menit (refresh setelah 4.5 menit)
      // - 5 menit sebelum = refresh di menit ke-10
      // Ambil yang lebih awal (lebih cepat refresh) untuk memastikan token tidak pernah expire
      const refreshAt70Percent = timeUntilExpiry * 0.7;
      const refreshAt5MinBefore = timeUntilExpiry - (5 * 60 * 1000);
      const refreshTime = Math.min(refreshAt70Percent, refreshAt5MinBefore);

      if (refreshTime > 0) {
        const refreshTimeSeconds = Math.round(refreshTime / 1000);
        const refreshTimeMinutes = Math.round(refreshTime / 60000);
        console.log(`[Auth] Auto-refresh scheduled in ${refreshTimeMinutes} minutes (${refreshTimeSeconds} seconds)`);
        
        const timer = setTimeout(async () => {
          try {
            console.log('[Auth] Auto-refreshing token...');
            const newToken = await refreshAuthToken();
            
            if (newToken) {
              console.log('[Auth] Token refreshed successfully, setting up new timer');
              // Token updated, increment version to trigger re-setup
              setTokenVersion(prev => prev + 1);
            } else {
              console.error('[Auth] Failed to refresh token');
              // Check if refresh token is still valid before logging out
              const refreshToken = localStorage.getItem('refresh_token');
              if (!refreshToken) {
                console.error('[Auth] No refresh token available, logging out');
                await handleLogout();
              } else {
                // Retry once more after a short delay
                console.log('[Auth] Retrying token refresh in 5 seconds...');
                setTimeout(async () => {
                  const retryToken = await refreshAuthToken();
                  if (!retryToken) {
              await handleLogout();
                  } else {
                    setTokenVersion(prev => prev + 1);
                  }
                }, 5000);
              }
            }
          } catch (error) {
            console.error('[Auth] Auto refresh error:', error);
            // Check if we should retry or logout
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              // Retry once more
              setTimeout(async () => {
                try {
                  const retryToken = await refreshAuthToken();
                  if (!retryToken) {
                    await handleLogout();
                  } else {
                    setTokenVersion(prev => prev + 1);
                  }
                } catch {
                  await handleLogout();
                }
              }, 5000);
            } else {
            await handleLogout();
            }
          }
        }, refreshTime);

        setRefreshTimer(timer);
      } else if (timeUntilExpiry > 0) {
        // Token akan expire segera (kurang dari 2 menit), refresh sekarang
        console.log('[Auth] Token expiring soon, attempting refresh now');
        refreshAuthToken()
          .then((newToken) => {
            if (newToken) {
              setTokenVersion(prev => prev + 1);
            } else {
              handleLogout();
            }
          })
          .catch(() => handleLogout());
      } else {
        // Token sudah expired, coba refresh dulu
        console.warn('[Auth] Token already expired, attempting refresh');
        refreshAuthToken()
          .then((newToken) => {
            if (newToken) {
              setTokenVersion(prev => prev + 1);
            } else {
              handleLogout();
            }
          })
          .catch(() => handleLogout());
      }
    };

    // Setup initial refresh timer
    setupAutoRefresh();

    // Setup periodic check every 30 seconds to ensure token doesn't expire
    // This handles cases where user is idle and no requests are made
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken || !user) {
        clearInterval(interval);
        return;
      }

      const expiryTime = getTokenExpiryTime(currentToken);
      if (!expiryTime) return;

      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;
      
      // If token expires in less than 6 minutes, refresh it proactively
      // This ensures we always refresh before token expires
      if (timeUntilExpiry < 6 * 60 * 1000 && timeUntilExpiry > 0) {
        console.log('[Auth] Periodic check: Token expiring soon, refreshing...');
        refreshAuthToken()
          .then((newToken) => {
            if (newToken) {
              console.log('[Auth] Token refreshed via periodic check');
              setTokenVersion(prev => prev + 1);
            }
          })
          .catch((error) => {
            console.error('[Auth] Periodic refresh failed:', error);
            // Don't logout immediately, let the timer handle it
          });
      }
    }, 30 * 1000); // Check every 30 seconds for more frequent monitoring

    setCheckInterval(interval);

    // Cleanup timers saat component unmount atau dependencies berubah
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        setRefreshTimer(null);
      }
      if (checkInterval) {
        clearInterval(checkInterval);
        setCheckInterval(null);
      }
      // Also cleanup the interval we just created
      clearInterval(interval);
    };
  }, [user, tokenVersion]); // Add tokenVersion to dependencies

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
