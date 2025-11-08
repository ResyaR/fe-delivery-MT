"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';
import { API_BASE_URL } from '@/lib/config';

export default function MTTransLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const emailInputRef = useRef(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Auto-focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear email error when user starts typing
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Format email tidak valid');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submit
    if (!validateEmail(formData.email)) {
      setEmailError('Format email tidak valid');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      showSuccess('Login berhasil! Selamat datang di MT Trans');
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage?.includes('not found') || errorMessage?.includes('User not found')) {
        showError('Email tidak terdaftar. Silakan daftar terlebih dahulu.');
      } else if (errorMessage?.includes('Invalid credentials') || errorMessage?.includes('password')) {
        showError('Email atau password salah. Silakan coba lagi.');
      } else {
      showError('Login gagal. Silakan periksa email dan password Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/signup');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex md:flex-row flex-col">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 lg:p-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 mb-6 hover:gap-3 p-2 -m-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base font-semibold">Kembali</span>
          </button>
          
          <div className="text-center md:text-left mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Masuk ke MT Trans
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Akses cepat untuk mengatur pengiriman Anda.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                Email
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="material-symbols-outlined text-gray-400">email</span>
                </div>
                <input
                  ref={emailInputRef}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border ${emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:border-[#E00000] text-sm sm:text-base transition-all duration-200 truncate`}
                  id="email"
                  name="email"
                  placeholder="Masukkan email Anda"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="material-symbols-outlined text-gray-400">lock</span>
                </div>
                <input
                  className="block w-full pl-9 sm:pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:border-[#E00000] text-sm sm:text-base transition-all duration-200 truncate"
                  id="password"
                  name="password"
                  placeholder="Masukkan password Anda"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="font-medium text-[#E00000] hover:text-[#C00000] transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#E00000] focus:ring-[#E00000] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Ingat saya
              </label>
            </div>
            
            {/* OAuth Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            <div>
              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-[#E00000] hover:bg-gradient-to-r hover:from-[#E00000] hover:to-[#C00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E00000] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 active:bg-[#B00000]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang masuk...
                  </div>
                ) : (
                  'Login Sekarang'
                )}
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?{' '}
            <button
              onClick={handleRegister}
              className="font-medium text-[#E00000] hover:text-[#C00000] transition-colors"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
      
      {/* Right Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-12 gradient-bg rounded-l-xl">
        <div className="text-center text-white space-y-4 md:space-y-6 max-w-lg">
          <div className="flex justify-center mb-4 md:mb-6">
            <img
              alt="Mitra pengiriman terpercaya"
              className="w-full max-w-xs md:max-w-sm h-auto rounded-xl shadow-md"
              src="/login.png"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Mitra Pengiriman Terpercaya Anda
          </h2>
          <p className="text-base md:text-lg opacity-90 leading-relaxed">
            Cepat, Aman, dan Terjangkau
          </p>
          
          {/* Icons with Labels */}
          <div className="flex justify-center items-center gap-6 md:gap-8 mt-4 md:mt-6">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-2xl md:text-3xl bg-white/20 p-2 md:p-3 rounded-full">bolt</span>
              <span className="text-xs md:text-sm font-medium">Cepat</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-2xl md:text-3xl bg-white/20 p-2 md:p-3 rounded-full">local_shipping</span>
              <span className="text-xs md:text-sm font-medium">Andal</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-2xl md:text-3xl bg-white/20 p-2 md:p-3 rounded-full">shield</span>
              <span className="text-xs md:text-sm font-medium">Aman</span>
            </div>
          </div>
          
          {/* Trust Badges - Only visible on large screens */}
          <div className="hidden lg:block mt-6 md:mt-8 space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="material-symbols-outlined text-green-300 text-lg">check_circle</span>
              <span className="font-medium">10,000+ Pengguna Aktif</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="material-symbols-outlined text-green-300 text-lg">check_circle</span>
              <span className="font-medium">Pengiriman ke Seluruh Indonesia</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="material-symbols-outlined text-green-300 text-lg">check_circle</span>
              <span className="font-medium">Rating 4.8/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
