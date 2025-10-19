"use client";

import { useRouter } from 'next/navigation';

export default function MTTransCTA() {
  const router = useRouter();

  const handleOrderNow = () => {
    router.push('/food');
  };

  return (
    <section className="py-20 sm:py-24 bg-[#E00000] text-white fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Siap Kirim Sekarang?</h2>
        <p className="mt-4 text-lg text-red-100 max-w-2xl mx-auto">
          Jangan tunda lagi kebutuhan Anda. Pesan pengantaran dengan MT Trans dan nikmati layanan terbaik.
        </p>
        <button 
          onClick={handleOrderNow}
          className="mt-10 flex min-w-[200px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white text-[#E00000] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 transition-colors mx-auto"
        >
          <span className="truncate">Pesan Pengantaran</span>
        </button>
      </div>
    </section>
  );
}
