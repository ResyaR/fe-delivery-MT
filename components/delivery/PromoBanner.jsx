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
      subtitle: "Min. pembelian Rp 50.000",
      buttonText: "Pesan Sekarang",
      link: "/food",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Gratis Ongkir Untuk Pengiriman Lokal",
      subtitle: "Kirim paket dalam kota gratis untuk min. Rp 100.000",
      buttonText: "Cek Ongkir",
      link: "/cek-ongkir",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Promo Spesial Akhir Bulan",
      subtitle: "Diskon hingga 25% untuk menu pilihan dari merchant favorit",
      buttonText: "Lihat Menu",
      link: "/food/all",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop"
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
    <section className="relative w-full overflow-x-hidden py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promos.map((promo, index) => (
              <div
                key={promo.id}
                className="w-full flex-shrink-0 relative"
                style={{ minHeight: '400px' }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${promo.image})` }}
                >
                  {/* Overlay untuk readability */}
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 h-full min-h-[400px]">
                  <div className="flex-1 text-white text-center md:text-left w-full">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg break-words px-2 sm:px-0">
                      {promo.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/95 mb-4 sm:mb-6 drop-shadow-md break-words px-2 sm:px-0">
                      {promo.subtitle}
                    </p>
                    <button
                      onClick={() => handlePromoClick(promo.link)}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#E00000] text-white text-sm sm:text-base font-bold rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
                      aria-label={`${promo.buttonText} - ${promo.title}`}
                    >
                      <span className="truncate">{promo.buttonText}</span>
                      <span className="material-symbols-outlined text-lg sm:text-xl flex-shrink-0">arrow_forward</span>
                    </button>
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

