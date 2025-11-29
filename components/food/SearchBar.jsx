"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import RestaurantAPI from '@/lib/restaurantApi';
import { addressAPI } from '@/lib/addressApi';

export default function SearchBar({ onSearch, className = "" }) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userCity, setUserCity] = useState(null);
  const searchRef = useRef(null);

  // Detect user location from default address
  useEffect(() => {
    const detectUserLocation = async () => {
      if (!user) return;

      try {
        const addresses = await addressAPI.getAll();
        const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
        
        if (defaultAddress && defaultAddress.city) {
          setUserCity(defaultAddress.city);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    };

    detectUserLocation();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      // Get restaurants filtered by city first, then filter by search query
      const data = await RestaurantAPI.getAllRestaurants(userCity || undefined);
      
      // Filter restaurants by name or category
      const filtered = data.filter(restaurant => 
        restaurant.name?.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.category?.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered.slice(0, 5)); // Show top 5 results
      setShowResults(true);
      
      if (onSearch) {
        onSearch(filtered);
      }
    } catch (error) {
      console.error('Error searching restaurants:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (restaurantId) => {
    router.push(`/food/restaurants/${restaurantId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleViewAll = () => {
    router.push(`/food/all?search=${encodeURIComponent(searchQuery)}`);
    setShowResults(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/food/all?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="Cari restaurant atau menu..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:border-transparent"
          aria-label="Search restaurants"
        />
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#E00000]"></div>
          </div>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="py-2">
            {searchResults.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleResultClick(restaurant.id)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
              >
                <img
                  src={restaurant.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3E%3F%3C/text%3E%3C/svg%3E'}
                  alt={restaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3E%3F%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                  <p className="text-sm text-gray-500">{restaurant.category}</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">arrow_forward</span>
              </div>
            ))}
          </div>
          
          {searchResults.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-[#E00000] font-semibold hover:underline"
              >
                Lihat semua hasil ({searchResults.length}+)
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
          <p className="text-gray-600 mt-2">Tidak ada hasil untuk "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

