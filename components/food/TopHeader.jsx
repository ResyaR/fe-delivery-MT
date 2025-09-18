"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/authContext'
import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'

export default function TopHeader() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  
  // Refs for dropdown containers
  const pricingRef = useRef(null)
  const servicesRef = useRef(null)
  const userRef = useRef(null)
  
  // State management
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!pricingRef.current?.contains(event.target)) {
        setIsPricingOpen(false)
      }
      if (!servicesRef.current?.contains(event.target)) {
        setIsServicesOpen(false)
      }
      if (!userRef.current?.contains(event.target)) {
        setIsUserOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handlers
  const handleLogout = () => {
    removeToken()
    setUser(null)
    router.push('/signin')
  }

  const scrollToSection = (section) => {
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(section)
    }
  }

  // Toggle handlers with stopPropagation
  const togglePricing = (e) => {
    e.stopPropagation()
    setIsPricingOpen(!isPricingOpen)
    setIsServicesOpen(false)
    setIsUserOpen(false)
  }

  const toggleServices = (e) => {
    e.stopPropagation()
    setIsServicesOpen(!isServicesOpen)
    setIsPricingOpen(false)
    setIsUserOpen(false)
  }

  const toggleUser = (e) => {
    e.stopPropagation()
    setIsUserOpen(!isUserOpen)
    setIsPricingOpen(false)
    setIsServicesOpen(false)
  }

  // Mobile menu animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  // Calculate header height based on scroll state
  const headerHeight = isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'

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
                onClick={() => router.push('/')}
                style={{ cursor: 'pointer' }}
              />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg hover:bg-orange-50"
              onClick={() => setIsMobileMenuOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>

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
              <div ref={pricingRef} className="relative">
                <div className="flex items-center">
                  <motion.button
                    onClick={togglePricing}
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
                    onClick={togglePricing}
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
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            scrollToSection('food-partners')
                            setIsPricingOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Basic Plan
                        </motion.button>
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            scrollToSection('food-partners')
                            setIsPricingOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Premium Plan
                        </motion.button>
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            scrollToSection('food-partners')
                            setIsPricingOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Enterprise
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Services Dropdown */}
              <div ref={servicesRef} className="relative">
                <div className="flex items-center">
                  <motion.button
                    onClick={toggleServices}
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
                    onClick={toggleServices}
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
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            router.push('/food')
                            setIsServicesOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Food Delivery
                        </motion.button>
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            router.push('/restaurants')
                            setIsServicesOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Restaurant Partners
                        </motion.button>
                        <motion.button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            router.push('/support')
                            setIsServicesOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Customer Support
                        </motion.button>
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
            <div ref={userRef} className="flex items-center space-x-2 sm:space-x-4">
              <motion.img
                src={user?.avatar || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png"}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-full cursor-pointer"
                alt="Profile"
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/profile')}
              />
              <div className="relative">
                <motion.button
                  onClick={toggleUser}
                  className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <span className="text-[#272727] text-sm sm:text-base lg:text-lg font-bold mr-2 hidden sm:block">
                    {user?.name || user?.email || 'Profile'}
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
                        <motion.button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            router.push('/profile')
                            setIsUserOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Profile
                        </motion.button>
                        <motion.button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            router.push('/settings')
                            setIsUserOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Settings
                        </motion.button>
                        <motion.button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                          onClick={() => {
                            handleLogout()
                            setIsUserOpen(false)
                          }}
                          whileHover={{ x: 5 }}
                        >
                          Logout
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 z-[1001] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Sidebar */}
              <motion.div
                className="fixed top-0 right-0 w-[280px] h-full bg-white z-[1002] md:hidden"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-lg font-bold">Menu</span>
                  <motion.button
                    className="p-2 rounded-lg hover:bg-orange-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Sidebar Content */}
                <div className="p-4 space-y-4">
                  <button
                    onClick={() => {
                      scrollToSection('home')
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === 'home' 
                        ? 'text-[#E46329] bg-orange-50' 
                        : 'text-[#272727] hover:text-[#E46329] hover:bg-orange-50'
                    }`}
                  >
                    Home
                  </button>

                  {/* Services Section */}
                  <div>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-orange-50"
                    >
                      <span>Services</span>
                      <motion.div
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
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="py-2 pl-8 space-y-2">
                            <button
                              onClick={() => {
                                router.push('/food')
                                setIsMobileMenuOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                            >
                              Food Delivery
                            </button>
                            <button
                              onClick={() => {
                                router.push('/restaurants')
                                setIsMobileMenuOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                            >
                              Restaurant Partners
                            </button>
                            <button
                              onClick={() => {
                                router.push('/support')
                                setIsMobileMenuOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                            >
                              Customer Support
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Profile Section */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4">
                      <img
                        src={user?.avatar || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png"}
                        className="w-10 h-10 rounded-full"
                        alt="Profile"
                      />
                      <div>
                        <p className="font-bold text-sm">{user?.name || user?.email || 'Profile'}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => {
                          router.push('/profile')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push('/settings')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#E46329] rounded-lg hover:bg-orange-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}