"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/common/ToastProvider';
import api from '@/lib/axios';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Format email tidak valid');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      showSuccess('Link reset password telah dikirim ke email Anda');
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage?.includes('not found') || errorMessage?.includes('User not found')) {
        showError('Email tidak terdaftar');
      } else {
        showError('Gagal mengirim link reset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 mb-4 text-green-500">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cek Email Anda
          </h2>
          
          <p className="text-gray-600 mb-6">
            Kami telah mengirim link reset password ke{' '}
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong>Langkah selanjutnya:</strong>
            </p>
            <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
              <li>Buka email Anda</li>
              <li>Klik link yang kami kirimkan</li>
              <li>Buat password baru</li>
            </ol>
          </div>
          
          <p className="text-xs text-gray-500 mb-6">
            Tidak menerima email? Periksa folder spam atau{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#E00000] hover:underline font-medium"
            >
              kirim ulang
            </button>
          </p>
          
          <button
            onClick={() => router.push('/signin')}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/signin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Kembali ke Login</span>
      </button>

      <div className="text-center mb-8">
        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 mb-4 text-[#E00000]">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          Lupa Password?
        </h2>
        
        <p className="text-gray-600 mt-2">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="material-symbols-outlined text-gray-400">email</span>
            </div>
            <input
              className={`block w-full pl-10 pr-3 py-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:border-[#E00000] transition-colors`}
              id="email"
              name="email"
              placeholder="Masukkan email Anda"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={handleEmailBlur}
              aria-label="Email address"
              aria-required="true"
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'email-error' : undefined}
              required
            />
          </div>
          {emailError && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-xs" id="email-error" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {emailError}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#E00000] hover:bg-[#C00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </div>
            ) : (
              'Kirim Link Reset Password'
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Ingat password Anda?{' '}
        <button
          onClick={() => router.push('/signin')}
          className="font-medium text-[#E00000] hover:text-[#C00000] transition-colors"
        >
          Login Sekarang
        </button>
      </p>
    </div>
  );
}

