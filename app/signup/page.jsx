"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log("Sign Up clicked!");
  }

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Sign Up with Google clicked!");
  }

  const handleFacebookSignUp = () => {
    // Handle Facebook sign up logic here
    console.log("Sign Up with Facebook clicked!");
  }

  const handleBack = () => {
    router.push("/");
  }

  const handleSignIn = () => {
    router.push("/signin");
  }

  return (
    <div className="bg-white">
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

      <div className="flex flex-col items-start bg-white">
        <div className="flex items-center ml-[80px] sm:ml-[120px] md:ml-[179px]">
          <div className="flex flex-col shrink-0 items-start mr-8 sm:mr-12 md:mr-[154px]">
            <div className="flex flex-col items-center self-stretch mb-2.5">
              <span className="text-black text-2xl sm:text-3xl font-bold">
                sign up
              </span>
            </div>
            <span className="text-neutral-600 text-sm sm:text-base mb-6 mx-3.5">
              How to i get started lorem ipsum dolor at?
            </span>
            
            {/* Username Input */}
            <div className="flex items-center bg-[#EFEDFFCC] py-3.5 px-[18px] mb-[18px] gap-1.5 rounded-2xl w-full max-w-[300px]">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/lw8umszb_expires_30_days.png" 
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
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/z6zsoj8h_expires_30_days.png" 
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
            
            {/* Sign Up Button */}
            <button 
              className="flex flex-col items-start text-left py-[17px] px-[30px] sm:px-[35px] md:px-[41px] mb-6 mx-[60px] sm:mx-[100px] md:mx-[120px] rounded-2xl border-0 cursor-pointer hover:opacity-90 transition-opacity"
              style={{background: "linear-gradient(180deg, #9181F4, #5038ED)"}}
              onClick={handleSignUp}
            >
              <span className="text-white text-xs font-bold">
                Sign Up
              </span>
            </button>
            
            {/* Divider */}
            <div className="flex flex-col items-start relative py-[5px] pl-[60px] sm:pl-[100px] md:pl-[113px] pr-[60px] sm:pr-[80px] md:pr-[97px] mb-6">
              <span className="text-neutral-600 text-sm sm:text-base">
                Sign Up with Others
              </span>
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/fs0ucfxt_expires_30_days.png" 
                className="w-[200px] sm:w-[300px] md:w-[364px] h-[1px] absolute top-[11px] left-0 object-fill"
                alt="Divider line"
              />
            </div>
            
            {/* Social Sign Up Buttons */}
            <div className="flex flex-col items-start gap-4 w-full max-w-[300px]">
              <button 
                className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleGoogleSignUp}
              >
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/yi5k60rh_expires_30_days.png" 
                  className="w-[30px] h-[30px] object-fill"
                  alt="Google icon"
                />
                <span className="text-[#1C1C1C] text-xs">
                  Sign Up with google
                </span>
              </button>
              
              <button 
                className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleFacebookSignUp}
              >
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/n7l74m9p_expires_30_days.png" 
                  className="w-[30px] h-[30px] object-fill"
                  alt="Facebook icon"
                />
                <span className="text-[#1C1C1C] text-xs">
                  Sign Up with Facebook
                </span>
              </button>
            </div>
            
            {/* Sign In Link */}
            <div className="flex items-center ml-6 sm:ml-10 md:ml-12 gap-3 mt-6">
              <span className="text-neutral-600 text-sm sm:text-base">
                Sudah Memiliki Akun?
              </span>
              <button 
                className="text-[#39DA49] text-sm sm:text-base font-bold cursor-pointer hover:underline"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </div>
          </div>
          
          {/* Right side - Background image */}
          <div className="flex flex-col shrink-0 items-center relative hidden lg:block">
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/b39dk663_expires_30_days.png" 
              className="w-[500px] sm:w-[600px] md:w-[683px] h-[600px] sm:h-[700px] md:h-[768px] rounded-3xl object-fill"
              alt="Background"
            />
            <div className="bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k8ek3yau_expires_30_days.png')] bg-cover bg-center w-[500px] sm:w-[600px] md:w-[785px] absolute top-[80px] sm:top-[100px] md:top-[122px] right-[10px] sm:right-[15px] md:right-[19px] rounded-3xl">
              <div className="flex flex-col items-start self-stretch relative ml-[150px] sm:ml-[200px] md:ml-[257px] mr-[60px] sm:mr-[80px] md:mr-[116px]">
                <div className="flex flex-col items-start self-stretch bg-[#FFFFFF33] pt-[15px] sm:pt-[18px] md:pt-[21px] pb-[200px] sm:pb-[230px] md:pb-[273px] rounded-[35px] sm:rounded-[40px] md:rounded-[46px] border border-solid border-[#FFFFFF82]">
                  <span className="text-white text-[20px] sm:text-[26px] md:text-[32px] font-bold w-[120px] sm:w-[150px] md:w-[174px] ml-[15px] sm:ml-[20px] md:ml-[23px]">
                    Your Logistics Partner for Seamless Delivery
                  </span>
                </div>
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/qshhccgx_expires_30_days.png" 
                  className="w-[60px] sm:w-[70px] md:w-[79px] h-[60px] sm:w-[70px] md:h-[79px] absolute bottom-[70px] sm:bottom-[80px] md:bottom-[98px] left-[-20px] sm:left-[-25px] md:left-[-31px] rounded-3xl object-fill"
                  alt="Delivery icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
