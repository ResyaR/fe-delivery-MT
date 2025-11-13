"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import UserMenu from '../main/UserMenu';
import SearchBar from './SearchBar';

export default function MTTransFoodHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
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
        
        <nav className="hidden lg:flex items-center justify-center gap-8 text-base font-medium flex-1">
          <a className="text-[#E00000] font-bold" href="/food">Home</a>
          <a className="hover:text-[#E00000] transition-colors cursor-pointer" onClick={() => router.push('/food/all')}>Restaurants</a>
          {user && (
            <a className="hover:text-[#E00000] transition-colors cursor-pointer" onClick={() => router.push('/orders')}>My Orders</a>
          )}
          <a className="hover:text-[#E00000] transition-colors cursor-pointer" onClick={scrollToPromo}>Promo</a>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Icon (Mobile) */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-gray-700">search</span>
          </button>
          {/* Cart Icon */}
          <button 
            onClick={handleCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <span className="material-symbols-outlined text-gray-700">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E00000] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

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
      
      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          <SearchBar className="w-full" />
        </div>
      )}
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-3 space-y-1">
            <a className="block py-2 text-[#E00000] font-bold" href="/food">Home</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={() => router.push('/food/all')}>Restaurants</a>
            {user && (
              <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={() => router.push('/orders')}>My Orders</a>
            )}
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={scrollToPromo}>Promo</a>
            <a className="block py-2 text-gray-700 hover:text-[#E00000] transition-colors cursor-pointer" onClick={handleCartClick}>
              Cart {totalItems > 0 && `(${totalItems})`}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
