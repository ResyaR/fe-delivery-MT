import React from 'react';

const SocialSignup = () => {
  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log("Sign Up with Google clicked!");
  }

  const handleFacebookSignUp = () => {
    // Handle Facebook sign up logic here
    console.log("Sign Up with Facebook clicked!");
  }

  return (
    <div className="flex flex-col items-start w-full">
      {/* Divider */}
      <div className="flex flex-col items-start relative py-[5px] w-full mb-6">
        <div className="flex items-center justify-center w-full">
          <div className="border-t border-gray-300 flex-grow"></div>
          <span className="text-neutral-600 text-sm sm:text-base px-4">
            Sign Up with Others
          </span>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>
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
    </div>
  );
};

export default SocialSignup;
