'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';
import api from '@/lib/axios';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkAuth } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          showError('OAuth login failed. Please try again.');
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in OAuth callback');
          showError('Invalid OAuth response. Please try again.');
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
          return;
        }

        // Store tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Update axios default headers immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Wait a bit to ensure tokens are stored
        await new Promise(resolve => setTimeout(resolve, 100));

        // Use checkAuth to fetch user profile and update state
        // This ensures consistency with the rest of the app
        try {
          await checkAuth();
          
          // Wait a moment to ensure state is updated
          await new Promise(resolve => setTimeout(resolve, 200));
          
          showSuccess('Login berhasil! Selamat datang di MT Trans');
          
          // Redirect to home page with full page reload to ensure state is updated
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } catch (authError) {
          console.error('Failed to authenticate after OAuth:', authError);
          
          // Check if it's a 401 or other auth error
          if (authError?.response?.status === 401) {
            showError('Token tidak valid. Silakan login kembali.');
          } else {
            showError('Gagal memverifikasi akun. Silakan coba lagi.');
          }
          
          // Clear tokens if auth fails
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        showError('An error occurred during login. Please try again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, checkAuth, showSuccess, showError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000] mx-auto"></div>
        <p className="mt-4 text-gray-600">Menyelesaikan login...</p>
        {isProcessing && (
          <p className="mt-2 text-sm text-gray-500">Mohon tunggu sebentar...</p>
        )}
      </div>
    </div>
  );
}

