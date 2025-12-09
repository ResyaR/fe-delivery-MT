"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import UserMenu from '../main/UserMenu';
import SearchBar from './SearchBar';

export default function MTTransFoodHeader({ cartIconRef }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Memoize totalItems untuk prevent recalculation dan flickering
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const scrollToPromo = (e) => {
    e.preventDefault();
    const promoSection = document.getElementById('food-promo');
    if (promoSection) {
      promoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-shrink-0" onClick={handleLogoClick}>
          <img 
            src="/logo.png" 
            alt="MT Trans Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-black leading-tight">MT TRANS</h1>
            <span className="text-[10px] sm:text-xs text-black font-medium leading-tight">YOUR BEST DELIVERY</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-sm lg:text-base font-medium flex-1 px-4 lg:px-8" role="navigation" aria-label="Navigasi utama">
          <a className="text-[#E00000] font-bold focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1" href="/food" aria-current="page">Home</a>
          <a className="hover:text-[#E00000] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1" onClick={() => router.push('/food/all')}>Restaurants</a>
          {user && (
            <a className="hover:text-[#E00000] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1" onClick={() => router.push('/orders')}>My Orders</a>
          )}
          <a className="hover:text-[#E00000] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1" onClick={scrollToPromo}>Promo</a>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-2 lg:mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Search Icon (Mobile) */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden min-w-[44px] min-h-[44px] p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000]"
            aria-label="Cari"
            aria-expanded={showMobileSearch}
          >
            <span className="material-symbols-outlined text-gray-700">search</span>
          </button>
          {/* Cart Icon */}
          <button 
            ref={cartIconRef}
            data-cart-icon
            onClick={handleCartClick}
            className="relative min-w-[44px] min-h-[44px] p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000]"
            aria-label={`Keranjang belanja dengan ${totalItems} item`}
          >
            <span className="material-symbols-outlined text-gray-700">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E00000] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden md:block">
              <UserMenu />
            </div>
          ) : (
            <button 
              onClick={handleSignInClick}
              className="hidden md:flex min-w-[90px] min-h-[44px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#E00000] text-white text-sm font-semibold leading-normal tracking-[0.015em] hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2"
              aria-label="Masuk ke akun Anda"
            >
              <span className="truncate">Sign In</span>
            </button>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden min-w-[44px] min-h-[44px] p-2 focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          <SearchBar className="w-full" />
        </div>
      )}
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {/* Profile Section - Di atas sendiri dengan dropdown */}
            {user ? (
              <div className="pb-3 mb-3 border-b border-gray-200" ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={(!user.avatar || user.avatar === 'undefined' || user.avatar.includes('undefined')) 
                        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjZTVlN2U5Ii8+PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5Y2EzYWYiPjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz48L3N2Zz4=' 
                        : user.avatar}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      alt="Profile"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName || user.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm">
                    {isProfileDropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="pl-4 pb-2 space-y-1">
                    <button 
                      onClick={() => {
                        router.push('/profile');
                        setIsMenuOpen(false);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/orders');
                        setIsMenuOpen(false);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">restaurant</span>
                      <span>Pesanan Makanan</span>
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/deliveries');
                        setIsMenuOpen(false);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">local_shipping</span>
                      <span>Riwayat Pengiriman</span>
                    </button>
                    <button 
                      onClick={async () => {
                        try {
                          await logout();
                          setIsMenuOpen(false);
                          setIsProfileDropdownOpen(false);
                          router.push('/food');
                        } catch (error) {
                          console.error('Logout failed:', error);
                          setIsMenuOpen(false);
                          setIsProfileDropdownOpen(false);
                        }
                      }}
                      className="w-full text-left py-2 text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="pb-3 mb-3 border-b border-gray-200">
                <button 
                  onClick={() => {
                    handleSignInClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-[#E00000] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  <span>Sign In</span>
                </button>
              </div>
            )}
            
            {/* Menu Navigation */}
            <a className="block py-2 text-[#E00000] font-bold flex items-center gap-2" href="/food">
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Home</span>
            </a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={() => router.push('/food/all')}>Restaurants</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={scrollToPromo}>Promo</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer flex items-center gap-2" onClick={handleCartClick}>
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="ml-auto bg-[#E00000] text-white text-xs font-bold rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
