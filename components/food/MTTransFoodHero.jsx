"use client";

import { useRouter } from 'next/navigation';

export default function MTTransFoodHero() {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push('/food/all'); // Direct to all restaurants
  };

  return (
    <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="space-y-4 md:space-y-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          Makanan Favoritmu, Dikirim dengan Cepat dan Hangat
        </h1>
        <p className="text-base md:text-xl text-gray-600">
          Pesan makanan dari restaurant terbaik di kotamu. Cepat, hangat, dan aman sampai ke rumah.
        </p>
        <button 
          onClick={handleOrderNow}
          className="bg-[#E00000] text-white font-bold text-base md:text-lg rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 hover:shadow-xl"
        >
          Pesan Sekarang
        </button>
      </div>
      <div className="w-full h-auto aspect-video rounded-xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop"
          alt="Food Delivery"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}
