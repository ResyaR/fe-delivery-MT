"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import UserMenu from '../main/UserMenu';

export default function MTTransHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isServicesDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen, isProfileDropdownOpen]);

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
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={handleLogoClick}>
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
        
        <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 xl:gap-16 font-medium text-gray-700 flex-1 px-4 lg:px-8" role="navigation" aria-label="Navigasi utama">
          <button 
            className={`${pathname === '/' ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`}
            onClick={() => router.push('/')}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Home
          </button>
          <button 
            className={`${pathname?.startsWith('/food') ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`}
            onClick={() => router.push('/food')}
            aria-current={pathname?.startsWith('/food') ? 'page' : undefined}
          >
            Food
          </button>
          <button 
            className={`${pathname === '/pricing' ? 'text-[#E00000] font-bold' : 'hover:text-[#E00000]'} transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1`}
            onClick={() => router.push('/pricing')}
            aria-current={pathname === '/pricing' ? 'page' : undefined}
          >
            Pricing
          </button>
          <div className="relative" ref={servicesDropdownRef}>
            <button 
              className="hover:text-[#E00000] transition-colors cursor-pointer flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#E00000] rounded px-2 py-1"
              onClick={handleServicesClick}
              aria-expanded={isServicesDropdownOpen}
              aria-haspopup="true"
              aria-label="Menu layanan"
            >
              Services
              <span className="material-symbols-outlined text-sm">
                {isServicesDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            
            {isServicesDropdownOpen && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 py-4 px-3 z-50">
                <div className="flex items-center justify-center gap-2">
                  {servicesMenu.map((service) => (
                    <div
                      key={service.id}
                      className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg border border-transparent hover:border-gray-200 min-w-[140px]"
                      onClick={() => handleServiceItemClick(service.route)}
                    >
                      <div className="flex flex-col items-center text-center gap-1.5">
                        <span className="material-symbols-outlined text-[#E00000] text-xl">
                          {service.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-xs leading-tight">{service.label}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-2">{service.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Cart Icon */}
          <button 
            onClick={handleCartClick}
            className="relative min-w-[44px] min-h-[44px] p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000]"
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
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
                          router.push('/');
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
            <button 
              className={`w-full text-left py-3 ${pathname === '/' ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} border-b border-gray-100 flex items-center gap-2`}
              onClick={() => {
                router.push('/');
                setIsMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined text-lg">home</span>
              <span>Home</span>
            </button>
            <button 
              onClick={() => {
                router.push('/food');
                setIsMenuOpen(false);
              }}
              className={`w-full text-left py-3 ${pathname?.startsWith('/food') ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} transition-colors border-b border-gray-100 flex items-center gap-2`}
            >
              <span className="material-symbols-outlined text-lg">restaurant</span>
              <span>Order Food</span>
            </button>
            <button 
              onClick={() => {
                router.push('/pricing');
                setIsMenuOpen(false);
              }}
              className={`w-full text-left py-3 ${pathname === '/pricing' ? 'text-[#E00000] font-bold' : 'text-gray-700 hover:text-[#E00000]'} transition-colors border-b border-gray-100 flex items-center gap-2`}
            >
              <span className="material-symbols-outlined text-lg">payments</span>
              <span>Pricing</span>
            </button>
            <div>
              <button 
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="w-full text-left py-3 text-gray-700 hover:text-[#E00000] transition-colors border-b border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">apps</span>
                  <span>Services</span>
                </div>
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