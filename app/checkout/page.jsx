"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import OrderAPI from "@/lib/orderApi";
import MTTransFoodHeader from "@/components/food/MTTransFoodHeader";
import MTTransFoodFooter from "@/components/food/MTTransFoodFooter";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cart, getTotalPrice, clearCart, getRestaurantId } = useCart();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
    if (!loading && cart.length === 0) {
      router.push('/cart');
    }
    
    // Load delivery data from localStorage
    const savedDeliveryData = localStorage.getItem('checkout_delivery_data');
    if (savedDeliveryData) {
      try {
        const data = JSON.parse(savedDeliveryData);
        setDeliveryData(data);
        if (data.address) {
          setFormData(prev => ({
            ...prev,
            deliveryAddress: `${data.address.street}, ${data.address.city}, ${data.address.province} ${data.address.postalCode || ''}`.trim(),
          }));
        }
      } catch (error) {
        console.error('Error parsing delivery data:', error);
      }
    }
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.fullName || user.username || "",
        customerPhone: user.phone || "",
      }));
    }
  }, [user, loading, cart, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.deliveryAddress.trim()) {
      alert('Mohon isi alamat pengantaran');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!deliveryData || !deliveryData.address || !deliveryData.address.zone) {
        alert('Data pengiriman tidak lengkap. Silakan kembali ke halaman cart.');
        router.push('/cart');
        return;
      }

      const orderData = {
        restaurantId: getRestaurantId(),
        items: cart.map(item => ({
          menuId: item.menuId,
          menuName: item.menuName,
          price: item.price,
          quantity: item.quantity,
        })),
        deliveryAddress: deliveryData.address.street,
        deliveryCity: deliveryData.address.city,
        deliveryProvince: deliveryData.address.province,
        deliveryPostalCode: deliveryData.address.postalCode || '',
        deliveryZone: deliveryData.address.zone,
        deliveryType: deliveryData.deliveryType || 'regular',
        scheduledDate: deliveryData.scheduledDate || undefined,
        scheduledTime: deliveryData.scheduledTime || undefined,
        scheduleTimeSlot: deliveryData.scheduleTimeSlot || undefined,
        notes: `${formData.notes || ''}${deliveryData.restaurantNotes ? `\nCatatan Restaurant: ${deliveryData.restaurantNotes}` : ''}${deliveryData.driverNotes ? `\nCatatan Driver: ${deliveryData.driverNotes}` : ''}`.trim() || undefined,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryFee: deliveryData.deliveryFee || 10000,
      };

      const result = await OrderAPI.createOrder(orderData);
      
      // Clear delivery data from localStorage
      localStorage.removeItem('checkout_delivery_data');
      
      // Clear cart after successful order
      try {
        await clearCart();
      } catch (cartError) {
        console.error('Error clearing cart:', cartError);
        // Continue even if cart clear fails
      }
      
      // Redirect to order success page or order detail
      router.push(`/orders?success=true&orderId=${result.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.message || 'Gagal membuat order. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    );
  }

  if (!user || cart.length === 0) {
    return null;
  }

  const deliveryFee = deliveryData?.deliveryFee || 10000;
  const total = getTotalPrice() + deliveryFee;

  return (
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen">
      <MTTransFoodHeader />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Penerima</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                        placeholder="081234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat Pengantaran *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                        placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan (Opsional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                        placeholder="Contoh: Tanpa cabe, Extra sambal, dll"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Pesanan dari {cart[0]?.restaurantName}
                  </h2>
                  
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.menuId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="16"%3E%3F%3C/text%3E%3C/svg%3E'}
                            alt={item.menuName}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="16"%3E%3F%3C/text%3E%3C/svg%3E'; }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.menuName}</p>
                            <p className="text-sm text-gray-600">
                              Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method (Placeholder) */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h2>
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <span className="material-symbols-outlined text-gray-600">payments</span>
                    <div>
                      <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Bayar saat pesanan tiba</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Sticky */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                      <span className="font-semibold">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Biaya Pengantaran</span>
                      <span className="font-semibold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-[#E00000]">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#E00000] text-white py-3 rounded-lg font-bold transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                    }`}
                  >
                    {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Dengan melakukan pemesanan, Anda menyetujui syarat dan ketentuan yang berlaku
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <MTTransFoodFooter />
    </div>
  );
}

