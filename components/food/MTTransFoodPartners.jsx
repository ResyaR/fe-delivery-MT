"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RestaurantAPI from '@/lib/restaurantApi';

export default function MTTransFoodPartners() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await RestaurantAPI.getAllRestaurants();
      setRestaurants(data.slice(0, 6)); // Show top 6
    } catch (error) {
      console.error('Error loading restaurants:', error);
      // Fallback to empty array
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h2 className="text-4xl font-bold">Food Partners</h2>
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
                  src={restaurant.image || '/restaurant-placeholder.jpg'}
                  alt={restaurant.name}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/restaurant-placeholder.jpg';
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
            <p className="text-gray-500 mt-2">Belum ada restaurant yang tersedia saat ini</p>
          </div>
        )}
      </div>
    </section>
  );
}
