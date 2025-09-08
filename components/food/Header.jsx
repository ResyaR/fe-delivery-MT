"use client"

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/sb7tt2m9_expires_30_days.png" ||
                "/placeholder.svg"
              }
              className="h-8 sm:h-12 w-auto"
              alt="Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <span className="text-[#E46329] text-base lg:text-lg font-bold cursor-pointer hover:text-orange-600 transition-colors">Home</span>
            
            {/* Pricing Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setIsPricingOpen(!isPricingOpen)}
              >
                <span className="text-[#272727] text-base lg:text-lg font-bold mr-2">Pricing</span>
                <img
                  src={
                    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/xt00cx9b_expires_30_days.png" ||
                    "/placeholder.svg"
                  }
                  className="w-3 h-2"
                  alt="Dropdown"
                />
              </div>
              {isPricingOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Basic Plan</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Premium Plan</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Enterprise</a>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <div 
                className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                <span className="text-[#272727] text-base lg:text-lg font-bold mr-2">Services</span>
                <img
                  src={
                    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/xt00cx9b_expires_30_days.png" ||
                    "/placeholder.svg"
                  }
                  className="w-3 h-2"
                  alt="Dropdown"
                />
              </div>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Food Delivery</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Restaurant Partners</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Customer Support</a>
                  </div>
                </div>
              )}
            </div>

            <img
              src="/search-icon.png"
              className="w-4 h-4 lg:w-5 lg:h-5 cursor-pointer hover:opacity-70 transition-opacity"
              alt="Search"
            />
          </div>

          {/* Right side - Icons and User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <img
              src={
                "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png" ||
                "/placeholder.svg"
              }
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-full cursor-pointer"
              alt="Profile"
            />
            <div className="relative">
              <div 
                className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <span className="text-[#272727] text-sm sm:text-base lg:text-lg font-bold mr-2 hidden sm:block">Muhammad Riyan F.</span>
                <img
                  src={
                    "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/4oadv3tz_expires_30_days.png" ||
                    "/placeholder.svg"
                  }
                  className="w-3 h-2"
                  alt="Dropdown"
                />
              </div>
              {isUserOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-[#E46329] font-bold">Home</a>
              <a href="#" className="block px-3 py-2 text-[#272727] font-bold">Pricing</a>
              <a href="#" className="block px-3 py-2 text-[#272727] font-bold">Services</a>
              <div className="flex items-center px-3 py-2">
                <img src="/search-icon.png" className="w-5 h-5 mr-2" alt="Search" />
                <span className="text-[#272727] font-bold">Search</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
