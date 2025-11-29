"use client";

import { useState, useEffect, useRef } from 'react';
import { OngkirAPI } from '@/lib/ongkirApi';

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
    recipientName: '',
    street: '',
    city: '',
    cityId: null,
    province: '',
    postalCode: '',
    zone: null,
    note: '',
    isDefault: false
  });
  const [customLabel, setCustomLabel] = useState('');

  // City autocomplete state
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const cityRef = useRef(null);

  // Load cities when searching
  useEffect(() => {
    if (citySearch.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setLoadingCities(true);
        try {
          const results = await OngkirAPI.getCities(citySearch);
          setCities(results);
          setShowCityDropdown(true);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setCities([]);
        } finally {
          setLoadingCities(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setCities([]);
      setShowCityDropdown(false);
    }
  }, [citySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    if (showCityDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCityDropdown]);

  const handleCitySelect = (city) => {
    setNewAddress({
      ...newAddress,
      city: city.name,
      cityId: city.id,
      province: city.province || '',
      zone: city.zone || null,
      postalCode: city.postalCode || ''
    });
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.zone) {
      alert('Pilih kota terlebih dahulu untuk menentukan zona pengiriman');
      return;
    }
    
    // Use custom label if "Lainnya" is selected
    const finalLabel = newAddress.label === 'Lainnya' ? customLabel : newAddress.label;
    
    if (!finalLabel) {
      alert('Pilih atau masukkan label alamat');
      return;
    }
    
    if (!newAddress.recipientName.trim()) {
      alert('Masukkan nama penerima');
      return;
    }
    
    // Address will be saved in parent component (cart/page.jsx) via onSelectAddress
    onSelectAddress({
      ...newAddress,
      label: finalLabel
    });
    setShowAddForm(false);
    setNewAddress({
      label: '',
      recipientName: '',
      street: '',
      city: '',
      cityId: null,
      province: '',
      postalCode: '',
      zone: null,
      note: '',
      isDefault: false
    });
    setCustomLabel('');
    setCitySearch('');
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
                          {address.recipientName && (
                            <p className="text-base font-bold text-gray-900 mb-1">
                              {address.recipientName}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{address.label}</p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-[#E00000] text-white text-xs rounded-full font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.province} {address.postalCode}
                          </p>
                          {address.zone && (
                            <p className="text-xs text-[#E00000] mt-1 font-semibold">Zona {address.zone}</p>
                          )}
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
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({...newAddress, recipientName: e.target.value})}
                    placeholder="Masukkan nama penerima"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Label Alamat *
                  </label>
                  <select
                    value={newAddress.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'Lainnya') {
                        setNewAddress({...newAddress, label: 'Lainnya'});
                      } else {
                        setNewAddress({...newAddress, label: value});
                        setCustomLabel('');
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000] bg-white"
                  >
                    <option value="">Pilih Label Alamat</option>
                    <option value="Rumah">Rumah</option>
                    <option value="Kantor">Kantor</option>
                    <option value="Kos">Kos</option>
                    <option value="Apartemen">Apartemen</option>
                    <option value="Toko">Toko</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {newAddress.label === 'Lainnya' && (
                    <input
                      type="text"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="Masukkan label lainnya"
                      className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                    />
                  )}
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

                <div className="relative" ref={cityRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kota/Kabupaten * (Cari dan pilih dari daftar)
                  </label>
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      if (!e.target.value) {
                        setNewAddress({
                          ...newAddress,
                          city: '',
                          cityId: null,
                          province: '',
                          zone: null,
                          postalCode: ''
                        });
                      }
                    }}
                    placeholder="Ketik nama kota..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                  />
                  
                  {showCityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loadingCities ? (
                        <div className="p-4 text-center text-gray-500">Memuat...</div>
                      ) : cities.length > 0 ? (
                        cities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-semibold text-gray-900">{city.name}</div>
                            <div className="text-sm text-gray-600">{city.province}</div>
                            {city.zone && (
                              <div className="text-xs text-[#E00000] mt-1">Zona {city.zone}</div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">Kota tidak ditemukan</div>
                      )}
                    </div>
                  )}
                  
                  {newAddress.city && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-semibold text-green-800">
                        {newAddress.city}, {newAddress.province}
                      </div>
                      {newAddress.zone && (
                        <div className="text-xs text-green-600 mt-1">Zona Pengiriman: {newAddress.zone}</div>
                      )}
                    </div>
                  )}
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault || false}
                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    className="w-4 h-4 text-[#E00000] border-gray-300 rounded focus:ring-[#E00000]"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                    Jadikan sebagai alamat default
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAddress({
                      label: '',
                      street: '',
                      city: '',
                      cityId: null,
                      province: '',
                      postalCode: '',
                      zone: null,
                      note: '',
                      isDefault: false
                    });
                    setCustomLabel('');
                    setCitySearch('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddAddress}
                  disabled={!(newAddress.label === 'Lainnya' ? customLabel : newAddress.label) || !newAddress.street || !newAddress.city || !newAddress.zone}
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
