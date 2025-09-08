"use client"

import { useState } from 'react'

export default function TopHeader() {
  const [activeSection, setActiveSection] = useState('home')
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
    // Close dropdowns when navigating
    setIsPricingOpen(false)
    setIsServicesOpen(false)
    setIsUserOpen(false)
  }

  return (
    <div className="w-full bg-white sticky top-0 z-50">
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
            <button
              onClick={() => scrollToSection('home')}
              className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                activeSection === 'home' 
                  ? 'text-[#E46329] bg-orange-50' 
                  : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
              }`}
            >
              Home
            </button>
            
            {/* Pricing Dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  onClick={() => scrollToSection('food-partners')}
                  className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                    activeSection === 'food-partners' 
                      ? 'text-[#E46329] bg-orange-50' 
                      : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                  }`}
                >
                  Pricing
                </button>
                <button
                  onClick={() => setIsPricingOpen(!isPricingOpen)}
                  className="ml-1 p-1 hover:bg-orange-50 rounded transition-colors"
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/xt00cx9b_expires_30_days.png" ||
                      "/placeholder.svg"
                    }
                    className="w-3 h-2"
                    alt="Dropdown"
                  />
                </button>
              </div>
              {isPricingOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('food-partners')}
                    >
                      Basic Plan
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('food-partners')}
                    >
                      Premium Plan
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('food-partners')}
                    >
                      Enterprise
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div className="relative">
              <div className="flex items-center">
                <button
                  onClick={() => scrollToSection('services')}
                  className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                    activeSection === 'services' 
                      ? 'text-[#E46329] bg-orange-50' 
                      : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="ml-1 p-1 hover:bg-orange-50 rounded transition-colors"
                >
                  <img
                    src={
                      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/xt00cx9b_expires_30_days.png" ||
                      "/placeholder.svg"
                    }
                    className="w-3 h-2"
                    alt="Dropdown"
                  />
                </button>
              </div>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('services')}
                    >
                      Food Delivery
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('services')}
                    >
                      Restaurant Partners
                    </a>
                    <a 
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                      onClick={() => scrollToSection('services')}
                    >
                      Customer Support
                    </a>
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
              <button
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
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
              </button>
              {isUserOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors">Logout</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
