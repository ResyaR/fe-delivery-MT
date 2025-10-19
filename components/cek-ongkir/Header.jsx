"use client"

import { useAuth } from '@/lib/authContext'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { removeToken } from '@/lib/auth'

export default function Header() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const [isUserOpen, setIsUserOpen] = useState(false)
  const userRef = useRef(null)

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  const toggleUser = (e) => {
    e.stopPropagation()
    setIsUserOpen(!isUserOpen)
  }

  return (
    <div className="flex flex-col items-center relative mb-[72px]">
      <img
        src="/logo.png"
        className="w-[194px] h-[155px] object-contain relative z-10 cursor-pointer"
        alt="MT Trans Logo"
        onClick={() => router.push('/')}
      />
      <div className="flex flex-col items-start bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/au8nqyjp_expires_30_days.png')] bg-cover bg-center w-[1448px] absolute top-0 left-0 z-0">
        <div className="flex items-start mt-[37px] ml-[528px]">
          <span 
            className="text-[#E46329] text-xl font-bold mr-[77px] cursor-pointer hover:opacity-80"
            onClick={() => router.push('/')}
          >
            Home
          </span>
          <div className="flex shrink-0 items-center mt-[1px] mr-[58px] gap-[18px]">
            <span className="text-[#272727] text-xl font-bold">
              Pricing
            </span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/b4dx9lxg_expires_30_days.png"
              className="w-[11px] h-[5px] object-fill"
              alt="Arrow"
            />
          </div>
          <span className="text-[#272727] text-xl font-bold mr-[25px]">
            Services
          </span>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/ctuhlad1_expires_30_days.png"
            className="w-[11px] h-[5px] mt-3.5 mr-[49px] object-fill"
            alt="Arrow"
          />
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/pt86q9db_expires_30_days.png"
            className="w-[26px] h-7 mt-1 mr-[126px] object-fill cursor-pointer"
            alt="Search"
          />
          {/* User Profile Section */}
          <div ref={userRef} className="relative flex items-center">
            <img
              src={user?.avatar || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png"}
              className="w-12 h-12 rounded-full mr-3 cursor-pointer"
              alt="Profile"
              onClick={() => router.push('/profile')}
            />
            <div className="flex items-center cursor-pointer" onClick={toggleUser}>
              <span className="text-[#272727] text-xl font-bold mx-[9px]">
                {user?.name || user?.email || 'Profile'}
              </span>
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/ugddeafc_expires_30_days.png"
                className={`w-[11px] h-[5px] mt-1 object-fill transition-transform duration-200 ${isUserOpen ? 'rotate-180' : ''}`}
                alt="Arrow"
              />
            </div>
            
            {/* User Dropdown */}
            {isUserOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[1001]">
                <div className="py-2">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                    onClick={() => {
                      router.push('/profile')
                      setIsUserOpen(false)
                    }}
                  >
                    Profile
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                    onClick={() => {
                      router.push('/settings')
                      setIsUserOpen(false)
                    }}
                  >
                    Settings
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E46329] transition-colors"
                    onClick={() => {
                      handleLogout()
                      setIsUserOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
