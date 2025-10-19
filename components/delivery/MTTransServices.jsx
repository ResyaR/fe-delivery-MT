"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function MTTransServices() {
  const router = useRouter();
  const { user } = useAuth();

  const handleServiceClick = (serviceTitle) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    // Routing berdasarkan layanan yang dipilih
    switch (serviceTitle) {
      case 'Kirim Barang':
        router.push('/cek-ongkir?type=kirim-barang');
        break;
      case 'Makanan & Minuman':
        router.push('/food');
        break;
      case 'Titip Belanja':
        router.push('/cek-ongkir?type=titip-belanja');
        break;
      case 'Ekspedisi Lokal':
        router.push('/cek-ongkir?type=ekspedisi-lokal');
        break;
      default:
        router.push('/');
    }
  };
  const services = [
    {
      icon: (
        <img 
          src="/4efb6813da28f402329206e5a694772a2ca8b73e.png" 
          alt="Kurir mengantar paket dengan motor" 
          className="w-12 h-12 object-contain" 
          style={{ transform: "scaleX(-1)" }}
        />
      ),
      title: "Kirim Barang",
      description: "Pengiriman paket cepat dan aman ke seluruh penjuru kota."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V5a2 2 0 012-2h10a2 2 0 012 2v10.546zM9 13a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Makanan & Minuman",
      description: "Pesan dan nikmati hidangan favorit Anda tanpa harus keluar rumah."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Titip Belanja",
      description: "Hemat waktu Anda, biarkan kami yang berbelanja untuk Anda."
    },
    {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8zM21 16h-2v-5a1 1 0 00-1-1h-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Ekspedisi Lokal",
      description: "Solusi logistik terpercaya untuk bisnis Anda di dalam kota."
    }
  ];

  return (
    <section id="services" className="py-20 sm:py-24 bg-white fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">Popular Categories</h2>
          <p className="mt-4 text-lg text-gray-600">Solusi lengkap untuk semua kebutuhan pengiriman Anda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100 cursor-pointer"
              onClick={() => handleServiceClick(service.title)}
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-red-100 text-[#E00000]">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">{service.title}</h3>
              <p className="mt-2 text-base text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a className="text-[#E00000] font-semibold hover:underline" href="#">Lihat Semua Categories →</a>
        </div>
      </div>
    </section>
  );
}
