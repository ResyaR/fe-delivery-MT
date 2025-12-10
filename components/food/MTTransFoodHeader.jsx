"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import UserMenu from '../main/UserMenu';
import SearchBar from './SearchBar';

export default function MTTransFoodHeader({ cartIconRef }) {
  const router = useRouter();
  const pathname = usePathname();
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
    
    // Jika sudah di halaman food, langsung scroll ke promo
    if (pathname === '/food') {
    const promoSection = document.getElementById('food-promo');
    if (promoSection) {
      promoSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Jika di halaman lain, redirect ke food dengan hash untuk scroll ke promo
      router.push('/food#promo');
    }
  };

  // Handle scroll ke promo setelah redirect dari halaman lain
  useEffect(() => {
    if (pathname === '/food' && window.location.hash === '#promo') {
      // Delay sedikit untuk memastikan halaman sudah ter-render
      setTimeout(() => {
        const promoSection = document.getElementById('food-promo');
        if (promoSection) {
          promoSection.scrollIntoView({ behavior: 'smooth' });
          // Hapus hash dari URL setelah scroll
          window.history.replaceState(null, '', '/food');
        }
      }, 300);
    }
  }, [pathname]);

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
          <a 
            className={`${pathname === '/' ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`} 
            onClick={() => router.push('/')}
          >
            Home
          </a>
          <a 
            className={`${pathname === '/food/all' || pathname.startsWith('/food/restaurants') ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`} 
            onClick={() => router.push('/food/all')}
          >
            Restaurants
          </a>
          {user && (
            <a 
              className={`${pathname === '/orders' ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`} 
              onClick={() => router.push('/orders')}
            >
              History
            </a>
          )}
          <a 
            className={`${pathname === '/food' && !pathname.startsWith('/food/') ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`} 
            onClick={scrollToPromo}
          >
            Promo
          </a>
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
          <motion.button 
            className="md:hidden min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.svg 
              className="w-5 h-5 sm:w-6 sm:h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={isMenuOpen ? {
                pathLength: 1,
              } : {
                pathLength: 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.svg>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          <SearchBar className="w-full" />
        </div>
      )}
      
      {/* Mobile menu */}
      <AnimatePresence>
      {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div 
              className="px-4 py-3 space-y-1"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
            {/* Profile Section - Di atas sendiri dengan dropdown */}
            {user ? (
              <motion.div 
                className="pb-3 mb-3 border-b border-gray-200" 
                ref={profileDropdownRef}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
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
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div 
                      className="pl-4 pb-2 space-y-1"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <motion.button 
                        onClick={() => {
                          router.push('/profile');
                          setIsMenuOpen(false);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="material-symbols-outlined text-base">person</span>
                        <span>Profile</span>
                      </motion.button>
                      <motion.button 
                        onClick={() => {
                          router.push('/orders');
                          setIsMenuOpen(false);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="material-symbols-outlined text-base">restaurant</span>
                        <span>Pesanan Makanan</span>
                      </motion.button>
                      <motion.button 
                        onClick={() => {
                          router.push('/deliveries');
                          setIsMenuOpen(false);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left py-2 text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="material-symbols-outlined text-base">local_shipping</span>
                        <span>Riwayat Pengiriman</span>
                      </motion.button>
                      <motion.button 
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
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                className="pb-3 mb-3 border-b border-gray-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <motion.button 
                  onClick={() => {
                    handleSignInClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-[#E00000] transition-colors flex items-center gap-2"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  <span>Sign In</span>
                </motion.button>
              </motion.div>
            )}
            
            {/* Menu Navigation */}
            <motion.a 
              className={`block py-2 flex items-center gap-2 cursor-pointer ${pathname === '/' ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} transition-colors`}
              onClick={() => router.push('/')}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Home</span>
            </motion.a>
            <motion.a 
              className={`block py-2 flex items-center gap-2 cursor-pointer ${pathname === '/food/all' || pathname.startsWith('/food/restaurants') ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} transition-colors`}
              onClick={() => router.push('/food/all')}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">restaurant</span>
              <span>Restaurants</span>
            </motion.a>
            <motion.a 
              className={`block py-2 flex items-center gap-2 cursor-pointer ${pathname === '/food' && !pathname.startsWith('/food/') ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} transition-colors`}
              onClick={scrollToPromo}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">local_offer</span>
              <span>Promo</span>
            </motion.a>
            <motion.a 
              className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer flex items-center gap-2" 
              onClick={handleCartClick}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="ml-auto bg-[#E00000] text-white text-xs font-bold rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
