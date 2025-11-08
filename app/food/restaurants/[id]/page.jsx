"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import RestaurantAPI from "@/lib/restaurantApi";
import MTTransFoodHeader from "@/components/food/MTTransFoodHeader";
import MTTransFoodFooter from "@/components/food/MTTransFoodFooter";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, cart, getRestaurantId, clearCart } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      const [restaurantData, menusData] = await Promise.all([
        RestaurantAPI.getRestaurant(parseInt(id)),
        RestaurantAPI.getMenusByRestaurant(parseInt(id)),
      ]);
      setRestaurant(restaurantData);
      setMenus(menusData.filter(menu => menu.availability));
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (menu: any) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    setIsAddingToCart(menu.id);
    try {
      // Check if cart has items from different restaurant
      const currentRestaurantId = getRestaurantId();
      if (currentRestaurantId && currentRestaurantId !== restaurant.id) {
        if (!confirm('Keranjang Anda berisi item dari restaurant lain. Ingin mengganti?')) {
          setIsAddingToCart(null);
          return;
        }
        // Clear cart first if user wants to replace
        try {
          await clearCart();
        } catch (clearError) {
          console.error('Error clearing cart:', clearError);
          // Continue anyway, backend will handle it
        }
      }

      await addToCart({
        menuId: menu.id,
        menuName: menu.name,
        price: parseFloat(menu.price),
        image: menu.image,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });

      setNotificationMessage(`${menu.name} ditambahkan ke keranjang`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menambahkan ke keranjang';
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsAddingToCart(null);
    }
  };

  const categories = ["all", ...new Set(menus.map(menu => menu.category))];
  const filteredMenus = selectedCategory === "all" 
    ? menus 
    : menus.filter(menu => menu.category === selectedCategory);

  return (
    <div className="relative w-full bg-white text-[#1a1a1a]">
      <MTTransFoodHeader />

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-down">
          {notificationMessage}
        </div>
      )}

      <main className="pt-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E00000] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading restaurant...</p>
          </div>
        ) : restaurant ? (
          <>
            {/* Restaurant Header */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 py-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <button
                  onClick={() => router.back()}
                  className="mb-4 flex items-center gap-2 text-gray-600 hover:text-[#E00000] transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Kembali
                </button>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={restaurant.image || '/placeholder.jpg'}
                    alt={restaurant.name}
                    className="w-full md:w-64 h-48 object-cover rounded-2xl shadow-lg"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{restaurant.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">star</span>
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-500">restaurant</span>
                        <span className="text-gray-600">{restaurant.category}</span>
                      </div>
                      {restaurant.openingTime && restaurant.closingTime && (
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-500">schedule</span>
                          <span className="text-gray-600">{restaurant.openingTime} - {restaurant.closingTime}</span>
                        </div>
                      )}
                    </div>

                    {restaurant.address && (
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gray-500">location_on</span>
                        <span className="text-gray-600">{restaurant.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Category Filter */}
            <section className="bg-white border-b border-gray-200 sticky top-20 z-30">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#E00000] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'Semua' : category}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Menu Grid */}
            <section className="py-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Menu</h2>
                
                {filteredMenus.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMenus.map((menu) => (
                      <div
                        key={menu.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={menu.image || '/placeholder.jpg'}
                            alt={menu.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-semibold text-gray-700">{menu.category}</span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{menu.name}</h3>
                          {menu.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{menu.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-[#E00000]">
                              Rp {parseInt(menu.price).toLocaleString('id-ID')}
                            </p>
                            <button
                              onClick={() => handleAddToCart(menu)}
                              disabled={isAddingToCart === menu.id}
                              className="bg-[#E00000] text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingToCart === menu.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Menambah...</span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                                  Tambah
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-gray-300">restaurant_menu</span>
                    <p className="text-gray-500 mt-4">Tidak ada menu tersedia</p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-gray-600">Restaurant tidak ditemukan</p>
          </div>
        )}
      </main>

      <MTTransFoodFooter />

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => router.push('/cart')}
          className="fixed bottom-6 right-6 bg-[#E00000] text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-40 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      )}
    </div>
  );
}

