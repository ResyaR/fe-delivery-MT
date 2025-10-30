"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

// Daftar path yang dapat diakses tanpa login
const PUBLIC_PATHS = ['/', '/signin', '/signup', '/verify', '/forgot-password', '/reset-password'];

export default function AuthGuard({ children }) {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  // Effect untuk initial auth check
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof checkAuth === 'function') {
          await checkAuth();
        }
      } catch (error) {
        console.error('Initial auth check failed:', error);
      } finally {
        setIsInitialCheck(false);
      }
    };
    
    if (isInitialCheck && !isLoading) {
      initAuth();
    }
  }, [checkAuth, isInitialCheck, isLoading]);

  // Effect untuk route protection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRouteProtection = async () => {
      const token = localStorage.getItem('token');
      const isPublicPath = PUBLIC_PATHS.includes(pathname);

      // Jika masih dalam initial loading atau check, tunggu
      if (isInitialCheck || isLoading) return;

      // Jika ada token tapi tidak ada user, coba refresh auth
      if (token && !user && typeof checkAuth === 'function') {
        try {
          const isValid = await checkAuth();
          if (!isValid && !isPublicPath) {
            sessionStorage.setItem('returnUrl', pathname);
            router.push('/signin');
          }
        } catch (error) {
          console.error('Auth refresh failed:', error);
        }
        return;
      }

      // Jika bukan public path dan tidak ada token/user, redirect ke signin
      if (!isPublicPath && !token && !user) {
        console.log('Redirecting to signin, no auth found');
        sessionStorage.setItem('returnUrl', pathname);
        router.push('/signin');
      }
    };

    handleRouteProtection();
  }, [user, isLoading, pathname, router, isInitialCheck, checkAuth]);

  // Tampilkan children hanya jika:
  // 1. Path adalah public path, atau
  // 2. User sudah login
  // 3. Masih dalam proses loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E46329]"></div>
      </div>
    );
  }

  if (!PUBLIC_PATHS.includes(pathname) && !user) {
    return null; // atau loading indicator
  }

  return children;
}