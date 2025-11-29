"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import AvatarUpload from "@/components/profile/AvatarUpload";
import MTTransHeader from "@/components/delivery/MTTransHeader";
import MTTransFooter from "@/components/delivery/MTTransFooter";
import api from "@/lib/axios";
import { addressAPI, Address } from "@/lib/addressApi";
import AddressModal from "@/components/profile/AddressModal";

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (user) {
      setFormData({
        name: user.fullName || "",
        phone: user.phone || ""
      });
      loadSavedAddresses();
    }
  }, [user, loading, router]);

  const loadSavedAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const addresses = await addressAPI.getAll();
      setSavedAddresses(addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError(error.response?.data?.message || 'Gagal memuat alamat');
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };


  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    );
  }

  // Early return if no user
  if (!user) {
    return null;
  }

  const handleAvatarUpload = async (formData) => {
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setUser({ ...user, avatar: data.avatar });
      setSuccess("Avatar berhasil diupdate!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to upload avatar. Please try again.");
      throw err;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      
      const formattedPhone = formData.phone.startsWith('+62') 
        ? formData.phone 
        : `+62${formData.phone.startsWith('0') ? formData.phone.substring(1) : formData.phone}`;

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formattedPhone
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }

      setUser({
        ...user,
        fullName: responseData.fullName || formData.name,
        phone: responseData.phoneNumber || formattedPhone
      });
      
      setSuccess("Profile berhasil diupdate!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async (addressData) => {
    setIsLoading(true);
    setError('');
    try {
      if (editingAddress && editingAddress.id) {
        // Update existing address
        await addressAPI.update(editingAddress.id, addressData);
        setSuccess('Alamat berhasil diupdate!');
      } else {
        // Create new address
        await addressAPI.create(addressData);
        setSuccess('Alamat berhasil ditambahkan!');
      }
      
      // Reload addresses
      await loadSavedAddresses();
      
      setShowAddressForm(false);
      setEditingAddress(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error saving address:', error);
      setError(error.response?.data?.message || 'Gagal menyimpan alamat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await addressAPI.delete(id);
      setSuccess('Alamat berhasil dihapus!');
      await loadSavedAddresses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error deleting address:', error);
      setError(error.response?.data?.message || 'Gagal menghapus alamat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAddressModal = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen">
      <MTTransHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-[#E00000] to-[#B70000] rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
              <AvatarUpload
                  currentAvatar={user?.avatar}
                onUpload={handleAvatarUpload}
              />
              </div>
              <div className="flex-1 text-center md:text-left text-white">
                <h1 className="text-3xl font-bold mb-2">{user.fullName || user.email?.split('@')[0] || 'User'}</h1>
                <p className="text-white/90 mb-1">{user.email}</p>
                {user.phone && (
                  <p className="text-white/80 text-sm flex items-center justify-center md:justify-start gap-2 mt-2">
                    <span className="material-symbols-outlined text-lg">phone</span>
                    {user.phone}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span>{savedAddresses.length} Alamat Tersimpan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                    <span>Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined">person</span>
                  Informasi Profil
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Email */}
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        email
                      </span>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                        className="bg-gray-50 block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-gray-600 cursor-not-allowed"
                  />
                </div>
                    <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
              </div>

              {/* Name */}
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        badge
                      </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap Anda"
                        className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]/20 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        phone
                      </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                        placeholder="081234567890"
                        className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]/20 transition-all"
                  />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Format: 081234567890 (tanpa spasi atau karakter khusus)
                  </p>
              </div>

              {/* Save Button */}
                  <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                      className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-[#E00000] to-[#B70000] hover:from-[#B70000] hover:to-[#E00000] transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">save</span>
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E00000]">flash_on</span>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/orders')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-gray-600">receipt_long</span>
                <span className="text-sm font-medium text-gray-700">Lihat Semua Orders</span>
              </button>
              <button
                onClick={() => router.push('/deliveries')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-gray-600">local_shipping</span>
                <span className="text-sm font-medium text-gray-700">Riwayat Pengiriman</span>
              </button>
              <button
                onClick={() => router.push('/cek-ongkir')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-gray-600">calculate</span>
                <span className="text-sm font-medium text-gray-700">Cek Ongkir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Addresses */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              Alamat Pengiriman (Food Delivery)
            </h2>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="px-4 py-2 bg-[#E00000] text-white rounded-lg hover:bg-[#B70000] transition-colors flex items-center gap-2 font-semibold"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Tambah Alamat
              </button>
            )}
          </div>
          
          <div className="p-6">
            {savedAddresses.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">location_on</span>
                <p className="text-gray-600 text-lg font-medium">Belum ada alamat tersimpan</p>
                <p className="text-gray-500 text-sm mt-2">Tambahkan alamat untuk memudahkan pengiriman makanan</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="mt-6 px-6 py-3 bg-[#E00000] text-white rounded-lg font-semibold hover:bg-[#B70000] transition-colors"
                >
                  Tambah Alamat Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {address.recipientName && (
                          <p className="text-lg font-bold text-gray-900 mb-2">{address.recipientName}</p>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-[#E00000]">location_on</span>
                          <h3 className="font-bold text-gray-900">{address.label}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-[#E00000] text-white text-xs rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{address.street}</p>
                        <p className="text-sm text-gray-700 font-medium">
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        {address.zone && (
                          <p className="text-xs text-[#E00000] mt-1 font-semibold">Zona {address.zone}</p>
                        )}
                        {address.note && (
                          <p className="text-xs text-gray-500 mt-2">Note: {address.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address Form Modal */}
        <AddressModal
          isOpen={showAddressForm}
          onClose={handleCloseAddressModal}
          onSave={handleSaveAddress}
          editingAddress={editingAddress}
          isLoading={isLoading}
        />
        </div>
      </main>

      <MTTransFooter />
    </div>
  );
}
