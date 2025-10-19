"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';

export default function MTTransLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      showSuccess('Login berhasil! Selamat datang di MT Trans');
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      showError('Login gagal. Silakan periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login clicked');
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    console.log('Facebook login clicked');
  };

  const handleRegister = () => {
    router.push('/signup');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Kembali</span>
          </button>
          
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Masuk ke MT Trans
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
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
                  className="block w-full pl-10 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  id="email"
                  name="email"
                  placeholder="Masukkan email Anda"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                  className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
            </div>
            
            <div>
              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login Sekarang'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-light dark:bg-background-dark text-gray-500 dark:text-gray-400">
                  Atau masuk dengan
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.98-4.52 1.98-5.45 0-9.88-4.45-9.88-9.88s4.43-9.88 9.88-9.88c2.6 0 4.52.99 5.92 2.38l-2.22 2.22c-.8-.74-1.96-1.28-3.32-1.28-4.07 0-7.38 3.3-7.38 7.38s3.3 7.38 7.38 7.38c2.25 0 3.45-.96 4.3-1.82.72-.77 1.2-2.02 1.38-3.62H12.48z" fill="#4285F4"></path>
                  <path clipRule="evenodd" d="M21.22 10.92H12.48v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1a6.77 6.77 0 0 1-4.52 1.98c-5.45 0-9.88-4.45-9.88-9.88s4.43-9.88 9.88-9.88c2.6 0 4.52.99 5.92 2.38l-2.22 2.22c-.8-.74-1.96-1.28-3.32-1.28-4.07 0-7.38 3.3-7.38 7.38s3.3 7.38 7.38 7.38c2.25 0 3.45-.96 4.3-1.82.72-.77 1.2-2.02 1.38-3.62z" fill="#34A853" fillRule="evenodd"></path>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.98-4.52 1.98-5.45 0-9.88-4.45-9.88-9.88s4.43-9.88 9.88-9.88c2.6 0 4.52.99 5.92 2.38l-2.22 2.22c-.8-.74-1.96-1.28-3.32-1.28-4.07 0-7.38 3.3-7.38 7.38s3.3 7.38 7.38 7.38c2.25 0 3.45-.96 4.3-1.82.72-.77 1.2-2.02 1.38-3.62H12.48z" fill="#FBBC05"></path>
                  <path clipRule="evenodd" d="M21.22 10.92H12.48v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1a6.77 6.77 0 0 1-4.52 1.98c-5.45 0-9.88-4.45-9.88-9.88s4.43-9.88 9.88-9.88c2.6 0 4.52.99 5.92 2.38l-2.22 2.22c-.8-.74-1.96-1.28-3.32-1.28-4.07 0-7.38 3.3-7.38 7.38s3.3 7.38 7.38 7.38c2.25 0 3.45-.96 4.3-1.82.72-.77 1.2-2.02 1.38-3.62z" fill="#EA4335" fillRule="evenodd"></path>
                </svg>
                <span>Login <span className="normal-case">dengan</span> Google</span>
              </button>
              
              <button
                onClick={handleFacebookLogin}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg aria-hidden="true" className="w-5 h-5 mr-3 text-[#1877F2]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"></path>
                </svg>
                <span>Login dengan Facebook</span>
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?
            <button
              onClick={handleRegister}
              className="font-medium text-primary hover:text-primary/80 ml-1"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
      
      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 gradient-bg rounded-l-xl">
        <div className="text-center text-white space-y-4">
          <div className="flex justify-center">
            <img
              alt="Happy delivery person"
              className="w-full max-w-sm h-auto rounded-xl shadow-2xl"
              src="/login.png"
            />
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Your Trusted Delivery Partner
          </h1>
          <p className="text-lg opacity-90">Fast, Safe, and Affordable Logistics</p>
          <div className="flex justify-center items-center gap-4 text-2xl mt-4">
            <span className="material-symbols-outlined">bolt</span>
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="material-symbols-outlined">shield</span>
          </div>
        </div>
      </div>
    </div>
  );
}
