import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';

// Default avatar SVG as base64
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjZTVlN2U5Ii8+PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5Y2EzYWYiPjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz48L3N2Zz4=';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsUserOpen(false);
  };

  const handleDeliveriesClick = () => {
    router.push('/deliveries');
    setIsUserOpen(false);
  };

  const handleOrdersClick = () => {
    router.push('/orders');
    setIsUserOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isUserOpen) return;
    
    const handleClickOutside = (event) => {
      const profileButton = buttonRef.current;
      const profileDropdown = document.querySelector('[data-profile-dropdown]');
      
      if (profileButton && !profileButton.contains(event.target) && 
          profileDropdown && !profileDropdown.contains(event.target)) {
        setIsUserOpen(false);
      }
    };

    // Use setTimeout to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserOpen]);

  if (!user) return null;

  // Check if avatar is valid (not undefined, null, or contains "undefined")
  const getAvatarSrc = () => {
    if (!user.avatar || user.avatar === 'undefined' || user.avatar.includes('undefined')) {
      return DEFAULT_AVATAR;
    }
    return user.avatar;
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4" ref={dropdownRef} style={{ overflow: 'visible', position: 'relative' }}>
      <img
        src={getAvatarSrc()}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
        alt="Profile"
        onError={(e) => {
          // Fallback to default if image fails to load
          e.target.src = DEFAULT_AVATAR;
        }}
      />
      <div className="relative" style={{ overflow: 'visible' }}>
        <div 
          ref={buttonRef}
          data-profile-button
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setIsUserOpen(!isUserOpen);
          }}
        >
          <span className="text-[#272727] text-sm sm:text-base font-medium mr-2 hidden sm:block max-w-[150px] truncate">
            {user.fullName || user.email}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isUserOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {typeof window !== 'undefined' && isUserOpen && buttonRef.current && createPortal(
          <div 
            data-profile-dropdown
            className="fixed w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] overflow-hidden"
            style={{ 
              pointerEvents: 'auto',
              position: 'fixed',
              zIndex: 60,
              top: buttonRef.current.getBoundingClientRect().bottom + 8,
              right: window.innerWidth - buttonRef.current.getBoundingClientRect().right
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={getAvatarSrc()}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Profile"
                    onError={(e) => {
                      // Fallback to default if image fails to load
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.fullName || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="py-1">
                <button 
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>

                <button 
                  onClick={handleOrdersClick}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <span className="material-symbols-outlined text-base">restaurant</span>
                  <span>Pesanan Makanan</span>
                </button>

                <button 
                  onClick={handleDeliveriesClick}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <span className="material-symbols-outlined text-base">local_shipping</span>
                  <span>Riwayat Pengiriman</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3 border-t border-gray-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
