"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import UserMenu from '../main/UserMenu';

export default function MTTransHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Menu services yang tersedia
  const servicesMenu = [
    {
      id: 'food',
      label: 'Food',
      icon: 'restaurant',
      route: '/food',
      description: 'Pesan makanan & minuman'
    },
    {
      id: 'cek-ongkir',
      label: 'Cek Ongkir',
      icon: 'attach_money',
      route: '/cek-ongkir?tab=cek-ongkir',
      description: 'Hitung biaya pengiriman'
    },
    {
      id: 'lacak',
      label: 'Cek Resi / Lacak',
      icon: 'search',
      route: '/cek-ongkir?tab=lacak',
      description: 'Lacak pengiriman Anda'
    },
    {
      id: 'kirim-barang',
      label: 'Kirim Barang',
      icon: 'local_shipping',
      route: '/cek-ongkir?tab=cek-ongkir&type=kirim-barang',
      description: 'Kirim paket cepat'
    },
    {
      id: 'jadwal',
      label: 'Jadwal Pengiriman',
      icon: 'schedule',
      route: '/cek-ongkir?tab=jadwal',
      description: 'Jadwalkan pengiriman'
    },
    {
      id: 'multi-drop',
      label: 'Multi Drop',
      icon: 'place',
      route: '/cek-ongkir?tab=multi-drop',
      description: 'Kirim ke beberapa lokasi'
    },
    {
      id: 'ekspedisi',
      label: 'Paket Besar / Ekspedisi Lokal',
      icon: 'inventory',
      route: '/cek-ongkir?tab=ekspedisi',
      description: 'Pengiriman paket besar'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setIsServicesDropdownOpen(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen]);

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  const handleServiceItemClick = (route) => {
    setIsServicesDropdownOpen(false);
    setIsMenuOpen(false);
    router.push(route);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#E00000] focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>
      
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
          <button 
            className="text-[#E00000] font-bold hover:underline"
            onClick={() => router.push('/')}
          >
            Home
          </button>
          <button 
            className="hover:text-[#E00000] transition-colors cursor-pointer"
            onClick={() => router.push('/food')}
          >
            Food
          </button>
          <div className="relative" ref={servicesDropdownRef}>
            <button 
              className="hover:text-[#E00000] transition-colors cursor-pointer flex items-center gap-1"
              onClick={handleServicesClick}
            >
              Services
              <span className="material-symbols-outlined text-sm">
                {isServicesDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {isServicesDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                {servicesMenu.map((service) => (
                  <div
                    key={service.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleServiceItemClick(service.route)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#E00000] text-xl">
                        {service.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{service.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{service.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center gap-4">
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
              aria-label="Sign in to your account"
            >
              <span className="truncate">Sign In</span>
            </button>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <button 
              className="w-full text-left py-3 text-[#E00000] font-bold border-b border-gray-100"
              onClick={() => {
                router.push('/');
                setIsMenuOpen(false);
              }}
            >
              Home
            </button>
            <button 
              onClick={() => {
                router.push('/food');
                setIsMenuOpen(false);
              }}
              className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors border-b border-gray-100 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">restaurant</span>
              <span>Order Food</span>
            </button>
            <div>
              <button 
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors border-b border-gray-100 flex items-center justify-between"
              >
                <span>Services</span>
                <span className="material-symbols-outlined text-sm">
                  {isServicesDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {isServicesDropdownOpen && (
                <div className="pl-4 pb-2 space-y-1">
                  {servicesMenu.map((service) => (
                    <div
                      key={service.id}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-[#E00000] cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        handleServiceItemClick(service.route);
                      }}
                    >
                      <span className="material-symbols-outlined text-base">
                        {service.icon}
                      </span>
                      <span>{service.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {user && (
              <button 
                onClick={() => {
                  router.push('/orders');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors border-b border-gray-100 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                <span>My Orders</span>
              </button>
            )}
            <button 
              onClick={() => {
                handleCartClick();
                setIsMenuOpen(false);
              }}
              className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="ml-auto bg-[#E00000] text-white text-xs font-bold rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}