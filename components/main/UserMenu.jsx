import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [isUserOpen, setIsUserOpen] = useState(false);

  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <img
        src={
          "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png" ||
          "/placeholder.svg"
        }
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full cursor-pointer"
        alt="Profile"
      />
      <div className="relative">
        <div 
          className="flex items-center cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => setIsUserOpen(!isUserOpen)}
        >
          <span className="text-[#272727] text-sm sm:text-base lg:text-lg font-bold mr-2 hidden sm:block">{user.email}</span>
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/4oadv3tz_expires_30_days.png" ||
              "/placeholder.svg"
            }
            className="w-3 h-2"
            alt="Dropdown"
          />
        </div>
        {isUserOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="py-2">
              <button 
                onClick={() => router.push('/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
