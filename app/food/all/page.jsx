"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import MTTransFoodHeader from "../../../components/food/MTTransFoodHeader";
import MTTransFoodFooter from "../../../components/food/MTTransFoodFooter";

export default function AllFoodPage() {
  const { user } = useAuth();

  const foodCategories = [
    {
      id: 1,
      name: "Makanan Indonesia",
      items: [
        { id: 1, name: "Nasi Gudeg", price: "Rp 25.000", image: "/food/nasi-gudeg.jpg", rating: 4.8 },
        { id: 2, name: "Rendang", price: "Rp 35.000", image: "/food/rendang.jpg", rating: 4.9 },
        { id: 3, name: "Sate Ayam", price: "Rp 20.000", image: "/food/sate-ayam.jpg", rating: 4.7 },
        { id: 4, name: "Gado-gado", price: "Rp 18.000", image: "/food/gado-gado.jpg", rating: 4.6 },
        { id: 5, name: "Soto Ayam", price: "Rp 22.000", image: "/food/soto-ayam.jpg", rating: 4.8 },
        { id: 6, name: "Pecel Lele", price: "Rp 15.000", image: "/food/pecel-lele.jpg", rating: 4.5 }
      ]
    },
    {
      id: 2,
      name: "Makanan Cepat Saji",
      items: [
        { id: 7, name: "Burger King", price: "Rp 45.000", image: "/food/burger-king.jpg", rating: 4.6 },
        { id: 8, name: "KFC", price: "Rp 35.000", image: "/food/kfc.jpg", rating: 4.7 },
        { id: 9, name: "McDonald's", price: "Rp 40.000", image: "/food/mcdonalds.jpg", rating: 4.8 },
        { id: 10, name: "Pizza Hut", price: "Rp 80.000", image: "/food/pizza-hut.jpg", rating: 4.5 },
        { id: 11, name: "Subway", price: "Rp 30.000", image: "/food/subway.jpg", rating: 4.4 },
        { id: 12, name: "Domino's", price: "Rp 75.000", image: "/food/dominos.jpg", rating: 4.6 }
      ]
    },
    {
      id: 3,
      name: "Minuman",
      items: [
        { id: 13, name: "Es Teh Manis", price: "Rp 8.000", image: "/food/es-teh.jpg", rating: 4.3 },
        { id: 14, name: "Jus Jeruk", price: "Rp 15.000", image: "/food/jus-jeruk.jpg", rating: 4.5 },
        { id: 15, name: "Kopi Hitam", price: "Rp 12.000", image: "/food/kopi-hitam.jpg", rating: 4.7 },
        { id: 16, name: "Es Cendol", price: "Rp 10.000", image: "/food/es-cendol.jpg", rating: 4.4 },
        { id: 17, name: "Jus Alpukat", price: "Rp 18.000", image: "/food/jus-alpukat.jpg", rating: 4.6 },
        { id: 18, name: "Teh Tarik", price: "Rp 14.000", image: "/food/teh-tarik.jpg", rating: 4.5 }
      ]
    },
    {
      id: 4,
      name: "Dessert",
      items: [
        { id: 19, name: "Es Krim", price: "Rp 20.000", image: "/food/es-krim.jpg", rating: 4.8 },
        { id: 20, name: "Pudding", price: "Rp 15.000", image: "/food/pudding.jpg", rating: 4.4 },
        { id: 21, name: "Kue Lapis", price: "Rp 25.000", image: "/food/kue-lapis.jpg", rating: 4.6 },
        { id: 22, name: "Baklava", price: "Rp 30.000", image: "/food/baklava.jpg", rating: 4.7 },
        { id: 23, name: "Tiramisu", price: "Rp 35.000", image: "/food/tiramisu.jpg", rating: 4.9 },
        { id: 24, name: "Cheesecake", price: "Rp 28.000", image: "/food/cheesecake.jpg", rating: 4.8 }
      ]
    }
  ];

  const handleAddToCart = (item) => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', item);
  };

  return (
    <div className="relative w-full bg-white text-[#1a1a1a]">
      <MTTransFoodHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Semua Makanan & Minuman
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai pilihan makanan dan minuman lezat dari berbagai kategori
            </p>
          </div>
        </section>

        {/* Food Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {foodCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {category.name}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = '/food/placeholder.jpg';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold text-[#E00000] mb-4">{item.price}</p>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-[#E00000] text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                          {user ? 'Tambah ke Keranjang' : 'Login untuk Order'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
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
