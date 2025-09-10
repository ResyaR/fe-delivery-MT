"use client";

import React from "react";

export default function Header({ onLogoClick, onSignInClick }) {
  const handleSignIn = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      // Fallback navigation
      window.location.href = "/signin";
    }
  }

  const handleLogo = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      // Fallback navigation
      window.location.href = "/";
    }
  }

  return (
    <div className="flex flex-col items-start self-stretch relative mb-[34px]">
      <div className="flex items-center self-stretch bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/duhivv5k_expires_30_days.png')] bg-cover bg-center h-[100px] sm:h-[120px] md:h-[132px] pt-[30px] sm:pt-[40px] md:pt-[49px] pb-[15px] sm:pb-[20px] md:pb-[23px] px-4 sm:px-6 md:px-8">
        {/* Left spacer - same width as Sign In button to center navigation */}
        <div className="w-[140px] sm:w-[160px] md:w-[179px]"></div>
        
        {/* Center - Navigation items */}
        <div className="flex items-center justify-center flex-1 gap-4 sm:gap-6 md:gap-8">
          <span className="text-[#E46329] text-sm sm:text-lg md:text-xl font-bold mt-2 sm:mt-3 mb-[10px] sm:mb-[15px] md:mb-[19px]">
          {"Home"}
        </span>
          <div className="flex items-center w-[70px] sm:w-[80px] md:w-[94px] h-[25px] sm:h-[28px] md:h-[30px] mt-2 sm:mt-3 mb-[10px] sm:mb-[15px] md:mb-[18px] gap-[12px] sm:gap-[15px] md:gap-[18px]">
            <span className="text-[#272727] text-sm sm:text-lg md:text-xl font-bold">
              {"Pricing"}
            </span>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/lehkawcz_expires_30_days.png"}
              className="w-[8px] sm:w-[10px] md:w-[11px] h-[4px] sm:h-[5px] object-fill"
              alt="Dropdown arrow"
            />
          </div>
          <div className="flex items-center w-[90px] sm:w-[100px] md:w-[118px] h-[25px] sm:h-[28px] md:h-[30px] mt-2 sm:mt-3 mb-[10px] sm:mb-[15px] md:mb-[18px] gap-[18px] sm:gap-[22px] md:gap-[25px]">
            <span className="text-[#272727] text-sm sm:text-lg md:text-xl font-bold">
              {"Services"}
            </span>
            <img
              src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/4varp7rc_expires_30_days.png"}
              className="w-[8px] sm:w-[10px] md:w-[11px] h-[4px] sm:h-[5px] object-fill"
              alt="Dropdown arrow"
            />
          </div>
          <img
            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/j1v18r1i_expires_30_days.png"}
            className="w-[20px] sm:w-[23px] md:w-[26px] h-[25px] sm:h-[28px] md:h-[31px] mt-2 sm:mt-3 mb-[10px] sm:mb-[15px] md:mb-[17px] object-fill"
            alt="Search icon"
          />
        </div>

        {/* Right side - Sign In button */}
        <button 
          onClick={handleSignIn}
          className="flex items-center justify-center bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/cjn2hr5n_expires_30_days.png')] bg-cover bg-center w-[100px] sm:w-[120px] md:w-[140px] h-[35px] sm:h-[40px] md:h-[45px] py-2 px-4 cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
        >
          <span className="text-[#272727] text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">
            {"Sign In"}
          </span>
        </button>
      </div>
      <img
        onClick={handleLogo}
        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/v5qp5drc_expires_30_days.png"}
        className="w-[150px] sm:w-[180px] md:w-[204px] h-[110px] sm:h-[130px] md:h-[147px] absolute top-0 left-0 border-0 object-fill cursor-pointer"
        alt="Logo"
      />
    </div>
  );
}