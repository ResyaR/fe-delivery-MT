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
          Apa Kata Mereka Tentang Layanan Food Delivery Kami?
        </h1>
        <p className="text-base md:text-xl text-gray-600">
          Cepat, hangat, dan aman sampai ke pelanggan.
        </p>
        <button 
          onClick={handleOrderNow}
          className="bg-[#E00000] text-white font-bold text-base md:text-lg rounded-full px-6 md:px-8 py-3 md:py-4 shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 hover:shadow-xl"
        >
          Pesan Sekarang
        </button>
      </div>
      <div 
        className="w-full h-auto aspect-video rounded-xl bg-cover bg-center shadow-lg" 
        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCiTg-TAz0auY4vLqxolBw84Jyrq20gkPM2VpCdHihyOTasJHbcBzCguQfdwi4roanUJF6UF5acxpegLeoJ9Yp83GvgXwTEFefCXx4dIg6HVzjITX9SfUSizo52WRxw6Z2gfJe_zxLdmvJ1MFLFVekW7j_fwy2hc5usg0lgBqSf2JwWot1nDkV9YRCcGx0Ak4X9cKomtmGX88yi-NfrCFxVEMn2KVFiViGv5XYCL6AGYf5W8-4MZQ-XHVpde_LRwQ4qM57ZzIuz50A")'}}
      />
    </section>
  );
}
