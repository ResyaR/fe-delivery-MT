"use client";

import LoginHeader from '@/components/auth/login/LoginHeader';
import LoginForm from '@/components/auth/login/LoginForm';
import SocialLogin from '@/components/auth/login/SocialLogin';
import RegisterLink from '@/components/auth/login/RegisterLink';

export default function SignInPage() {
  const handleBack = () => {
    window.location.href = "/";
  }

  return (
    <div className="bg-white min-h-screen w-full relative overflow-x-hidden">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>

      <div className="flex min-h-screen w-full">
        {/* Left Side - Login Form Container */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md py-12 flex flex-col items-center">
            <LoginHeader />
            <LoginForm />
            <SocialLogin />
            <RegisterLink />
          </div>
        </div>
        
        {/* Right side - Background image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          {/* Base layer - Image 2 */}
          <div className="absolute inset-0 bg-[#f5f3ff] overflow-hidden">
            <img 
              src="2.png"
              alt="Background layer 2"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay layer - Image 1 */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="/1.png"
              alt="Background layer 1"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
