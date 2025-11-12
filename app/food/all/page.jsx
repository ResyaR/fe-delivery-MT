"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import RestaurantAPI from "@/lib/restaurantApi";
import MTTransFoodHeader from "../../../components/food/MTTransFoodHeader";
import MTTransFoodFooter from "../../../components/food/MTTransFoodFooter";

export default function AllFoodPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ["Semua", "Mie Ayam", "Minuman", "Bakso", "Korea", "Es Krim"];

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    // Get category and search from URL parameters
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      filterBySearch(searchParam);
      setSelectedCategory(null);
    } else if (categoryParam) {
      setSelectedCategory(categoryParam);
      filterByCategory(categoryParam);
      setSearchQuery('');
    } else {
      setSelectedCategory("Semua");
      setFilteredRestaurants(restaurants);
      setSearchQuery('');
    }
  }, [searchParams, restaurants]);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const data = await RestaurantAPI.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = (category) => {
    if (category === "Semua" || !category) {
      setFilteredRestaurants(restaurants);
    } else {
      // Simple filter based on category name match
      const filtered = restaurants.filter(restaurant => 
        restaurant.category?.toLowerCase().includes(category.toLowerCase()) ||
        restaurant.name?.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  };

  const filterBySearch = (query) => {
    if (!query) {
      setFilteredRestaurants(restaurants);
      return;
    }
    
    const filtered = restaurants.filter(restaurant => 
      restaurant.name?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.category?.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === "Semua") {
      router.push('/food/all');
      setFilteredRestaurants(restaurants);
    } else {
      router.push(`/food/all?category=${encodeURIComponent(category)}`);
      filterByCategory(category);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    router.push(`/food/restaurants/${restaurantId}`);
  };

  return (
    <div className="relative w-full bg-white text-[#1a1a1a]">
      <MTTransFoodHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {searchQuery ? (
                `Hasil Pencarian "${searchQuery}"`
              ) : selectedCategory && selectedCategory !== "Semua" ? (
                selectedCategory
              ) : (
                "Semua Restaurant"
              )}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {searchQuery ? (
                `Menampilkan ${filteredRestaurants.length} restaurant`
              ) : (
                "Temukan berbagai pilihan restaurant dengan menu lezat"
              )}
            </p>
          </div>
        </section>

        {/* Category Filter - Hide if searching */}
        {!searchQuery && (
          <section className="py-8 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-[#E00000] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search Results Info */}
        {searchQuery && (
          <section className="py-4 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Menampilkan hasil pencarian untuk <span className="font-semibold">"{searchQuery}"</span>
                </p>
                <button
                  onClick={() => router.push('/food/all')}
                  className="text-[#E00000] font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Hapus Filter
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Restaurants Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {filteredRestaurants.length} Restaurant Ditemukan
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E00000] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading restaurants...</p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                    key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                    onClick={() => handleRestaurantClick(restaurant.id)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative">
                        <img
                        src={restaurant.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="192"%3E%3Crect width="400" height="192" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="32"%3E%3F%3C/text%3E%3C/svg%3E'}
                        alt={restaurant.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="192"%3E%3Crect width="400" height="192" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="32"%3E%3F%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        <span className="text-sm font-semibold text-gray-700">{restaurant.rating}</span>
                      </div>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-semibold text-gray-700">{restaurant.category}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-gray-500 text-sm">restaurant</span>
                        <span className="text-sm text-gray-600">{restaurant.totalOrders || 0} pesanan</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {restaurant.openingTime && restaurant.closingTime 
                            ? `${restaurant.openingTime} - ${restaurant.closingTime}`
                            : 'Buka sekarang'
                          }
                        </span>
                        <span className="material-symbols-outlined text-[#E00000]">arrow_forward</span>
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            ) : (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-8xl text-gray-300">
                  {searchQuery ? 'search_off' : 'restaurant'}
                </span>
                <h3 className="text-2xl font-bold text-gray-700 mt-4">
                  {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada restaurant ditemukan'}
                </h3>
                <p className="text-gray-500 mt-2 mb-6">
                  {searchQuery ? 'Coba kata kunci lain atau lihat semua restaurant' : 'Coba ubah filter atau cari di kategori lain'}
                </p>
                <button
                  onClick={() => {
                    if (searchQuery) {
                      router.push('/food/all');
                    } else {
                      handleCategoryClick("Semua");
                    }
                  }}
                  className="px-6 py-3 bg-[#E00000] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Lihat Semua Restaurant
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#E00000] py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tidak Menemukan yang Anda Cari?
            </h2>
            <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
              Hubungi kami untuk request makanan atau minuman khusus yang Anda inginkan
            </p>
            <button className="bg-white text-[#E00000] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Request Makanan
            </button>
          </div>
        </section>
      </main>

      <MTTransFoodFooter />
    </div>
  );
}
