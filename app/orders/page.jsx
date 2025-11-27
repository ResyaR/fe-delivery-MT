"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import OrderAPI from "@/lib/orderApi";
import MTTransFoodHeader from "@/components/food/MTTransFoodHeader";
import MTTransFoodFooter from "@/components/food/MTTransFoodFooter";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }
    
    if (user) {
      loadOrders();
    }

    // Check for success parameter
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [user, loading, router, searchParams]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await OrderAPI.getMyOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (order) => {
    try {
      const orderDetail = await OrderAPI.getOrderDetail(order.id);
      setSelectedOrder(orderDetail);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading order detail:', error);
      alert('Gagal memuat detail order');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      preparing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diproses' },
      delivering: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Dikirim' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'schedule',
      preparing: 'restaurant',
      delivering: 'local_shipping',
      delivered: 'check_circle',
      cancelled: 'cancel',
    };
    return icons[status] || 'schedule';
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen">
      <MTTransFoodHeader />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-down max-w-md">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <div>
              <p className="font-bold">Pesanan Berhasil Dibuat!</p>
              <p className="text-sm">Pesanan Anda sedang diproses</p>
            </div>
          </div>
        </div>
      )}

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-8xl text-gray-300">receipt_long</span>
              <p className="text-xl text-gray-500 mt-4 mb-8">Belum ada pesanan</p>
              <button
                onClick={() => router.push('/food')}
                className="bg-[#E00000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Mulai Pesan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <span className="material-symbols-outlined text-[#E00000] text-3xl">
                        {getStatusIcon(order.status)}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900">
                          {order.orderNumber || `#${order.id}`}
                        </p>
                        <p className="text-sm text-gray-600">{order.restaurant?.name || 'Restaurant'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(order.status)}
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Items</p>
                        <p className="font-medium">
                          {order.items?.length || 0} item(s)
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-xl font-bold text-[#E00000]">
                          Rp {Math.round(order.total).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="flex-1 border border-[#E00000] text-[#E00000] py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                        Lihat Detail
                      </button>
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => router.push(`/food/restaurants/${order.restaurantId}`)}
                          className="flex-1 bg-[#E00000] text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">refresh</span>
                          Pesan Lagi
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MTTransFoodFooter />

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detail Pesanan {selectedOrder.orderNumber || `#${selectedOrder.id}`}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Status Pesanan</p>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#E00000] text-4xl">
                    {getStatusIcon(selectedOrder.status)}
                  </span>
                  <div>
                    {getStatusBadge(selectedOrder.status)}
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Restaurant</p>
                <p className="font-bold text-lg">{selectedOrder.restaurant?.name || 'Restaurant'}</p>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-3">Item Pesanan</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.menuName}</p>
                        <p className="text-sm text-gray-600">
                          Rp {parseInt(item.price).toLocaleString('id-ID')} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        Rp {parseInt(item.subtotal).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">Alamat Pengantaran</p>
                <p className="text-gray-900">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Catatan</p>
                  <p className="text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      Rp {parseInt(selectedOrder.subtotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Biaya Pengantaran</span>
                    <span className="font-medium">
                      Rp {parseInt(selectedOrder.deliveryFee).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#E00000]">
                      Rp {Math.round(selectedOrder.total).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}

