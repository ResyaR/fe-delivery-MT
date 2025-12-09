"use client";

import { useRouter } from 'next/navigation';

export default function MTTransCTA() {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push('/food');
  };

  return (
    <section className="py-20 sm:py-24 bg-[#E00000] text-white fade-in overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Siap Kirim Sekarang?</h2>
        <p className="mt-4 text-lg text-red-100 max-w-2xl mx-auto">
          Jangan tunda lagi kebutuhan Anda. Pesan pengantaran dengan MT Trans dan nikmati layanan terbaik.
        </p>
        <button 
          onClick={handleOrderNow}
          className="mt-10 flex w-full sm:min-w-[200px] sm:max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 sm:h-14 px-6 sm:px-8 bg-white text-[#E00000] text-base sm:text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors mx-auto"
        >
          <span className="truncate">Pesan Pengantaran</span>
        </button>
      </div>
    </section>
  );
}
