"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login Now clicked!");
  }

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log("Login with Google clicked!");
  }

  const handleFacebookLogin = () => {
    // Handle Facebook login logic here
    console.log("Login with Facebook clicked!");
  }

  const handleSignUp = () => {
    window.location.href = "/signup";
  }

  const handleBack = () => {
    window.location.href = "/";
  }

  return (
    <div className="bg-white overflow-hidden min-h-screen">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
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

      <div className="flex items-start bg-white pl-[80px] sm:pl-[120px] md:pl-[159px] min-h-screen">
        <div className="flex flex-col shrink-0 items-start mt-[200px] sm:mt-[250px] md:mt-[300px] mr-8 sm:mr-20 md:mr-40">
          <div className="flex flex-col items-center self-stretch mb-2.5">
            <span className="text-black text-3xl font-bold">
              Login
            </span>
          </div>
          <span className="text-neutral-600 text-base mb-6 mx-3.5">
            How to i get started lorem ipsum dolor at?
          </span>
          
          {/* Username Input */}
          <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-[18px] gap-1.5 rounded-2xl w-full max-w-[300px]">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/a2vl56z8_expires_30_days.png" 
              className="w-6 h-6 object-fill"
              alt="Username icon"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-[#1C1C1C] bg-transparent text-xs flex-1 py-[3px] border-0 outline-none"
            />
          </div>
          
          {/* Password Input */}
          <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-6 gap-1.5 rounded-2xl w-full max-w-[300px]">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/s3s03r4u_expires_30_days.png" 
              className="w-6 h-6 object-fill"
              alt="Password icon"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-[#1C1C1C] bg-transparent text-xs flex-1 py-[3px] border-0 outline-none"
            />
          </div>
          
          {/* Login Button */}
          <button 
            className="flex flex-col items-start text-left py-[17px] px-[30px] mb-6 mx-[60px] sm:mx-[100px] md:mx-[120px] rounded-2xl border-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{background: "linear-gradient(180deg, #9181F4, #5038ED)"}}
            onClick={handleLogin}
          >
            <span className="text-white text-xs font-bold">
              Login Now
            </span>
          </button>
          
          {/* Divider */}
          <div className="flex flex-col items-start relative py-[5px] px-[60px] sm:px-[100px] md:px-[113px] mb-6">
            <span className="text-[#1C1C1C] text-base">
              Login with Others
            </span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/6ltifcdy_expires_30_days.png" 
              className="w-[200px] sm:w-[300px] md:w-[364px] h-[1px] absolute top-[11px] left-0 object-fill"
              alt="Divider line"
            />
          </div>
          
          {/* Social Login Buttons */}
          <div className="flex flex-col items-center gap-4 w-full max-w-[300px]">
            <button 
              className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/q83k7af1_expires_30_days.png" 
                className="w-[30px] h-[30px] object-fill"
                alt="Google icon"
              />
              <span className="text-[#1C1C1C] text-xs">
                Login with google
              </span>
            </button>
            
            <button 
              className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleFacebookLogin}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/rj6hv025_expires_30_days.png" 
                className="w-[30px] h-[30px] object-fill"
                alt="Facebook icon"
              />
              <span className="text-[#1C1C1C] text-xs">
                Login with Facebook
              </span>
            </button>
          </div>
          
          {/* Sign Up Link */}
          <div className="flex items-center ml-6 sm:ml-10 md:ml-12 gap-3 mt-6">
            <span className="text-neutral-600 text-sm sm:text-base">
              Belum Memiliki Akun?
            </span>
            <button 
              className="text-[#39DA49] text-sm sm:text-base font-bold cursor-pointer hover:underline"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        {/* Right side - Background image */}
        <div className="flex-1 items-start relative hidden lg:block">
          <div className="flex flex-col items-center self-stretch bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/qtq2bvt7_expires_30_days.png')] bg-cover bg-center py-[122px] rounded-3xl">
            <div className="bg-[#FFFFFF33] w-[300px] sm:w-[350px] md:w-[412px] h-[400px] sm:h-[450px] md:h-[524px] rounded-[46px] border border-solid border-[#FFFFFF82]">
            </div>
          </div>
          <div className="flex flex-col items-start bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/fgos3yip_expires_30_days.png')] bg-cover bg-center w-[500px] sm:w-[600px] md:w-[785px] absolute bottom-0 right-[19px] rounded-3xl">
            <span className="text-white text-[20px] sm:text-[26px] md:text-[32px] font-bold mb-[91px] mx-32 sm:mx-48 md:mx-72">
              Your Logistics Partner for Seamless Delivery
            </span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/yiuqq5rc_expires_30_days.png" 
              className="w-[60px] sm:w-[70px] md:w-[79px] h-[60px] sm:w-[70px] md:h-[79px] mb-[124px] ml-[150px] sm:ml-[180px] md:ml-[226px] rounded-3xl object-fill"
              alt="Delivery icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 