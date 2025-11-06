'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const error = searchParams.get('error');

    if (error) {
      showError('OAuth login failed. Please try again.');
      router.push('/signin');
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Update auth context
      checkAuth().then(() => {
        showSuccess('Login berhasil! Selamat datang di MT Trans');
        router.push('/');
      }).catch(() => {
        showError('Failed to authenticate. Please try again.');
        router.push('/signin');
      });
    } else {
      showError('Invalid OAuth response. Please try again.');
      router.push('/signin');
    }
  }, [searchParams, router, checkAuth, showSuccess, showError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000] mx-auto"></div>
        <p className="mt-4 text-gray-600">Menyelesaikan login...</p>
      </div>
    </div>
  );
}

