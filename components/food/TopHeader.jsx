"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopHeader() {
  const [activeSection, setActiveSection] = useState('home')
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Calculate header height based on scroll state
  const headerHeight = isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsPricingOpen(false)
        setIsServicesOpen(false)
        setIsUserOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Variants for dropdown animation
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      transition: { duration: 0.15 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  return (
    <>
      {/* Spacer div that pushes content below the fixed header */}
      <div className={`w-full ${headerHeight}`} aria-hidden="true" />
      
      {/* Fixed header */}
      <header 
        className={`w-full bg-white backdrop-blur-md fixed top-0 left-0 right-0 z-[1000] border-b transition-all duration-300 ${
          isScrolled ? 'shadow-md border-transparent' : 'border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${headerHeight}`}>
            {/* Logo */}
            <div className="flex items-center">
              <motion.img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/sb7tt2m9_expires_30_days.png"
                className="h-8 sm:h-12 w-auto"
                alt="Logo"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <motion.button
                onClick={() => scrollToSection('home')}
                className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                  activeSection === 'home' 
                    ? 'text-[#E46329] bg-orange-50' 
                    : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
              
              {/* Pricing Dropdown */}
              <div className="relative dropdown-container">
                <div className="flex items-center">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPricingOpen(!isPricingOpen)
                    }}
                    className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                      activeSection === 'food-partners' 
                        ? 'text-[#E46329] bg-orange-50' 
                        : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pricing
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPricingOpen(!isPricingOpen)
                    }}
                    className="ml-1 p-1 hover:bg-orange-50 rounded transition-colors"
                    animate={{ rotate: isPricingOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg 
                      className="w-3 h-2" 
                      viewBox="0 0 12 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M1 1L6 6L11 1" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.button>
                </div>
                <AnimatePresence>
                  {isPricingOpen && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[1001]"
                    >
                      <div className="py-2">
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('food-partners')}
                          whileHover={{ x: 5 }}
                        >
                          Basic Plan
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('food-partners')}
                          whileHover={{ x: 5 }}
                        >
                          Premium Plan
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('food-partners')}
                          whileHover={{ x: 5 }}
                        >
                          Enterprise
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Dropdown */}
              <div className="relative dropdown-container">
                <div className="flex items-center">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsServicesOpen(!isServicesOpen)
                    }}
                    className={`text-lg font-bold transition-all duration-300 px-4 py-2 rounded-lg ${
                      activeSection === 'services' 
                        ? 'text-[#E46329] bg-orange-50' 
                        : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Services
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsServicesOpen(!isServicesOpen)
                    }}
                    className="ml-1 p-1 hover:bg-orange-50 rounded transition-colors"
                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg 
                      className="w-3 h-2" 
                      viewBox="0 0 12 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M1 1L6 6L11 1" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.button>
                </div>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[1001]"
                    >
                      <div className="py-2">
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('services')}
                          whileHover={{ x: 5 }}
                        >
                          Food Delivery
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('services')}
                          whileHover={{ x: 5 }}
                        >
                          Restaurant Partners
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => scrollToSection('services')}
                          whileHover={{ x: 5 }}
                        >
                          Customer Support
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.img
                src="/search-icon.png"
                className="w-4 h-4 lg:w-5 lg:h-5 cursor-pointer"
                alt="Search"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>

            {/* Right side - Icons and User */}
            <div className="flex items-center space-x-2 sm:space-x-4 dropdown-container">
              <motion.img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png"
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full cursor-pointer"
                alt="Profile"
                whileHover={{ scale: 1.05 }}
              />
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUserOpen(!isUserOpen)
                  }}
                  className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <span className="text-[#272727] text-sm sm:text-base lg:text-lg font-bold mr-2 hidden sm:block">
                    Muhammad Riyan F.
                  </span>
                  <motion.div
                    animate={{ rotate: isUserOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg 
                      className="w-3 h-2" 
                      viewBox="0 0 12 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M1 1L6 6L11 1" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[1001]"
                    >
                      <div className="py-2">
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          Profile
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          Settings
                        </motion.a>
                        <motion.a 
                          href="#" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          Logout
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
