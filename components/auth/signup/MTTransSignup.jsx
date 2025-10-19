"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';

export default function MTTransSignup() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
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
      const response = await register(formData.email, formData.password, formData.username);
      console.log('Registration response:', response);
      
      showSuccess('Registrasi berhasil! Silakan verifikasi email Anda.');
      // Redirect to verification page with email parameter
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Registration failed:', error);
      showError('Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implement Google signup logic here
    console.log('Google signup clicked');
  };

  const handleFacebookSignup = () => {
    // Implement Facebook signup logic here
    console.log('Facebook signup clicked');
  };

  const handleLogin = () => {
    router.push('/signin');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md bg-white dark:bg-black/20 p-8 sm:p-10 rounded-xl shadow-lg">
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
          
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Daftar ke MT Trans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Buat akun baru untuk mengatur pengiriman Anda dengan mudah.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="sr-only" htmlFor="fullName">Nama Lengkap</label>
              <input
                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="fullName"
                name="fullName"
                placeholder="Nama Lengkap"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="username">Username</label>
              <input
                className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                id="username"
                name="username"
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pr-10 bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                  id="password"
                  name="password"
                  placeholder="Password"
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
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 shadow-md disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Proses cepat dan mudah, hanya butuh 1 menit.
          </p>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black/20 text-gray-500 dark:text-gray-400">
                Atau daftar dengan
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#4285F4"></path>
                <path d="M5.491,28.636C6.964,25.964,8.5,24,8.5,24l5.657,5.657C14.158,29.657,14,30.341,14,31c0,1.023,0.149,2.02,0.41,2.964L5.491,28.636z" fill="#34A853"></path>
                <path d="M14.41,15.036C14.149,15.98,14,16.977,14,18c0,0.659,0.025,1.319,0.074,1.975l8.438-8.438C21.2,11.23,17.925,11.52,14.41,15.036z" fill="#FBBC05"></path>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#EA4335"></path>
                <path d="M4,4h40v40H4z" fill="none"></path>
              </svg>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-base">Google</span>
            </button>
            
            <button
              onClick={handleFacebookSignup}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 shadow-sm"
            >
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.99,3.657,9.128,8.438,9.878V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.24,0-1.628,0.772-1.628,1.562V12h2.773l-.443,2.89h-2.33V21.878C18.343,21.128,22,16.99,22,12z"></path>
              </svg>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-base">Facebook</span>
            </button>
          </div>
          
          <p className="text-center text-sm mt-8">
            <span className="text-gray-600 dark:text-gray-400">Sudah punya akun?</span>
            <button
              onClick={handleLogin}
              className="font-semibold text-primary hover:underline ml-1"
            >
              Login Sekarang
            </button>
          </p>
        </div>
      </div>
      
       {/* Right Side - Hero Section */}
       <div className="hidden lg:flex w-1/2 items-center justify-center p-6 sm:p-12 order-1 lg:order-2 gradient-bg rounded-bl-[30px] rounded-br-[30px] lg:rounded-l-[30px] lg:rounded-br-none min-h-[50vh] lg:min-h-screen">
        <div className="text-center text-white max-w-md relative radial-gradient-behind">
          <div className="image-content">
            <img
              alt="Happy delivery person"
              className="w-full h-80 sm:h-96 object-cover rounded-xl mb-8 shadow-2xl"
              src="/login.png"
            />
          </div>
          <div className="image-content">
            <h2 className="text-4xl font-bold">Your Logistics Partner for Seamless Delivery</h2>
            <p className="mt-4 text-lg opacity-90">Join MT Trans and experience reliable, fast, and safe delivery management.</p>
            <div className="mt-6 flex justify-center space-x-6 text-4xl">
              <span>⚡</span>
              <span>🚚</span>
              <span>🛡️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
