"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import UserMenu from "../main/UserMenu";

export default function Header({ onLogoClick, onSignInClick }) {
  const { user } = useAuth();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      window.location.href = "/signin";
    }
  }

  const handleLogo = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.href = "/";
    }
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="h-[100px] sm:h-[120px] md:h-[132px]" /> {/* Spacer untuk menggantikan header yang fixed */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className={`flex items-center justify-between w-full transition-all duration-300 ${
          isScrolled 
            ? 'h-[70px] py-2' 
            : 'bg-[url("https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/duhivv5k_expires_30_days.png")] bg-cover bg-center h-[100px] sm:h-[120px] md:h-[132px] pt-[30px] sm:pt-[40px] md:pt-[49px] pb-[15px] sm:pb-[20px] md:pb-[23px]'
        } px-4 sm:px-6 md:px-8`}>
          {/* Left spacer - same width as Sign In button */}
          <div className="w-[140px] sm:w-[160px] md:w-[179px]"></div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden absolute right-4 top-4 z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Center - Navigation items */}
          <div className={`flex items-center justify-center flex-1 gap-4 sm:gap-6 md:gap-8 ${isMobileMenuOpen ? 'flex-col absolute top-20 left-0 w-full bg-white p-4 shadow-lg' : 'hidden md:flex'}`}>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#E46329] text-sm sm:text-lg md:text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              Home
            </button>

            {/* Pricing Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPricingOpen(!isPricingOpen)}
                className="flex items-center text-[#272727] text-sm sm:text-lg md:text-xl font-bold hover:text-[#E46329] transition-colors"
              >
                <span>Pricing</span>
                <img
                  src="/dropdown-arrow.png"
                  className={`w-[8px] sm:w-[10px] md:w-[11px] h-[4px] sm:h-[5px] object-fill ml-2 transform transition-transform ${isPricingOpen ? 'rotate-180' : ''}`}
                  alt="Dropdown arrow"
                />
              </button>

              <AnimatePresence>
                {isPricingOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <a href="/pricing/basic" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Basic Plan</a>
                    <a href="/pricing/premium" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Premium Plan</a>
                    <a href="/pricing/enterprise" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Enterprise</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center text-[#272727] text-sm sm:text-lg md:text-xl font-bold hover:text-[#E46329] transition-colors"
              >
                <span>Services</span>
                <img
                  src="/dropdown-arrow.png"
                  className={`w-[8px] sm:w-[10px] md:w-[11px] h-[4px] sm:h-[5px] object-fill ml-2 transform transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                  alt="Dropdown arrow"
                />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <a href="/services/delivery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Food Delivery</a>
                    <a href="/services/tracking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Order Tracking</a>
                    <a href="/services/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">24/7 Support</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="flex items-center justify-center">
              <img
                src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/j1v18r1i_expires_30_days.png"}
                className="w-[20px] sm:w-[23px] md:w-[26px] h-[25px] sm:h-[28px] md:h-[31px] object-fill hover:opacity-80 transition-opacity"
                alt="Search icon"
              />
            </button>
          </div>

          {/* Right side - Sign In button or User Menu */}
          <div className="flex items-center">
            <UserMenu />
            {!user && (
              <button 
                onClick={handleSignIn}
                className="flex items-center justify-center bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/cjn2hr5n_expires_30_days.png')] bg-cover bg-center w-[100px] sm:w-[120px] md:w-[140px] h-[35px] sm:h-[40px] md:h-[45px] py-2 px-4 cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
              >
                <span className="text-[#272727] text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">
                  Sign In
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Logo */}
        <img
          onClick={handleLogo}
          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/v5qp5drc_expires_30_days.png"}
          className={`w-[150px] sm:w-[180px] md:w-[204px] h-[110px] sm:h-[130px] md:h-[147px] absolute top-0 left-0 border-0 object-fill cursor-pointer transition-all duration-300 ${
            isScrolled ? 'scale-75 -translate-y-3' : ''
          }`}
          alt="Logo"
        />
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
