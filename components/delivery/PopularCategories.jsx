"use client"

import { useRouter } from 'next/navigation'

const PopularCategories = () => {
  const router = useRouter()

  const handleCategoryClick = (category) => {
    if (category === "Makanan & Minuman") {
      router.push('/food')
    } else {
      alert(`${category} clicked!`)
    }
  }

  const categories = [
    {
      name: "Kirim Barang",
      subtitle: "(dokumen, paket kecil)",
      icon: "🛵",
      bgColor: "bg-green-100"
    },
    {
      name: "Makanan & Minuman",
      subtitle: "",
      icon: "🍔",
      bgColor: "bg-orange-100"
    },
    {
      name: "Titip Belanja",
      subtitle: "",
      icon: "🛒",
      bgColor: "bg-blue-100"
    },
    {
      name: "Paket Besar / Ekspedisi Lokal",
      subtitle: "",
      icon: "🚚",
      bgColor: "bg-purple-100"
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
        <button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="flex flex-col items-center bg-white text-center p-6 md:p-8 rounded-3xl border-0 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Icon with colored background */}
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${category.bgColor} flex items-center justify-center mb-4 md:mb-6 overflow-hidden`}>
              {category.name === "Kirim Barang" ? (
                <img 
                  src="/delivery-scooter.png" 
                  alt="Delivery Scooter" 
                  className="w-full h-full object-cover"
                />
              ) : category.name === "Titip Belanja" ? (
                <img 
                  src="/shopping-cart.png" 
                  alt="Shopping Cart" 
                  className="w-full h-full object-cover"
                />
              ) : category.name === "Paket Besar / Ekspedisi Lokal" ? (
                <img 
                  src="/delivery-gift-boxes.png" 
                  alt="Delivery Gift Boxes" 
                  className="w-full h-full object-cover"
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
          </button>
        ))}
      </div>
    </div>
  )
}

export default PopularCategories