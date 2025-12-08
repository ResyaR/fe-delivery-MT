"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import { motion } from 'framer-motion'
import Toast from '../common/Toast'

const PopularCategories = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [toast, setToast] = useState(null)

  const handleCategoryClick = (category) => {
    if (category === "Titip Belanja") {
      // Show coming soon notification
      setToast({
        message: 'Coming Soon!',
        type: 'info',
        icon: 'schedule'
      })
      return
    }

    if (!user) {
      router.push('/signin')
      return
    }

    if (category === "Makanan & Minuman") {
      router.push('/food')
    } else if (category === "Kirim Barang") {
      router.push('/cek-ongkir?tab=cek-ongkir')
    } else if (category === "Paket Besar / Ekspedisi Lokal") {
      router.push('/cek-ongkir?tab=ekspedisi')
    } else {
      router.push('/cek-ongkir')
    }
  }

  const categories = [
    {
      name: "Kirim Barang",
      subtitle: "(dokumen, paket kecil)",
      icon: "🛵"
    },
    {
      name: "Makanan & Minuman",
      subtitle: "",
      icon: "🍔"
    },
    {
      name: "Titip Belanja",
      subtitle: "",
      icon: "🛒"
    },
    {
      name: "Paket Besar / Ekspedisi Lokal",
      subtitle: "",
      icon: "🚚"
    }
  ]

  return (
    <div className="flex flex-col items-center self-stretch px-4 md:px-8 lg:px-16 xl:px-32 py-16 md:py-20 lg:py-24">
      <div className="flex flex-col items-center mb-12 md:mb-16">
        <span className="text-red-500 text-sm md:text-base font-bold uppercase tracking-wider mb-4">
          Customer Favorites
        </span>
        <h2 className="text-black text-3xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl">
          Popular Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-7xl">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="flex flex-col items-center bg-white text-center p-6 md:p-8 rounded-3xl border-0 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
            aria-label={`${category.name} service`}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            {/* Icon */}
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-4 md:mb-6">
              {category.name === "Kirim Barang" ? (
                <img 
                  src="/delivery-scooter.png" 
                  alt="Delivery Scooter" 
                  className="w-full h-full object-contain"
                />
              ) : category.name === "Titip Belanja" ? (
                <img 
                  src="/shopping-cart.png" 
                  alt="Shopping Cart" 
                  className="w-full h-full object-contain"
                />
              ) : category.name === "Paket Besar / Ekspedisi Lokal" ? (
                <img 
                  src="/delivery-gift-boxes.png" 
                  alt="Delivery Gift Boxes" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl md:text-4xl">{category.icon}</span>
              )}
            </div>

            {/* Category name */}
            <span className="text-[#1E1E1E] text-lg md:text-xl font-bold mb-2">
              {category.name}
            </span>
            
            {/* Subtitle if exists */}
            {category.subtitle && (
              <span className="text-[#555555] text-sm md:text-base">
              {category.subtitle}
            </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </div>
  )
}

export default PopularCategories