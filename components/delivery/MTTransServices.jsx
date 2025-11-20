"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { OngkirAPI } from '@/lib/ongkirApi';
import Toast from '../common/Toast';

export default function MTTransServices() {
  const router = useRouter();
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [backendServices, setBackendServices] = useState([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    loadBackendServices();
  }, []);

  const loadBackendServices = async () => {
    try {
      setLoadingServices(true);
      const data = await OngkirAPI.getServices();
      setBackendServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleServiceClick = (serviceTitle) => {
    if (serviceTitle === 'Titip Belanja') {
      // Show coming soon notification
      setToast({
        message: 'Coming Soon!',
        type: 'info',
        icon: 'schedule'
      });
      return;
    }

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
      case 'Ekspedisi Lokal':
        router.push('/cek-ongkir?type=ekspedisi-lokal');
        break;
      default:
        router.push('/');
    }
  };

  const handleBackendServiceClick = (service) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    router.push('/cek-ongkir?type=kirim-barang&service=' + encodeURIComponent(service.name));
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
          <button 
            className="text-[#E00000] font-semibold hover:underline"
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? 'Sembunyikan' : 'Lihat Semua'} Services {showAllServices ? '↑' : '↓'}
          </button>
        </div>

        {/* All Services Dropdown */}
        {showAllServices && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">Semua Services Tersedia</h3>
            {loadingServices ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E00000] mx-auto"></div>
                <p className="text-gray-600 mt-2">Memuat services...</p>
              </div>
            ) : backendServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backendServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                    onClick={() => handleBackendServiceClick(service)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg text-[#1a1a1a]">{service.name}</h4>
                      {service.status === 'active' && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
                      )}
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      {service.estimasi && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {service.estimasi}
                        </span>
                      )}
                      {service.base_rate && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">attach_money</span>
                          Mulai dari Rp {new Intl.NumberFormat('id-ID').format(service.base_rate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tidak ada services tersedia saat ini.
              </div>
            )}
          </div>
        )}
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
    </section>
  );
}
