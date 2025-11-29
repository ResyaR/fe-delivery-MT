"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import RestaurantAPI from '@/lib/restaurantApi';
import { addressAPI } from '@/lib/addressApi';

export default function MTTransFoodPartners() {
  const router = useRouter();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCity, setUserCity] = useState(null);
  const hasLoadedRef = useRef(false);
  const isDetectingRef = useRef(false);

  // Detect user location and load restaurants in one effect
  useEffect(() => {
    // Prevent multiple calls
    if (hasLoadedRef.current || isDetectingRef.current) return;
    
    const detectAndLoad = async () => {
      isDetectingRef.current = true;
      let city = null;

      if (user) {
        try {
          const addresses = await addressAPI.getAll();
          const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
          
          if (defaultAddress && defaultAddress.city) {
            city = defaultAddress.city;
          }
        } catch (error) {
          console.error('Error detecting location:', error);
        }
      }

      // Set city and load restaurants
      setUserCity(city);
      
      try {
        setIsLoading(true);
        const data = await RestaurantAPI.getAllRestaurants(city || undefined);
        setRestaurants(data.slice(0, 6)); // Show top 6
      } catch (error) {
        console.error('Error loading restaurants:', error);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
        hasLoadedRef.current = true;
        isDetectingRef.current = false;
      }
    };

    detectAndLoad();
  }, [user]);

  const handleSeeAll = () => {
    router.push('/food/all');
  };
  
  const handleRestaurantClick = (restaurantId) => {
    router.push(`/food/restaurants/${restaurantId}`);
  };

  const isRestaurantOpen = (restaurant) => {
    // Simple check: consider open between 8 AM - 10 PM
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour < 22;
  };

  return (
    <section id="food-partners">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-2">Food Partners</h2>
          {userCity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="material-symbols-outlined text-[#E00000] text-base">location_on</span>
              <span>
                Menampilkan restaurant di <span className="font-semibold text-[#E00000]">{userCity}</span>
              </span>
            </div>
          )}
        </div>
        <button 
          onClick={handleSeeAll}
          className="text-[#E00000] font-semibold hover:underline flex items-center gap-2 transition-colors"
        >
          See All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : restaurants.length > 0 ? (
          restaurants.map((restaurant) => {
            const isOpen = isRestaurantOpen(restaurant);
            return (
              <div 
                key={restaurant.id} 
                onClick={() => handleRestaurantClick(restaurant.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              >
                <img
                  src={restaurant.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="224"%3E%3Crect width="400" height="224" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="48"%3E%3F%3C/text%3E%3C/svg%3E'}
                  alt={restaurant.name}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="224"%3E%3Crect width="400" height="224" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="48"%3E%3F%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                      <span className="font-semibold text-sm">{restaurant.rating || '4.5'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      30-45 min
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">payments</span>
                      Rp 15k-30k
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {isOpen ? '🟢 Buka' : '🔴 Tutup'}
                    </span>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#E00000] transition-colors">arrow_forward</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-16">
            <span className="material-symbols-outlined text-8xl text-gray-300">restaurant</span>
            <h3 className="text-2xl font-bold text-gray-700 mt-4">Tidak ada restaurant</h3>
            <p className="text-gray-500 mt-2">
              {userCity 
                ? `Belum ada restaurant yang tersedia di ${userCity} saat ini` 
                : 'Belum ada restaurant yang tersedia saat ini'}
            </p>
            {userCity && (
              <button
                onClick={async () => {
                  setUserCity(null);
                  const data = await RestaurantAPI.getAllRestaurants();
                  setRestaurants(data.slice(0, 6));
                }}
                className="mt-4 px-6 py-2 bg-[#E00000] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Lihat Semua Restaurant
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
