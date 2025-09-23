"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import UserMenu from "../main/UserMenu";
import Image from "next/image";
import Link from "next/link";

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
      <div className="h-[90px]" /> {/* Spacer for fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[90px] py-2">
            {/* Logo section */}
            <div className="w-[240px] flex items-center">
              <img
                onClick={handleLogo}
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/v5qp5drc_expires_30_days.png"
                className="w-[150px] sm:w-[180px] md:w-[204px] h-[110px] object-contain cursor-pointer"
                alt="Logo"
              />
            </div>

            {/* Mobile menu button - only shows on mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden z-50 w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>

            {/* Center - Navigation items */}
            <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[#E46329] text-base md:text-lg font-bold hover:opacity-80 transition-opacity cursor-pointer px-4 py-2"
              >
                Home
              </button>

              {/* Pricing Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsPricingOpen(!isPricingOpen)}
                  className="flex items-center text-[#272727] text-base md:text-lg font-bold hover:text-[#E46329] transition-colors px-4 py-2 group"
                >
                  <span>Pricing</span>
                  <svg 
                    className={`w-4 h-4 ml-1 transform transition-transform ${isPricingOpen ? 'rotate-180' : ''} fill-current`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
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
                  className="flex items-center text-[#272727] text-base md:text-lg font-bold hover:text-[#E46329] transition-colors px-4 py-2 group"
                >
                  <span>Services</span>
                  <svg 
                    className={`w-4 h-4 ml-1 transform transition-transform ${isServicesOpen ? 'rotate-180' : ''} fill-current`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
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
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-4">
              {/* Search Box */}
              <div className="relative hidden sm:flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-[200px] md:w-[250px] h-[46px] pl-6 pr-12 rounded-full border border-gray-200 bg-gray-50/50 shadow-sm hover:shadow-md focus:shadow-lg focus:border-[#E46329] focus:outline-none focus:ring-2 focus:ring-[#E46329] focus:ring-opacity-20 transition-all"
                />
                <div className="absolute right-5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center">
                <UserMenu />
                {!user && (
                  <button 
                    onClick={handleSignIn}
                    className="flex items-center justify-center bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/cjn2hr5n_expires_30_days.png')] bg-cover bg-center min-w-[140px] px-8 h-[46px] cursor-pointer hover:opacity-90 hover:shadow-md transition-all rounded-full ml-6 shadow-sm"
                  >
                    <span className="text-[#272727] text-base font-bold whitespace-nowrap">
                      Sign In
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[80px] left-0 w-full bg-white shadow-lg z-40"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col py-4 gap-4">
                {/* Mobile Search Box */}
                <div className="relative flex items-center sm:hidden mb-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-[46px] pl-6 pr-12 rounded-full border border-gray-200 bg-gray-50/50 shadow-sm hover:shadow-md focus:shadow-lg focus:border-[#E46329] focus:outline-none focus:ring-2 focus:ring-[#E46329] focus:ring-opacity-20 transition-all"
                  />
                  <div className="absolute right-5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-[#E46329] text-lg font-bold py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Home
                </button>
                
                <button
                  onClick={() => setIsPricingOpen(!isPricingOpen)}
                  className="text-[#272727] text-lg font-bold py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Pricing
                </button>
                
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="text-[#272727] text-lg font-bold py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Services
                </button>

                <div className="h-[1px] bg-gray-200 my-2" />
                
                {!user && (
                  <button 
                    onClick={handleSignIn}
                    className="flex items-center justify-center bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/cjn2hr5n_expires_30_days.png')] bg-cover bg-center h-[46px] min-w-[140px] px-8 cursor-pointer hover:opacity-90 hover:shadow-md transition-all rounded-full shadow-sm"
                  >
                    <span className="text-[#272727] text-lg font-bold">
                      Sign In
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
