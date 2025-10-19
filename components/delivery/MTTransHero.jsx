"use client";

import { useRouter } from 'next/navigation';

export default function MTTransHero() {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push('/food');
  };

  const handleLearnMore = () => {
    // Scroll to services section
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKirimBarang = () => {
    router.push('/cek-ongkir?tab=cek-ongkir');
  };

  const handlePengirimanInstan = () => {
    router.push('/cek-ongkir?tab=jadwal');
  };

  return (
    <section className="relative bg-[#E00000] fade-in" style={{paddingTop: '80px', paddingBottom: '80px'}}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Pengantaran Mudah & Praktis
          </h1>
          <p className="mt-6 text-lg text-red-100">
            Biarkan kami mengantarkan kebutuhan Anda dengan cepat dan andal.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={handleKirimBarang}
              className="flex min-w-[150px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white text-[#E00000] text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors"
            >
              <span className="truncate">Kirim Barang</span>
            </button>
            <button 
              onClick={handlePengirimanInstan}
              className="flex min-w-[150px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-transparent border-2 border-white text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white hover:text-[#E00000] transition-colors"
            >
              <span className="truncate">Pengiriman Instan</span>
            </button>
          </div>
          
          {/* Additional Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
            <button 
              onClick={handleOrderNow}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">restaurant</span>
              <span>Order Makanan</span>
            </button>
            <button 
              onClick={handleLearnMore}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">info</span>
              <span>Pelajari Lebih</span>
            </button>
          </div>
          <div className="mt-8 flex justify-center md:justify-start items-center gap-4 text-red-200 font-medium">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
            </svg>
            <span>Cepat</span>
            <span className="text-red-300">•</span>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
            </svg>
            <span>Aman</span>
            <span className="text-red-300">•</span>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
            </svg>
            <span>Terjangkau</span>
          </div>
        </div>
        <div className="relative w-full max-w-lg lg:max-w-xl">
          <img 
            alt="Kurir MT Trans mengantarkan paket" 
            className="rounded-2xl shadow-2xl w-full h-auto object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqYWUoH1Xu7uWcooXW8ZK3Enwoky-EixqDWdl66PmabpuXNT6eI4oNhk-BwiAXqm97Qwz1jJEppH4ybTLW1CUjcIRV_mOf7hikGyGTb9-ZH2wqZF8tUrsvBfEiPaOIMNFKlkhcID_JNEFIcrsh96-SbYkK8octlhmP_ffWwWoGsxgzn1CMKF7vhekM9DHr5QhnDgXA_z0WJg7WrTz7t_3ya3FUGuQvp6KJhHSi7VtdMldYuhlUE-UpBrzYcfYr4Cn-VkrJX_zGI-U"
          />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-700/50 rounded-full -z-10"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 border-8 border-white rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
}

