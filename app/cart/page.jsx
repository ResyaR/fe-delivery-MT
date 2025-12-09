"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useCart } from "@/lib/cartContext";
import { useToast } from "@/components/common/ToastProvider";
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
  const { showError } = useToast();

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

  // Load saved addresses from API
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load addresses from API
  const loadAddresses = async () => {
    if (!user) return;
    try {
      const { addressAPI } = await import('@/lib/addressApi');
      const addresses = await addressAPI.getAll();
      setSavedAddresses(addresses);
      return addresses;
    } catch (error) {
      console.error('Error loading saved addresses:', error);
      setSavedAddresses([]);
      return [];
    }
  };

  // Load addresses on mount and when user changes
  useEffect(() => {
    loadAddresses();
  }, [user]);

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        // Always update to default address if it exists
        setSelectedAddress(defaultAddress);
      } else if (!selectedAddress) {
        // If no default, select first address if nothing is selected
        setSelectedAddress(savedAddresses[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddresses]);

  // Refresh addresses when page becomes visible (user returns from profile page)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && user) {
        const addresses = await loadAddresses();
        // Auto-select default address when returning to page
        if (addresses.length > 0) {
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      }
    };

    const handleFocus = async () => {
      if (user) {
        const addresses = await loadAddresses();
        // Auto-select default address when window gets focus
        if (addresses.length > 0) {
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

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
      showError(error.message || 'Gagal mengupdate jumlah item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveFromCart = async (menuId) => {
    try {
      await removeFromCart(menuId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      showError(error.message || 'Gagal menghapus item dari keranjang');
    }
  };

  const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    
    // If address has an id, it's already saved. Otherwise, save it to backend
    if (address && !address.id) {
      try {
        const { addressAPI } = await import('@/lib/addressApi');
        const savedAddress = await addressAPI.create({
          label: address.label || 'Alamat Baru',
          recipientName: address.recipientName,
          street: address.street,
          city: address.city,
          cityId: address.cityId,
          province: address.province,
          postalCode: address.postalCode,
          zone: address.zone,
          note: address.note,
        });
        // Reload addresses
        const addresses = await addressAPI.getAll();
        setSavedAddresses(addresses);
        setSelectedAddress(savedAddress);
      } catch (error) {
        console.error('Error saving address:', error);
        // Continue anyway, address is still selected
      }
    }
    
    // Food delivery is within one city, flat rate
    const flatFee = 15000; // Flat rate untuk pengiriman dalam satu kota
    setDeliveryFee(flatFee);
    
    // Estimated time for same city delivery
    setEstimatedTime('30-45 menit');
  };

  // Update delivery fee when address changes (flat rate for same city food delivery)
  useEffect(() => {
    if (selectedAddress) {
      // Food delivery is within one city, always flat rate
      setDeliveryFee(15000);
      setEstimatedTime('30-45 menit');
    }
  }, [selectedAddress]);

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
  // Biaya aplikasi 10% dari subtotal + deliveryFee (makanan + driver)
  const appFee = (subtotal + deliveryFee) * 0.1;
  const total = subtotal + deliveryFee + appFee - discount;

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
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen flex flex-col overflow-x-hidden">
      <MTTransFoodHeader />

      <main className="pt-20 pb-8 sm:pb-16 flex-1 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="min-w-[44px] min-h-[44px] p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000]"
              aria-label="Kembali"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="md:col-span-2 space-y-4 sm:space-y-6">
                {/* Address Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#E00000] text-xl sm:text-2xl">location_on</span>
                      <span className="break-words">Alamat Pengiriman</span>
                    </h2>
                  </div>
                  
                  {selectedAddress ? (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {selectedAddress.recipientName && (
                            <p className="text-base sm:text-lg font-bold text-gray-900 mb-2 break-words">{selectedAddress.recipientName}</p>
                          )}
                          <p className="font-bold text-gray-900 mb-1 text-sm sm:text-base break-words">{selectedAddress.label}</p>
                          <p className="text-xs sm:text-sm text-gray-600 break-words">
                            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                          </p>
                          {selectedAddress.note && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">Note: {selectedAddress.note}</p>
                          )}
                          <p className="text-xs sm:text-sm text-[#E00000] mt-2">
                            <span className="material-symbols-outlined text-xs sm:text-sm align-middle">schedule</span> Est. {estimatedTime}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAddressSelector(true)}
                          className="text-[#E00000] font-semibold text-xs sm:text-sm hover:underline whitespace-nowrap flex-shrink-0"
                        >
                          Ubah
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddressSelector(true)}
                      className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#E00000] hover:text-[#E00000] transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg sm:text-xl">add</span>
                      <span className="font-semibold text-sm sm:text-base">Pilih Alamat Pengiriman</span>
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
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex-1 min-w-0 break-words">
                            {group.restaurantName}
                    </h2>
                    <button
                            onClick={() => {
                              // Hapus semua item dari restaurant ini
                              restaurantItemIds.forEach(menuId => {
                                handleRemoveFromCart(menuId);
                              });
                            }}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium whitespace-nowrap flex-shrink-0"
                            aria-label={`Clear all items from ${group.restaurantName}`}
                    >
                      Hapus Semua
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                          {group.items.map((item) => (
                      <div key={item.menuId} className="p-3 sm:p-4">
                        <div className="flex gap-3 sm:gap-4">
                          <img
                                  src={item.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E%3F%3C/text%3E%3C/svg%3E'}
                            alt={item.menuName}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                            loading="lazy"
                                  onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24"%3E%3F%3C/text%3E%3C/svg%3E'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex-1 min-w-0 break-words">{item.menuName}</h3>
                              <div className="text-right flex-shrink-0">
                                <p className="text-base sm:text-lg font-bold text-gray-900 whitespace-nowrap">
                                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm sm:text-base font-bold text-[#E00000] mb-2 sm:mb-3">
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                            
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleUpdateQuantity(item.menuId, item.quantity - 1)}
                                  disabled={updatingItem === item.menuId}
                                  className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                                  aria-label="Kurangi jumlah"
                                >
                                  <span className="material-symbols-outlined text-base sm:text-lg">remove</span>
                                </button>
                                <span className="px-3 sm:px-4 py-2 font-semibold min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                                  {updatingItem === item.menuId ? '...' : item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.menuId, item.quantity + 1)}
                                  disabled={updatingItem === item.menuId}
                                  className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                                  aria-label="Tambah jumlah"
                                >
                                  <span className="material-symbols-outlined text-base sm:text-lg">add</span>
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveFromCart(item.menuId)}
                                className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] text-red-600 hover:text-red-700 p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                                aria-label={`Hapus ${item.menuName} dari keranjang`}
                              >
                                <span className="material-symbols-outlined text-lg sm:text-xl">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

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
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-20 lg:top-24 space-y-6">
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
                        placeholder="Masukan kode"
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
                        <span>Diskon Promo</span>
                        <span className="font-semibold">- Rp {discount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-gray-700 mb-3">
                        <span>Biaya Aplikasi (10%)</span>
                        <span className="font-semibold">Rp {appFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-[#E00000]">Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedAddress) return;
                      
                      // Save delivery data to localStorage
                      const deliveryData = {
                        deliveryFee,
                        restaurantNotes,
                        driverNotes,
                        address: selectedAddress,
                      };
                      localStorage.setItem('checkout_delivery_data', JSON.stringify(deliveryData));
                      
                      router.push('/checkout');
                    }}
                    disabled={!selectedAddress}
                    className="w-full min-h-[44px] bg-[#E00000] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={selectedAddress ? 'Lanjut ke pembayaran' : 'Pilih alamat terlebih dahulu'}
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
