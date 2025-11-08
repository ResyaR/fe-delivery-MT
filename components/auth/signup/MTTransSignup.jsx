"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useToast } from '@/components/common/ToastProvider';
import api from '@/lib/axios';
import { API_BASE_URL } from '@/lib/config';

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function MTTransSignup() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const fullNameInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Username availability
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // Auto-focus first input on mount
  useEffect(() => {
    if (fullNameInputRef.current) {
      fullNameInputRef.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  };

  const validateFullName = (name) => {
    const regex = /^[a-zA-Z\s]{2,50}$/;
    return regex.test(name);
  };

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsernameAvailability = useCallback(
    debounce(async (username) => {
      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      setCheckingUsername(true);
      try {
        const response = await api.get(`/auth/check-username?username=${username}`);
        setUsernameAvailable(response.data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time password strength
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Check username availability
    if (name === 'username') {
      setUsernameAvailable(null);
      checkUsernameAvailability(value);
    }
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'fullName':
        if (!formData.fullName) {
          newErrors.fullName = 'Nama lengkap wajib diisi';
        } else if (!validateFullName(formData.fullName)) {
          newErrors.fullName = 'Nama hanya boleh mengandung huruf dan spasi';
        } else {
          delete newErrors.fullName;
        }
        break;

      case 'email':
        if (!formData.email) {
          newErrors.email = 'Email wajib diisi';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Format email tidak valid';
        } else {
          delete newErrors.email;
        }
        break;

      case 'username':
        if (!formData.username) {
          newErrors.username = 'Username wajib diisi';
        } else if (!validateUsername(formData.username)) {
          newErrors.username = 'Username harus 3-20 karakter (huruf, angka, underscore)';
        } else {
          delete newErrors.username;
        }
        break;

      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password minimal 8 karakter';
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    if (!formData.fullName || !validateFullName(formData.fullName)) {
      newErrors.fullName = 'Nama lengkap tidak valid';
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }
    if (!formData.username || !validateUsername(formData.username)) {
      newErrors.username = 'Username tidak valid';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    if (!acceptTerms) {
      showError('Anda harus menyetujui Syarat & Ketentuan');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await register(formData.email, formData.password, formData.username);
      console.log('Registration response:', response);
      
      showSuccess('Registrasi berhasil! Silakan verifikasi email Anda.');
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage?.includes('already exists') || errorMessage?.includes('Email already')) {
        showError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else {
      showError('Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/signin');
  };

  const handleBack = () => {
    router.push('/');
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return 'Minimal 8 karakter';
      case 1: return 'Lemah';
      case 2: return 'Sedang';
      case 3: return 'Kuat';
      case 4: return 'Sangat Kuat';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (level) => {
    if (passwordStrength >= level) {
      switch (passwordStrength) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  };

  return (
    <div className="min-h-screen flex md:flex-row flex-col">
      {/* Left Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 order-2 md:order-1">
        <div className="w-full max-w-md bg-white dark:bg-black/20 p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg">
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
              Daftar ke MT Trans
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
              Buat akun baru untuk mengatur pengiriman Anda dengan mudah.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="fullName">
                Nama Lengkap
              </label>
              <input
                ref={fullNameInputRef}
                className={`w-full px-4 py-3 bg-background-light dark:bg-background-dark border ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg focus:ring-[#E00000] focus:border-[#E00000] transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-sm sm:text-base truncate`}
                id="fullName"
                name="fullName"
                placeholder="Nama Lengkap"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={() => handleBlur('fullName')}
                aria-label="Full name"
                aria-required="true"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                required
              />
              {errors.fullName && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs" id="fullName-error" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.fullName}
                </div>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full px-4 py-3 bg-background-light dark:bg-background-dark border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg focus:ring-[#E00000] focus:border-[#E00000] transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-sm sm:text-base truncate`}
                id="email"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                aria-label="Email address"
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                required
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs" id="email-error" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
              <input
                  className={`w-full px-4 py-3 bg-background-light dark:bg-background-dark border ${errors.username ? 'border-red-500' : usernameAvailable === false ? 'border-red-500' : usernameAvailable === true ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg focus:ring-[#E00000] focus:border-[#E00000] transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white pr-24`}
                id="username"
                name="username"
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                  onBlur={() => handleBlur('username')}
                  aria-label="Username"
                  aria-required="true"
                  aria-invalid={errors.username || usernameAvailable === false ? 'true' : 'false'}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                required
              />
                {checkingUsername && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    Checking...
                  </span>
                )}
                {!checkingUsername && usernameAvailable === true && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Available
                  </span>
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-red-600">
                    Taken
                  </span>
                )}
              </div>
              {errors.username && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs" id="username-error" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </div>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className={`w-full px-4 py-3 pr-10 bg-background-light dark:bg-background-dark border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-lg focus:ring-[#E00000] focus:border-[#E00000] transition duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-sm sm:text-base truncate`}
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  aria-label="Password"
                  aria-required="true"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : 'password-strength'}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2" id="password-strength">
                  <div className="flex gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 sm:h-2.5 flex-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor(level)}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                    Kekuatan Password: {getPasswordStrengthText()}
                  </p>
                </div>
              )}
              
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs" id="password-error" role="alert">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>
            
            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-[#E00000] focus:ring-[#E00000] border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Saya setuju dengan{' '}
                <a href="/terms" className="text-[#E00000] hover:underline" target="_blank" rel="noopener noreferrer">
                  Syarat & Ketentuan
                </a>
                {' '}dan{' '}
                <a href="/privacy" className="text-[#E00000] hover:underline" target="_blank" rel="noopener noreferrer">
                  Kebijakan Privasi
                </a>
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
            
            {/* Submit Button */}
            <div>
              <button
                className="w-full bg-[#E00000] text-white font-semibold py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-[#E00000] hover:to-[#C00000] transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 active:bg-[#B00000]"
                type="submit"
                disabled={isLoading || usernameAvailable === false}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mendaftar...
                  </div>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </div>
          </form>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Proses cepat dan mudah, hanya butuh 1 menit.
          </p>
          
          <p className="text-center text-sm mt-6">
            <span className="text-gray-600 dark:text-gray-400">Sudah punya akun?</span>{' '}
            <button
              onClick={handleLogin}
              className="font-semibold text-[#E00000] hover:text-[#C00000] transition-colors"
            >
              Login Sekarang
            </button>
          </p>
        </div>
      </div>
      
       {/* Right Side - Hero Section */}
       <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 sm:p-8 lg:p-12 order-1 md:order-2 gradient-bg rounded-bl-[30px] rounded-br-[30px] md:rounded-l-[30px] md:rounded-br-none min-h-[50vh] md:min-h-screen">
        <div className="text-center text-white max-w-lg space-y-4 md:space-y-6 relative radial-gradient-behind">
          <div className="image-content mb-4 md:mb-6">
            <img
              alt="Partner logistik terpercaya"
              className="w-full max-w-xs md:max-w-sm h-auto object-cover rounded-xl shadow-md"
              src="/login.png"
            />
          </div>
          <div className="image-content">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Partner Logistik untuk Pengiriman Lancar
            </h2>
            <p className="mt-4 text-base md:text-lg opacity-90 leading-relaxed">
              Bergabung dengan MT Trans untuk pengalaman pengiriman yang andal, cepat, dan aman
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
    </div>
  );
}
