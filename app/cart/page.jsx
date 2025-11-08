"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import MTTransFoodHeader from "@/components/food/MTTransFoodHeader";
import MTTransFoodFooter from "@/components/food/MTTransFoodFooter";
import ConfirmDialog from "@/components/cart/ConfirmDialog";
import AddressSelector from "@/components/cart/AddressSelector";
import RestaurantInfoCard from "@/components/cart/RestaurantInfoCard";
import CheckoutSteps from "@/components/cart/CheckoutSteps";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  // State management
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(15000);
  const [estimatedTime, setEstimatedTime] = useState('30-45 menit');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [restaurantNotes, setRestaurantNotes] = useState('');
  const [driverNotes, setDriverNotes] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Mock saved addresses
  const savedAddresses = [
    {
      label: 'Rumah',
      street: 'Jl. Sudirman No. 123',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
      note: 'Rumah cat putih, pagar hitam'
    },
    {
      label: 'Kantor',
      street: 'Gedung Plaza Indonesia Lt. 5',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10350',
      note: 'Lobby utara'
    }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  // Mock promo codes
  const validPromoCodes = {
    'MTWELCOME30': { discount: 0.30, maxDiscount: 50000, minOrder: 50000 },
    'DISKON10K': { discount: 10000, minOrder: 30000 },
    'FREESHIP': { discount: 15000, type: 'shipping', minOrder: 75000 }
  };

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    setTimeout(() => {
      const promo = validPromoCodes[promoCode.toUpperCase()];
      const subtotal = getTotalPrice();

      if (!promo) {
        setPromoError('Kode promo tidak valid');
        setDiscount(0);
      } else if (subtotal < promo.minOrder) {
        setPromoError(`Minimum pembelian Rp ${promo.minOrder.toLocaleString('id-ID')}`);
        setDiscount(0);
      } else {
        if (promo.type === 'shipping') {
          setDiscount(Math.min(promo.discount, deliveryFee));
          setPromoSuccess(`Gratis ongkir Rp ${Math.min(promo.discount, deliveryFee).toLocaleString('id-ID')}`);
        } else if (typeof promo.discount === 'number' && promo.discount < 1) {
          // Percentage discount
          const discountAmount = Math.min(subtotal * promo.discount, promo.maxDiscount || Infinity);
          setDiscount(discountAmount);
          setPromoSuccess(`Diskon ${(promo.discount * 100)}% (Rp ${discountAmount.toLocaleString('id-ID')})`);
        } else {
          // Fixed discount
          setDiscount(promo.discount);
          setPromoSuccess(`Diskon Rp ${promo.discount.toLocaleString('id-ID')}`);
        }
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscount(0);
    setPromoError('');
    setPromoSuccess('');
  };

  const handleUpdateQuantity = async (menuId: number, newQty: number) => {
    if (newQty < 1) {
      await handleRemoveFromCart(menuId);
      return;
    }
    setUpdatingItem(menuId);
    try {
      await updateQuantity(menuId, newQty);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      alert(error.message || 'Gagal mengupdate jumlah item');
    } finally {
      setTimeout(() => setUpdatingItem(null), 300);
    }
  };

  const handleRemoveFromCart = async (menuId: number) => {
    try {
      await removeFromCart(menuId);
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      alert(error.message || 'Gagal menghapus item dari keranjang');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    // In real app, calculate delivery fee based on distance
    // For now, just randomize for demo
    const randomFee = Math.floor(Math.random() * (25000 - 10000) + 10000);
    setDeliveryFee(randomFee);
    setEstimatedTime(`${Math.floor(Math.random() * (60 - 30) + 30)}-${Math.floor(Math.random() * (75 - 45) + 45)} menit`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen">
      <MTTransFoodHeader />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          </div>

          {/* Checkout Steps */}
          {cart.length > 0 && <CheckoutSteps currentStep={1} />}

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-8xl text-gray-300">shopping_cart</span>
              <p className="text-xl text-gray-500 mt-4 mb-8">Keranjang Anda kosong</p>
              <button
                onClick={() => router.push('/food')}
                className="bg-[#E00000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Restaurant Info Card */}
                <RestaurantInfoCard 
                  restaurant={cart[0] ? {
                    name: cart[0].restaurantName,
                    image: '/placeholder.jpg',
                    rating: 4.8,
                    category: 'Food',
                    openingTime: '10:00',
                    closingTime: '22:00'
                  } : null}
                  subtotal={subtotal}
                />

                {/* Address Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#E00000]">location_on</span>
                      Alamat Pengiriman
                    </h2>
                  </div>
                  
                  {selectedAddress ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">{selectedAddress.label}</p>
                          <p className="text-sm text-gray-600">
                            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                          </p>
                          {selectedAddress.note && (
                            <p className="text-sm text-gray-500 mt-1">Note: {selectedAddress.note}</p>
                          )}
                          <p className="text-sm text-[#E00000] mt-2">
                            <span className="material-symbols-outlined text-sm align-middle">schedule</span> Est. {estimatedTime}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAddressSelector(true)}
                          className="text-[#E00000] font-semibold text-sm hover:underline"
                        >
                          Ubah
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddressSelector(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#E00000] hover:text-[#E00000] transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">add</span>
                      <span className="font-semibold">Pilih Alamat Pengiriman</span>
                    </button>
                  )}
                </div>

                {/* Cart Items */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                      {cart[0]?.restaurantName}
                    </h2>
                    <button
                      onClick={() => setShowConfirmClear(true)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                      aria-label="Clear all items from cart"
                    >
                      Hapus Semua
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <div key={item.menuId} className="p-4 flex gap-4">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.menuName}
                          className="w-24 h-24 object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{item.menuName}</h3>
                          <p className="text-lg font-bold text-[#E00000] mb-3">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.menuId, item.quantity - 1)}
                                disabled={updatingItem === item.menuId}
                                className="w-11 h-11 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50"
                                aria-label="Decrease quantity"
                              >
                                <span className="material-symbols-outlined text-lg">remove</span>
                              </button>
                              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                {updatingItem === item.menuId ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.menuId, item.quantity + 1)}
                                disabled={updatingItem === item.menuId}
                                className="w-11 h-11 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50"
                                aria-label="Increase quantity"
                              >
                                <span className="material-symbols-outlined text-lg">add</span>
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.menuId)}
                              className="text-red-600 hover:text-red-700 p-2"
                              aria-label={`Remove ${item.menuName} from cart`}
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Catatan</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Catatan untuk Restaurant
                      </label>
                      <textarea
                        value={restaurantNotes}
                        onChange={(e) => setRestaurantNotes(e.target.value.slice(0, 200))}
                        placeholder="Contoh: Pedas sedang, tanpa bawang"
                        rows={3}
                        maxLength={200}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {restaurantNotes.length}/200
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Catatan untuk Driver
                      </label>
                      <textarea
                        value={driverNotes}
                        onChange={(e) => setDriverNotes(e.target.value.slice(0, 200))}
                        placeholder="Contoh: Tolong ketuk pintu, jangan bel"
                        rows={3}
                        maxLength={200}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {driverNotes.length}/200
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 space-y-6">
                  <h2 className="text-lg font-bold text-gray-900">Ringkasan Belanja</h2>
                  
                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kode Promo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="MTWELCOME30"
                        disabled={discount > 0}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000] disabled:bg-gray-100"
                      />
                      {discount > 0 ? (
                        <button
                          onClick={removePromo}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                        >
                          Hapus
                        </button>
                      ) : (
                        <button
                          onClick={applyPromoCode}
                          disabled={!promoCode || isApplyingPromo}
                          className="px-4 py-2 bg-[#E00000] text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApplyingPromo ? '...' : 'Pakai'}
                        </button>
                      )}
                    </div>
                    {promoError && (
                      <p className="text-sm text-red-600 mt-1">{promoError}</p>
                    )}
                    {promoSuccess && (
                      <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {promoSuccess}
                      </p>
                    )}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                      <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Biaya Pengantaran</span>
                      <span className="font-semibold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon</span>
                        <span className="font-semibold">- Rp {discount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-[#E00000]">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    disabled={!selectedAddress}
                    className="w-full bg-[#E00000] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedAddress ? 'Lanjut ke Pembayaran' : 'Pilih Alamat Dulu'}
                  </button>

                  <button
                    onClick={() => router.push('/food')}
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Tambah Menu Lain
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <MTTransFoodFooter />

      {/* Modals */}
      <ConfirmDialog
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        onConfirm={clearCart}
        title="Hapus Semua Item?"
        message="Apakah Anda yakin ingin menghapus semua item dari keranjang?"
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
      />

      <AddressSelector
        isOpen={showAddressSelector}
        onClose={() => setShowAddressSelector(false)}
        onSelectAddress={handleSelectAddress}
        savedAddresses={savedAddresses}
        currentAddress={selectedAddress}
      />
    </div>
  );
}
