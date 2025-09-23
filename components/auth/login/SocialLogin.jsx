"use client";

export default function SocialLogin() {
  return (
    <>
      {/* Divider */}
      <div className="w-full text-center relative py-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <span className="relative px-4 bg-white text-[#1C1C1C] text-base inline-block">
          Login with Others
        </span>
      </div>
      
      {/* Social Login Buttons */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[300px]">
        <button 
          type="button"
          className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => console.log("Login with Google clicked!")}
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
          type="button"
          className="flex items-center justify-center py-[11px] px-4 gap-2 rounded-2xl border border-solid border-[#F0EDFF] w-full cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => console.log("Login with Facebook clicked!")}
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
    </>
  );
}