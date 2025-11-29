"use client";

import React, { useState, useEffect, useRef } from "react";
import { OngkirAPI } from "@/lib/ongkirApi";

export default function AddressModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingAddress,
  isLoading 
}) {
  const [addressForm, setAddressForm] = useState({
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
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const cityRef = useRef(null);

  // Load address data when editing
  useEffect(() => {
    if (editingAddress) {
      const label = editingAddress.label || '';
      const predefinedLabels = ['Rumah', 'Kantor', 'Kos', 'Apartemen', 'Toko', 'Gudang'];
      const isCustomLabel = !predefinedLabels.includes(label);
      
      setAddressForm({
        label: isCustomLabel ? 'Lainnya' : label,
        recipientName: editingAddress.recipientName || '',
        street: editingAddress.street || '',
        city: editingAddress.city || '',
        cityId: editingAddress.cityId || null,
        province: editingAddress.province || '',
        postalCode: editingAddress.postalCode || '',
        zone: editingAddress.zone || null,
        note: editingAddress.note || '',
        isDefault: editingAddress.isDefault || false
      });
      setCustomLabel(isCustomLabel ? label : '');
      setCitySearch(editingAddress.city || '');
    } else {
      setAddressForm({
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
    }
  }, [editingAddress, isOpen]);

  // Load cities when searching
  useEffect(() => {
    if (citySearch.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setLoadingCities(true);
        setShowCityDropdown(true); // Tampilkan dropdown saat mulai loading
        try {
          const results = await OngkirAPI.getCities(citySearch);
          setCities(results);
          // Tetap tampilkan dropdown meskipun tidak ada hasil (untuk menampilkan pesan "tidak ditemukan")
          setShowCityDropdown(true);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setCities([]);
          setShowCityDropdown(false);
        } finally {
          setLoadingCities(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (citySearch.length === 0) {
      // Jika input kosong, reset
      setCities([]);
      setShowCityDropdown(false);
    } else if (citySearch.length === 1) {
      // Jika hanya 1 karakter, sembunyikan dropdown
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
    setAddressForm({
      ...addressForm,
      city: city.name,
      cityId: city.id,
      province: city.province,
      zone: city.zone,
      postalCode: city.postalCode || ''
    });
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleSubmit = () => {
    // Use custom label if "Lainnya" is selected
    const finalLabel = addressForm.label === 'Lainnya' ? customLabel : addressForm.label;
    
    if (!finalLabel || !addressForm.street || !addressForm.city || !addressForm.zone || !addressForm.recipientName.trim()) {
      return;
    }
    
    onSave({
      ...addressForm,
      label: finalLabel
    });
  };

  const handleCancel = () => {
    setAddressForm({
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
    setCitySearch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#E00000] to-[#B70000] px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">location_on</span>
              {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addressForm.recipientName}
                onChange={(e) => setAddressForm({...addressForm, recipientName: e.target.value})}
                placeholder="Masukkan nama penerima"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Label Alamat <span className="text-red-500">*</span>
              </label>
              <select
                value={addressForm.label}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'Lainnya') {
                    setAddressForm({...addressForm, label: 'Lainnya'});
                  } else {
                    setAddressForm({...addressForm, label: value});
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
              {addressForm.label === 'Lainnya' && (
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
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                value={addressForm.street}
                onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                placeholder="Jalan, No. Rumah, RT/RW"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
              />
            </div>

            <div className="relative" ref={cityRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kota/Kabupaten <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={citySearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setCitySearch(value);
                  if (!value) {
                    setAddressForm({
                      ...addressForm,
                      city: '',
                      cityId: null,
                      province: '',
                      zone: null,
                      postalCode: ''
                    });
                    setShowCityDropdown(false);
                  } else if (value.length >= 2) {
                    // Trigger search jika panjang >= 2
                    setShowCityDropdown(true);
                  }
                }}
                onFocus={() => {
                  // Tampilkan dropdown jika sudah ada hasil atau sedang loading
                  if (cities.length > 0 || loadingCities || citySearch.length >= 2) {
                    setShowCityDropdown(true);
                  }
                }}
                placeholder="Ketik nama kota (contoh: pono, surabaya, jakarta)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
                autoComplete="off"
              />
              
              {showCityDropdown && citySearch.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {loadingCities ? (
                    <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Memuat...
                    </div>
                  ) : cities.length > 0 ? (
                    <>
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCitySelect(city);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer"
                        >
                          <div className="font-semibold text-gray-900">{city.name}</div>
                          <div className="text-sm text-gray-600">{city.province}</div>
                          {city.zone && (
                            <div className="text-xs text-[#E00000] mt-1 font-semibold">Zona {city.zone}</div>
                          )}
                        </button>
                      ))}
                    </>
                  ) : citySearch.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      <span className="material-symbols-outlined text-gray-400">search_off</span>
                      <p className="mt-2">Kota tidak ditemukan</p>
                      <p className="text-xs text-gray-400 mt-1">Coba ketik nama kota yang berbeda</p>
                    </div>
                  ) : null}
                </div>
              )}
              
              {addressForm.city && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-semibold text-green-800">
                    {addressForm.city}, {addressForm.province}
                  </div>
                  {addressForm.zone && (
                    <div className="text-xs text-green-600 mt-1">Zona Pengiriman: {addressForm.zone}</div>
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
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
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
                value={addressForm.note}
                onChange={(e) => setAddressForm({...addressForm, note: e.target.value})}
                placeholder="Patokan, warna rumah, dll"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E00000]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault || false}
                onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                className="w-4 h-4 text-[#E00000] border-gray-300 rounded focus:ring-[#E00000]"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                Jadikan sebagai alamat default
              </label>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !(addressForm.label === 'Lainnya' ? customLabel : addressForm.label) || !addressForm.street || !addressForm.city || !addressForm.zone}
                className="flex-1 px-4 py-3 bg-[#E00000] text-white font-semibold rounded-lg hover:bg-[#B70000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    {editingAddress ? 'Update Alamat' : 'Simpan Alamat'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

