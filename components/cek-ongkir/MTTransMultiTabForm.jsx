"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OngkirAPI } from "../../lib/ongkirApi";

export default function MTTransMultiTabForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('lacak');
  const [trackingNumbers, setTrackingNumbers] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  
  // Ongkir form state
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  
  // Autocomplete state
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const originRef = useRef(null);
  const destRef = useRef(null);
  
  const [formData, setFormData] = useState({
    weight: '',
    service: ''
  });

  const tabs = [
    { id: 'lacak', label: 'Lacak', icon: 'search' },
    { id: 'cek-ongkir', label: 'Cek ongkir', icon: 'attach_money' },
    { id: 'jadwal', label: 'Jadwal Pengiriman', icon: 'schedule' },
    { id: 'multi-drop', label: 'Multi Drop', icon: 'place' },
    { id: 'ekspedisi', label: 'Paket Besar/Ekspedisi Lokal', icon: 'local_shipping' }
  ];

  // Set active tab from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam && tabs.some(tab => tab.id === tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Load cities and services on mount
  useEffect(() => {
    loadCitiesAndServices();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setShowDestDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCitiesAndServices = async () => {
    try {
      const [citiesData, servicesData] = await Promise.all([
        OngkirAPI.getCities(),
        OngkirAPI.getServices()
      ]);
      setCities(citiesData);
      setServices(servicesData.filter(s => s.status === 'active'));
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data. Silakan refresh halaman.');
    }
  };

  const handleOriginSearch = (value) => {
    setOriginSearch(value);
    setShowOriginDropdown(true);
    setSelectedOrigin(null);
  };

  const handleDestSearch = (value) => {
    setDestSearch(value);
    setShowDestDropdown(true);
    setSelectedDest(null);
  };

  const selectOrigin = (city) => {
    setSelectedOrigin(city);
    setOriginSearch(`${city.name}, ${city.province}`);
    setShowOriginDropdown(false);
  };

  const selectDest = (city) => {
    setSelectedDest(city);
    setDestSearch(`${city.name}, ${city.province}`);
    setShowDestDropdown(false);
  };

  const filteredOriginCities = cities.filter(city =>
    city.name.toLowerCase().includes(originSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(originSearch.toLowerCase())
  ).slice(0, 10);

  const filteredDestCities = cities.filter(city =>
    city.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(destSearch.toLowerCase())
  ).slice(0, 10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrackingChange = (e) => {
    const value = e.target.value;
    setTrackingNumbers(value);
    // Count tracking numbers (separated by comma, space, or newline)
    const count = value.split(/[,\s\n]+/).filter(num => num.trim().length > 0).length;
    setAddedCount(count);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'cek-ongkir') {
      await handleCalculateOngkir();
    } else {
      console.log('Form submitted:', { activeTab, formData, trackingNumbers });
    }
  };

  const handleCalculateOngkir = async () => {
    // Validation
    if (!selectedOrigin) {
      alert('Pilih kota asal terlebih dahulu');
      return;
    }
    if (!selectedDest) {
      alert('Pilih kota tujuan terlebih dahulu');
      return;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      alert('Masukkan berat paket (minimal 0.1 kg)');
      return;
    }
    if (!formData.service) {
      alert('Pilih jenis layanan');
      return;
    }

    setLoading(true);
    setCalculationResult(null);

    try {
      const result = await OngkirAPI.calculateShippingCost({
        originCityId: selectedOrigin.id,
        destCityId: selectedDest.id,
        serviceId: parseInt(formData.service),
        weight: parseFloat(formData.weight)
      });

      setCalculationResult(result);
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      alert('Gagal menghitung ongkir: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'lacak':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nomor resi atau STT</h3>
              <p className="text-sm text-gray-500 mb-4">
                Lacak maks. 5 STT. Pisahkan dengan koma/spasi atau langsung salin, tempel dan tekan enter.
              </p>
              <div className="relative">
                <textarea
                  className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000] resize-none"
                  placeholder="Masukan nomor resi atau STT"
                  value={trackingNumbers}
                  onChange={handleTrackingChange}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{addedCount} ditambahkan</span>
                  <button
                    type="submit"
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Lacak sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cek-ongkir':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin City Autocomplete */}
              <div className="relative" ref={originRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota Asal</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl z-10">
                    location_on
                  </span>
                  <input
                    type="text"
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota asal..."
                    value={originSearch}
                    onChange={(e) => handleOriginSearch(e.target.value)}
                    onFocus={() => setShowOriginDropdown(true)}
                  />
                </div>
                {showOriginDropdown && originSearch && filteredOriginCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOriginCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectOrigin(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.province} • {city.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination City Autocomplete */}
              <div className="relative" ref={destRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kota Tujuan</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl z-10">
                    my_location
                  </span>
                  <input
                    type="text"
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota tujuan..."
                    value={destSearch}
                    onChange={(e) => handleDestSearch(e.target.value)}
                    onFocus={() => setShowDestDropdown(true)}
                  />
                </div>
                {showDestDropdown && destSearch && filteredDestCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDestCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectDest(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.province} • {city.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Contoh: 1.5"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
                <select
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Layanan</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.estimasi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Menghitung...' : 'Cek Ongkir'}
            </button>

            {/* Calculation Result */}
            {calculationResult && (
              <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  Hasil Perhitungan Ongkir
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Asal</p>
                    <p className="font-semibold text-gray-900">{calculationResult.originCity.name}</p>
                    <p className="text-xs text-gray-500">{calculationResult.originCity.province}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Zona {calculationResult.originCity.zone}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tujuan</p>
                    <p className="font-semibold text-gray-900">{calculationResult.destCity.name}</p>
                    <p className="text-xs text-gray-500">{calculationResult.destCity.province}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Zona {calculationResult.destCity.zone}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Layanan:</span>
                    <span className="font-semibold">{calculationResult.service.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Berat:</span>
                    <span className="font-semibold">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Estimasi:</span>
                    <span className="font-semibold text-blue-600">{calculationResult.service.estimasi}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total Ongkir:</span>
                    <span className="text-2xl font-bold text-[#E00000]">
                      Rp {(calculationResult.total || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Info:</strong> Tarif dihitung berdasarkan zona (Rp {(calculationResult.baseTariff || 0).toLocaleString('id-ID')}/kg × {formData.weight} kg = Rp {(calculationResult.subtotal || 0).toLocaleString('id-ID')}) × faktor layanan ({calculationResult.serviceMultiplier || 1}x)
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'jadwal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengiriman</label>
                <input
                  type="date"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pengiriman</label>
                <select className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]">
                  <option value="">Pilih Waktu</option>
                  <option value="08:00-12:00">08:00 - 12:00</option>
                  <option value="12:00-16:00">12:00 - 16:00</option>
                  <option value="16:00-20:00">16:00 - 20:00</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl">
                  location_on
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Alamat Penjemputan"
                />
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  my_location
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Alamat Tujuan"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Jadwalkan Pengiriman
            </button>
          </div>
        );

      case 'multi-drop':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Multi Drop:</strong> Kirim ke beberapa alamat dalam satu pengiriman dengan harga lebih hemat.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Daftar Tujuan</h4>
                <button
                  type="button"
                  className="text-[#E00000] hover:text-red-700 text-sm font-medium"
                >
                  + Tambah Tujuan
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Alamat Tujuan 1"
                  />
                  <input
                    className="w-24 h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Berat (kg)"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Alamat Tujuan 2"
                  />
                  <input
                    className="w-24 h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Berat (kg)"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Hitung Multi Drop
            </button>
          </div>
        );

      case 'ekspedisi':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Ekspedisi Lokal:</strong> Untuk paket besar, barang berat, dan pengiriman komersial.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Barang</label>
                <select className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]">
                  <option value="">Pilih Jenis Barang</option>
                  <option value="elektronik">Elektronik</option>
                  <option value="furniture">Furniture</option>
                  <option value="makanan">Makanan</option>
                  <option value="dokumen">Dokumen</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dimensi (PxLxT cm)</label>
                <input
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="30x20x10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat (kg)</label>
                <input
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="5.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Barang (Rp)</label>
                <input
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="1000000"
                />
              </div>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl">
                location_on
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                placeholder="Alamat Penjemputan"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                my_location
              </span>
              <input
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                placeholder="Alamat Tujuan"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Cek Ekspedisi
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-16 lg:py-24 px-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {renderTabContent()}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
