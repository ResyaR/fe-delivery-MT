"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

// Daftar path yang dapat diakses tanpa login
const PUBLIC_PATHS = ['/', '/signin', '/signup', '/verify', '/forgot-password', '/reset-password', '/auth/callback'];

// Tab di /cek-ongkir yang bisa diakses tanpa login
const PUBLIC_CEK_ONGKIR_TABS = ['cek-ongkir', 'lacak'];

function AuthGuardContent({ children }) {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
      
      // Cek apakah path adalah public path
      let isPublicPath = PUBLIC_PATHS.includes(pathname);
      
      // Jika path adalah /cek-ongkir, cek tab parameter
      if (pathname === '/cek-ongkir') {
        const tab = searchParams?.get('tab');
        isPublicPath = tab ? PUBLIC_CEK_ONGKIR_TABS.includes(tab) : false;
      }

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
  }, [user, isLoading, pathname, searchParams, router, isInitialCheck, checkAuth]);

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

  // Cek apakah path adalah public path
  let isPublicPath = PUBLIC_PATHS.includes(pathname);
  
  // Jika path adalah /cek-ongkir, cek tab parameter
  if (pathname === '/cek-ongkir') {
    const tab = searchParams?.get('tab');
    isPublicPath = tab ? PUBLIC_CEK_ONGKIR_TABS.includes(tab) : false;
  }

  if (!isPublicPath && !user) {
    return null; // atau loading indicator
  }

  return children;
}

export default function AuthGuard({ children }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E46329]"></div>
      </div>
    }>
      <AuthGuardContent>{children}</AuthGuardContent>
    </Suspense>
  );
}