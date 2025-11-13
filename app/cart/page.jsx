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
  const [deliveryType, setDeliveryType] = useState('regular'); // regular, express, scheduled
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState('');
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

  const handleUpdateQuantity = async (menuId, newQty) => {
    if (newQty < 1) {
      await handleRemoveFromCart(menuId);
      return;
    }
    
    // GUARD: Prevent multiple rapid clicks
    if (updatingItem === menuId) {
      return; // Already updating, skip
    }
    
    setUpdatingItem(menuId);
    try {
      await updateQuantity(menuId, newQty);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(error.message || 'Gagal mengupdate jumlah item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveFromCart = async (menuId) => {
    try {
      await removeFromCart(menuId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert(error.message || 'Gagal menghapus item dari keranjang');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    // Calculate delivery fee based on zone
    const baseFee = 15000;
    const zoneMultiplier = address.zone ? address.zone * 2000 : 1; // Zone 1 = 2000, Zone 2 = 4000, etc
    setDeliveryFee(baseFee + zoneMultiplier);
    
    // Calculate estimated time based on zone
    const baseTime = 30;
    const zoneTime = address.zone ? address.zone * 5 : 0;
    setEstimatedTime(`${baseTime + zoneTime}-${baseTime + zoneTime + 15} menit`);
  };

  // Update delivery fee when delivery type changes
  useEffect(() => {
    if (selectedAddress) {
      const baseFee = 15000;
      const zoneMultiplier = selectedAddress.zone ? selectedAddress.zone * 2000 : 0;
      let fee = baseFee + zoneMultiplier;
      
      if (deliveryType === 'express') {
        fee = fee * 1.5; // Express is 50% more expensive
      }
      
      setDeliveryFee(fee);
    }
  }, [deliveryType, selectedAddress]);

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

  // Kelompokkan item berdasarkan restaurant
  const itemsByRestaurant = cart.reduce((acc, item) => {
    const restaurantId = item.restaurantId;
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantId: restaurantId,
        restaurantName: item.restaurantName,
        items: []
      };
    }
    acc[restaurantId].items.push(item);
    return acc;
  }, {});

  const restaurantGroups = Object.values(itemsByRestaurant);

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

                {/* Restaurant Groups */}
                {restaurantGroups.map((group) => {
                  const restaurantSubtotal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const restaurantItemIds = group.items.map(item => item.menuId);
                  
                  return (
                    <div key={group.restaurantId} className="space-y-4">
                      {/* Restaurant Info Card */}
                      <RestaurantInfoCard 
                        restaurant={{
                          name: group.restaurantName,
                          image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="16"%3E%3F%3C/text%3E%3C/svg%3E',
                          rating: 4.8,
                          category: 'Food',
                          openingTime: '10:00',
                          closingTime: '22:00'
                        }}
                        subtotal={restaurantSubtotal}
                      />

                      {/* Cart Items untuk restaurant ini */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                            {group.restaurantName}
                    </h2>
                    <button
                            onClick={() => {
                              // Hapus semua item dari restaurant ini
                              restaurantItemIds.forEach(menuId => {
                                handleRemoveFromCart(menuId);
                              });
                            }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                            aria-label={`Clear all items from ${group.restaurantName}`}
                    >
                      Hapus Semua
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                          {group.items.map((item) => (
                      <div key={item.menuId} className="p-4 flex gap-4">
                        <img
                                src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E%3F%3C/text%3E%3C/svg%3E'}
                          alt={item.menuName}
                          className="w-24 h-24 object-cover rounded-lg"
                          loading="lazy"
                                onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E%3F%3C/text%3E%3C/svg%3E'; }}
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
                    </div>
                  );
                })}

                {/* Delivery Type & Schedule Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Jenis Pengiriman</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => {
                          setDeliveryType('regular');
                          setScheduledDate('');
                          setScheduledTime('');
                          setScheduleTimeSlot('');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          deliveryType === 'regular'
                            ? 'border-[#E00000] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">Regular</div>
                        <div className="text-sm text-gray-600">30-45 menit</div>
                        <div className="text-xs text-gray-500 mt-1">Standar</div>
                      </button>

                      <button
                        onClick={() => {
                          setDeliveryType('express');
                          setScheduledDate('');
                          setScheduledTime('');
                          setScheduleTimeSlot('');
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          deliveryType === 'express'
                            ? 'border-[#E00000] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">Express</div>
                        <div className="text-sm text-gray-600">15-25 menit</div>
                        <div className="text-xs text-gray-500 mt-1">+50% ongkir</div>
                      </button>

                      <button
                        onClick={() => setDeliveryType('scheduled')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          deliveryType === 'scheduled'
                            ? 'border-[#E00000] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">Jadwal</div>
                        <div className="text-sm text-gray-600">Pilih waktu</div>
                        <div className="text-xs text-gray-500 mt-1">Fleksibel</div>
                      </button>
                    </div>

                    {deliveryType === 'scheduled' && (
                      <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tanggal Pengiriman *
                          </label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Waktu Pengiriman *
                          </label>
                          <select
                            value={scheduleTimeSlot}
                            onChange={(e) => {
                              setScheduleTimeSlot(e.target.value);
                              const [start, end] = e.target.value.split('-');
                              setScheduledTime(start);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                            required
                          >
                            <option value="">Pilih waktu</option>
                            <option value="09:00-12:00">09:00 - 12:00</option>
                            <option value="12:00-15:00">12:00 - 15:00</option>
                            <option value="15:00-18:00">15:00 - 18:00</option>
                            <option value="18:00-21:00">18:00 - 21:00</option>
                          </select>
                        </div>
                      </div>
                    )}
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
                    onClick={() => {
                      if (!selectedAddress) return;
                      
                      // Validate scheduled delivery
                      if (deliveryType === 'scheduled' && (!scheduledDate || !scheduleTimeSlot)) {
                        alert('Pilih tanggal dan waktu pengiriman terlebih dahulu');
                        return;
                      }
                      
                      // Save delivery data to localStorage
                      const deliveryData = {
                        deliveryType,
                        scheduledDate,
                        scheduledTime,
                        scheduleTimeSlot,
                        deliveryFee,
                        restaurantNotes,
                        driverNotes,
                        address: selectedAddress,
                      };
                      localStorage.setItem('checkout_delivery_data', JSON.stringify(deliveryData));
                      
                      router.push('/checkout');
                    }}
                    disabled={!selectedAddress || (deliveryType === 'scheduled' && (!scheduledDate || !scheduleTimeSlot))}
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
