"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import DeliveryAPI from '@/lib/deliveryApi';
import MTTransHeader from '@/components/delivery/MTTransHeader';
import MTTransFooter from '@/components/delivery/MTTransFooter';
import DeliveryCard from '@/components/delivery/DeliveryCard';
import DeliveryDetailModal from '@/components/delivery/DeliveryDetailModal';
import Toast from '@/components/common/Toast';

export default function DeliveriesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [toast, setToast] = useState(null);

  const filters = [
    { id: 'ALL', label: 'Semua', type: null },
    { id: 'JADWAL', label: 'Jadwal Pengiriman', type: 'JADWAL' },
    { id: 'MULTI_DROP', label: 'Multi Drop', type: 'MULTI_DROP' },
    { id: 'PAKET_BESAR', label: 'Paket Besar', type: 'PAKET_BESAR' },
    { id: 'KIRIM_SEKARANG', label: 'Kirim Sekarang', type: 'KIRIM_SEKARANG' },
    { id: 'TITIP_BELI', label: 'Titip Beli', type: 'TITIP_BELI' }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }
    
    if (user) {
      loadDeliveries();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    filterDeliveries();
  }, [activeFilter, deliveries]);

  const loadDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await DeliveryAPI.getHistory();
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Error loading deliveries:', error);
      setToast({
        message: 'Gagal memuat riwayat pengiriman: ' + (error.response?.data?.message || error.message),
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDeliveries = () => {
    if (activeFilter === 'ALL') {
      setFilteredDeliveries(deliveries);
    } else {
      const filter = filters.find(f => f.id === activeFilter);
      setFilteredDeliveries(deliveries.filter(d => d.type === filter.type));
    }
  };

  const handleViewDetail = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleCloseModal = () => {
    setSelectedDelivery(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E00000]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MTTransHeader />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pengiriman</h1>
            <p className="text-gray-600">Lihat semua pengiriman Anda di sini</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-[#E00000] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  {filter.label}
                  {filter.id !== 'ALL' && deliveries.filter(d => d.type === filter.type).length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === filter.id ? 'bg-white text-[#E00000]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {deliveries.filter(d => d.type === filter.type).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-16"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDeliveries.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-8xl text-gray-300 mb-4">
                local_shipping
              </span>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {activeFilter === 'ALL' 
                  ? 'Belum ada riwayat pengiriman' 
                  : `Tidak ada ${filters.find(f => f.id === activeFilter)?.label.toLowerCase()}`
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {activeFilter === 'ALL'
                  ? 'Mulai buat pengiriman pertama Anda sekarang'
                  : 'Coba filter lain atau buat pengiriman baru'
                }
              </p>
              <button
                onClick={() => router.push('/cek-ongkir')}
                className="bg-[#E00000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Buat Pengiriman Baru
              </button>
            </div>
          ) : (
            // Deliveries Grid
            <>
              <div className="mb-4 text-sm text-gray-600">
                Menampilkan {filteredDeliveries.length} pengiriman
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeliveries.map((delivery) => (
                  <DeliveryCard
                    key={delivery.id}
                    delivery={delivery}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <MTTransFooter />

      {/* Detail Modal */}
      {selectedDelivery && (
        <DeliveryDetailModal
          delivery={selectedDelivery}
          onClose={handleCloseModal}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

