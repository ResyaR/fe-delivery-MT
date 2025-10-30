"use client";

import { useState } from 'react';

export default function AddressSelector({ 
  isOpen, 
  onClose, 
  onSelectAddress,
  savedAddresses = [],
  currentAddress 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    note: ''
  });

  const handleAddAddress = () => {
    // In real app, this would save to user profile
    onSelectAddress(newAddress);
    setShowAddForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {showAddForm ? 'Tambah Alamat Baru' : 'Pilih Alamat Pengiriman'}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showAddForm ? (
            <>
              {/* Saved Addresses */}
              {savedAddresses.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {savedAddresses.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectAddress(address);
                        onClose();
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        currentAddress?.label === address.label
                          ? 'border-[#E00000] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">{address.label}</p>
                          <p className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.province} {address.postalCode}
                          </p>
                          {address.note && (
                            <p className="text-sm text-gray-500 mt-1">Note: {address.note}</p>
                          )}
                        </div>
                        {currentAddress?.label === address.label && (
                          <span className="material-symbols-outlined text-[#E00000]">check_circle</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-2">location_on</span>
                  <p>Belum ada alamat tersimpan</p>
                </div>
              )}

              {/* Add New Address Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#E00000] hover:text-[#E00000] transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                <span className="font-semibold">Tambah Alamat Baru</span>
              </button>
            </>
          ) : (
            <>
              {/* Add Address Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Label Alamat *
                  </label>
                  <input
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                    placeholder="Rumah, Kantor, dll"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    placeholder="Jalan, No. Rumah, RT/RW"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kota/Kabupaten *
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      placeholder="Jakarta"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provinsi *
                    </label>
                    <input
                      type="text"
                      value={newAddress.province}
                      onChange={(e) => setNewAddress({...newAddress, province: e.target.value})}
                      placeholder="DKI Jakarta"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                    placeholder="12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan (opsional)
                  </label>
                  <input
                    type="text"
                    value={newAddress.note}
                    onChange={(e) => setNewAddress({...newAddress, note: e.target.value})}
                    placeholder="Patokan, warna rumah, dll"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.province}
                  className="flex-1 px-4 py-3 bg-[#E00000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan Alamat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

