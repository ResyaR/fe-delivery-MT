"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/lib/authContext";
import UserMenu from '../main/UserMenu';

export default function MTTransCekOngkirHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
          <img 
            src="/logo.png" 
            alt="MT Trans Logo" 
            className="h-10 w-10 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black">MT TRANS</h1>
            <span className="text-xs text-black font-medium">YOUR BEST DELIVERY</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center justify-center gap-16 font-medium text-gray-700 flex-1">
          <a className="text-[#E00000] font-bold" href="/">Home</a>
          <a className="hover:text-[#E00000] transition-colors" href="#">Pricing</a>
          <a className="hover:text-[#E00000] transition-colors" href="#">Services</a>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <button 
              onClick={handleSignInClick}
              className="flex min-w-[90px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#E00000] text-white text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors"
            >
              <span className="truncate">Sign In</span>
            </button>
          )}
          
          {/* Mobile menu button */}
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <a className="block py-2 text-[#E00000] font-bold" href="/">Home</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors" href="#">Pricing</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors" href="#">Services</a>
          </div>
        </div>
      )}
    </header>
  );
}
