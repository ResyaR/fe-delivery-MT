"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromoBanner() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const promos = [
    {
      id: 1,
      title: "Hemat 30% untuk Pesanan Pertama Anda!",
      subtitle: "Gunakan kode: MTWELCOME30 - Min. pembelian Rp 50.000",
      bgColor: "bg-gradient-to-r from-[#E00000] via-[#FF6B6B] to-[#FF8E53]",
      buttonText: "Pesan Sekarang",
      link: "/food",
      image: "/food-promo-banner-1.jpg"
    },
    {
      id: 2,
      title: "Gratis Ongkir Untuk Pengiriman Lokal",
      subtitle: "Kirim paket dalam kota gratis untuk min. Rp 100.000",
      bgColor: "bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]",
      buttonText: "Cek Ongkir",
      link: "/cek-ongkir",
      image: "/food-promo-banner-2.jpg"
    },
    {
      id: 3,
      title: "Promo Spesial Akhir Bulan",
      subtitle: "Diskon hingga 25% untuk menu pilihan dari merchant favorit",
      bgColor: "bg-gradient-to-r from-[#be123c] via-[#E00000] to-[#dc2626]",
      buttonText: "Lihat Menu",
      link: "/food/all",
      image: "/food-promo-banner-3.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [promos.length]);

  const handlePromoClick = (link) => {
    router.push(link);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promos.map((promo, index) => (
              <div
                key={promo.id}
                className={`min-w-full ${promo.bgColor} relative`}
                style={{ minHeight: '300px' }}
              >
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Content */}
                  <div className="flex-1 text-white text-center md:text-left z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                      {promo.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 mb-6">
                      {promo.subtitle}
                    </p>
                    <button
                      onClick={() => handlePromoClick(promo.link)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                      aria-label={`${promo.buttonText} - ${promo.title}`}
                    >
                      <span>{promo.buttonText}</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>

                  {/* Optional Image */}
                  <div className="hidden md:block flex-shrink-0">
                    <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="material-symbols-outlined text-white text-8xl">
                        {promo.id === 1 ? 'restaurant' : promo.id === 2 ? 'local_shipping' : 'payments'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all z-20"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % promos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all z-20"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}

