"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OngkirAPI } from "../../lib/ongkirApi";
import DeliveryAPI from "../../lib/deliveryApi";
import { useAuth } from "../../lib/authContext";
import Toast from "../common/Toast";

export default function MTTransMultiTabForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
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

  // Scheduled Delivery state
  const [scheduledFormData, setScheduledFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    scheduledDate: '',
    scheduleTimeSlot: '',
    itemName: '',
    weight: '',
    notes: ''
  });
  const [scheduledPrice, setScheduledPrice] = useState(null);

  // Multi-Drop state
  const [multiDropData, setMultiDropData] = useState({
    pickupLocation: '',
    notes: '',
    packageDescription: ''
  });
  const [dropLocations, setDropLocations] = useState([
    { sequence: 1, locationName: '', address: '', recipientName: '', recipientPhone: '', notes: '' },
    { sequence: 2, locationName: '', address: '', recipientName: '', recipientPhone: '', notes: '' }
  ]);
  const [multiDropPrice, setMultiDropPrice] = useState(null);

  // Paket Besar state
  const [paketBesarData, setPaketBesarData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    category: '',
    isFragile: false,
    requiresHelper: false,
    notes: '',
    scheduledDate: '',
    scheduleTimeSlot: ''
  });
  const [paketBesarPrice, setPaketBesarPrice] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

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

  // Scheduled Delivery Handlers
  const handleScheduledSubmit = async () => {
    if (!user) {
      setToast({ message: 'Silakan login terlebih dahulu', type: 'warning' });
      setTimeout(() => router.push('/signin'), 1500);
      return;
    }

    // Validation
    if (!scheduledFormData.pickupLocation || !scheduledFormData.dropoffLocation) {
      setToast({ message: 'Masukkan alamat pickup dan tujuan', type: 'warning' });
      return;
    }
    if (!scheduledFormData.scheduledDate || !scheduledFormData.scheduleTimeSlot) {
      setToast({ message: 'Pilih tanggal dan waktu pengiriman', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pickupLocation: scheduledFormData.pickupLocation,
        dropoffLocation: scheduledFormData.dropoffLocation,
        scheduledDate: scheduledFormData.scheduledDate,
        scheduleTimeSlot: scheduledFormData.scheduleTimeSlot,
        barang: scheduledFormData.itemName ? {
          itemName: scheduledFormData.itemName,
          scale: scheduledFormData.weight
        } : undefined,
        notes: scheduledFormData.notes
      };

      const response = await DeliveryAPI.createScheduledDelivery(payload);
      const date = new Date(scheduledFormData.scheduledDate).toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      setToast({ 
        message: `✅ Jadwal pengiriman berhasil dibuat!\n\n📋 Nomor Pesanan: #${response.data.id}\n📅 Tanggal: ${date}\n⏰ Waktu: ${scheduledFormData.scheduleTimeSlot}`, 
        type: 'success' 
      });
      
      // Reset form
      setScheduledFormData({
        pickupLocation: '',
        dropoffLocation: '',
        scheduledDate: '',
        scheduleTimeSlot: '',
        itemName: '',
        weight: '',
        notes: ''
      });
      setScheduledPrice(null);
    } catch (error) {
      console.error('Error creating scheduled delivery:', error);
      setToast({ 
        message: 'Gagal membuat jadwal pengiriman: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Multi-Drop Handlers
  const addDropLocation = () => {
    if (dropLocations.length >= 10) {
      setToast({ message: 'Maksimal 10 titik tujuan', type: 'warning' });
      return;
    }
    setDropLocations([...dropLocations, {
      sequence: dropLocations.length + 1,
      locationName: '',
      address: '',
      recipientName: '',
      recipientPhone: '',
      notes: ''
    }]);
  };

  const removeDropLocation = (index) => {
    if (dropLocations.length <= 2) {
      setToast({ message: 'Minimal 2 titik tujuan untuk multi-drop', type: 'warning' });
      return;
    }
    const newLocations = dropLocations.filter((_, i) => i !== index);
    // Re-sequence
    newLocations.forEach((loc, idx) => {
      loc.sequence = idx + 1;
    });
    setDropLocations(newLocations);
  };

  const updateDropLocation = (index, field, value) => {
    const newLocations = [...dropLocations];
    newLocations[index][field] = value;
    setDropLocations(newLocations);
  };

  const handleMultiDropSubmit = async () => {
    if (!user) {
      setToast({ message: 'Silakan login terlebih dahulu', type: 'warning' });
      setTimeout(() => router.push('/signin'), 1500);
      return;
    }

    // Validation
    if (!multiDropData.pickupLocation) {
      setToast({ message: 'Masukkan alamat pickup', type: 'warning' });
      return;
    }

    const validLocations = dropLocations.filter(loc => loc.address.trim() !== '');
    if (validLocations.length < 2) {
      setToast({ message: 'Masukkan minimal 2 alamat tujuan', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Estimate distance (5km per drop point as rough estimate)
      const estimatedDistance = validLocations.length * 5;

      const payload = {
        pickupLocation: multiDropData.pickupLocation,
        dropLocations: validLocations,
        estimatedDistance: estimatedDistance,
        notes: multiDropData.notes,
        packageDescription: multiDropData.packageDescription
      };

      const response = await DeliveryAPI.createMultiDrop(payload);
      setToast({ 
        message: `✅ Multi-drop pengiriman berhasil dibuat!\n\n📋 Nomor Pesanan: #${response.data.id}\n📍 Jumlah Titik: ${validLocations.length}\n💰 Total: Rp ${response.data.price.toLocaleString('id-ID')}`, 
        type: 'success' 
      });
      
      // Reset form
      setMultiDropData({
        pickupLocation: '',
        notes: '',
        packageDescription: ''
      });
      setDropLocations([
        { sequence: 1, locationName: '', address: '', recipientName: '', recipientPhone: '', notes: '' },
        { sequence: 2, locationName: '', address: '', recipientName: '', recipientPhone: '', notes: '' }
      ]);
      setMultiDropPrice(null);
    } catch (error) {
      console.error('Error creating multi-drop delivery:', error);
      setToast({ 
        message: 'Gagal membuat multi-drop pengiriman: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Paket Besar Handlers
  const calculateVolumeWeight = () => {
    const { length, width, height } = paketBesarData;
    if (length && width && height) {
      return ((parseFloat(length) * parseFloat(width) * parseFloat(height)) / 5000).toFixed(2);
    }
    return 0;
  };

  const handlePaketBesarSubmit = async () => {
    if (!user) {
      setToast({ message: 'Silakan login terlebih dahulu', type: 'warning' });
      setTimeout(() => router.push('/signin'), 1500);
      return;
    }

    // Validation
    if (!paketBesarData.pickupLocation || !paketBesarData.dropoffLocation) {
      setToast({ message: 'Masukkan alamat pickup dan tujuan', type: 'warning' });
      return;
    }
    if (!paketBesarData.weight || !paketBesarData.length || !paketBesarData.width || !paketBesarData.height) {
      setToast({ message: 'Masukkan dimensi dan berat paket', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pickupLocation: paketBesarData.pickupLocation,
        dropoffLocation: paketBesarData.dropoffLocation,
        weight: parseFloat(paketBesarData.weight),
        length: parseFloat(paketBesarData.length),
        width: parseFloat(paketBesarData.width),
        height: parseFloat(paketBesarData.height),
        category: paketBesarData.category || 'Lainnya',
        isFragile: paketBesarData.isFragile,
        requiresHelper: paketBesarData.requiresHelper,
        notes: paketBesarData.notes,
        scheduledDate: paketBesarData.scheduledDate || undefined,
        scheduleTimeSlot: paketBesarData.scheduleTimeSlot || undefined
      };

      const response = await DeliveryAPI.createPaketBesar(payload);
      const volumeWeight = calculateVolumeWeight();
      const actualWeight = parseFloat(paketBesarData.weight);
      const chargeableWeight = Math.max(actualWeight, parseFloat(volumeWeight));
      
      setToast({ 
        message: `✅ Paket besar berhasil dibuat!\n\n📋 Nomor Pesanan: #${response.data.id}\n📦 Berat Aktual: ${actualWeight} kg\n📏 Berat Volume: ${volumeWeight} kg\n⚖️ Berat Dikenakan: ${chargeableWeight} kg\n💰 Total: Rp ${response.data.price.toLocaleString('id-ID')}`, 
        type: 'success' 
      });
      
      // Reset form
      setPaketBesarData({
        pickupLocation: '',
        dropoffLocation: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        category: '',
        isFragile: false,
        requiresHelper: false,
        notes: '',
        scheduledDate: '',
        scheduleTimeSlot: ''
      });
      setPaketBesarPrice(null);
    } catch (error) {
      console.error('Error creating paket besar delivery:', error);
      setToast({ 
        message: 'Gagal membuat paket besar pengiriman: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
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
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
              <h3 className="font-bold text-lg mb-1">Jadwal Pengiriman</h3>
              <p className="text-sm text-gray-600">
                Atur waktu pengiriman sesuai kebutuhan Anda. Minimal H+1 dari sekarang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-[2.5rem] text-[#E00000] text-xl z-10">
                  location_on
                </span>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Penjemputan</label>
                <input
                  type="text"
                  value={scheduledFormData.pickupLocation}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, pickupLocation: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Masukkan alamat pickup"
                />
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-[2.5rem] text-gray-500 text-xl z-10">
                  my_location
                </span>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Tujuan</label>
                <input
                  type="text"
                  value={scheduledFormData.dropoffLocation}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, dropoffLocation: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Masukkan alamat tujuan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengiriman</label>
                <input
                  type="date"
                  min={minDate}
                  value={scheduledFormData.scheduledDate}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, scheduledDate: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pengiriman</label>
                <select 
                  value={scheduledFormData.scheduleTimeSlot}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, scheduleTimeSlot: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                >
                  <option value="">Pilih Waktu</option>
                  <option value="09:00-12:00">Pagi (09:00 - 12:00)</option>
                  <option value="13:00-17:00">Siang (13:00 - 17:00)</option>
                  <option value="17:00-20:00">Sore/Malam (17:00 - 20:00)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Barang</label>
                <input
                  type="text"
                  value={scheduledFormData.itemName}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, itemName: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Contoh: Dokumen, Pakaian"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={scheduledFormData.weight}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, weight: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
              <textarea
                value={scheduledFormData.notes}
                onChange={(e) => setScheduledFormData({ ...scheduledFormData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                rows="3"
                placeholder="Catatan untuk kurir..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handleScheduledSubmit(); }}
              disabled={loading}
              className={`w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Jadwalkan Pengiriman'}
            </button>
          </div>
        );

      case 'multi-drop':
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
              <h3 className="font-bold text-lg mb-1">Multi Drop</h3>
              <p className="text-sm text-gray-600">
                Kirim ke beberapa alamat dalam satu pengiriman dengan harga lebih hemat (2-10 titik tujuan).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Pickup</label>
              <input
                type="text"
                value={multiDropData.pickupLocation}
                onChange={(e) => setMultiDropData({ ...multiDropData, pickupLocation: e.target.value })}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                placeholder="Masukkan alamat pickup"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Daftar Tujuan ({dropLocations.length} titik)</h4>
                <button
                  type="button"
                  onClick={addDropLocation}
                  className="text-[#E00000] hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Tambah Tujuan
                </button>
              </div>

              <div className="space-y-4">
                {dropLocations.map((location, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">Tujuan #{index + 1}</span>
                      {dropLocations.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeDropLocation(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      )}
                    </div>

              <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                  <input
                          type="text"
                          value={location.locationName}
                          onChange={(e) => updateDropLocation(index, 'locationName', e.target.value)}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                          placeholder="Nama Lokasi (Contoh: Kantor Pusat)"
                  />
                  <input
                          type="text"
                          value={location.address}
                          onChange={(e) => updateDropLocation(index, 'address', e.target.value)}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                          placeholder="Alamat Lengkap *"
                  />
                </div>
                      <div className="grid md:grid-cols-2 gap-3">
                  <input
                          type="text"
                          value={location.recipientName}
                          onChange={(e) => updateDropLocation(index, 'recipientName', e.target.value)}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                          placeholder="Nama Penerima"
                  />
                  <input
                          type="tel"
                          value={location.recipientPhone}
                          onChange={(e) => updateDropLocation(index, 'recipientPhone', e.target.value)}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                          placeholder="No. Telp Penerima"
                        />
                      </div>
                      <input
                        type="text"
                        value={location.notes}
                        onChange={(e) => updateDropLocation(index, 'notes', e.target.value)}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                        placeholder="Catatan untuk titik ini (Opsional)"
                  />
                </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Umum (Opsional)</label>
              <textarea
                value={multiDropData.notes}
                onChange={(e) => setMultiDropData({ ...multiDropData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                rows="2"
                placeholder="Catatan untuk seluruh pengiriman..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handleMultiDropSubmit(); }}
              disabled={loading}
              className={`w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Buat Multi Drop Pengiriman'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              💡 <strong>Info:</strong> Harga dihitung berdasarkan jumlah titik tujuan dan estimasi jarak. Base: Rp 15.000 + Rp 5.000/titik + Rp 2.000/km
            </div>
          </div>
        );

      case 'ekspedisi':
        const volumeWeight = calculateVolumeWeight();
        const tomorrow2 = new Date();
        tomorrow2.setDate(tomorrow2.getDate() + 1);
        const minDate2 = tomorrow2.toISOString().split('T')[0];

        return (
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
              <h3 className="font-bold text-lg mb-1">Paket Besar / Ekspedisi Lokal</h3>
              <p className="text-sm text-gray-600">
                Untuk paket besar, barang berat (&gt;20kg), dan pengiriman komersial. Berat volume dihitung otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-[2.5rem] text-[#E00000] text-xl z-10">
                  location_on
                </span>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Penjemputan</label>
                <input
                  type="text"
                  value={paketBesarData.pickupLocation}
                  onChange={(e) => setPaketBesarData({ ...paketBesarData, pickupLocation: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Alamat Penjemputan"
                />
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-[2.5rem] text-gray-500 text-xl z-10">
                  my_location
                </span>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Tujuan</label>
                <input
                  type="text"
                  value={paketBesarData.dropoffLocation}
                  onChange={(e) => setPaketBesarData({ ...paketBesarData, dropoffLocation: e.target.value })}
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Alamat Tujuan"
                />
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Dimensi & Berat Paket</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Panjang (cm)</label>
                  <input
                    type="number"
                    value={paketBesarData.length}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, length: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Lebar (cm)</label>
                  <input
                    type="number"
                    value={paketBesarData.width}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, width: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tinggi (cm)</label>
                  <input
                    type="number"
                    value={paketBesarData.height}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, height: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Berat (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={paketBesarData.weight}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, weight: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="0"
                  />
                </div>
              </div>
              {volumeWeight > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  📦 <strong>Berat Volume:</strong> {volumeWeight} kg
                  {parseFloat(volumeWeight) > parseFloat(paketBesarData.weight || 0) && (
                    <span className="text-orange-600 ml-2">(Akan digunakan untuk perhitungan)</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Barang</label>
                <select 
                  value={paketBesarData.category}
                  onChange={(e) => setPaketBesarData({ ...paketBesarData, category: e.target.value })}
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                >
                  <option value="">Pilih Jenis Barang</option>
                  <option value="Elektronik">Elektronik</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Dokumen">Dokumen</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Tambahan</label>
                <div className="flex gap-4 h-12 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paketBesarData.isFragile}
                      onChange={(e) => setPaketBesarData({ ...paketBesarData, isFragile: e.target.checked })}
                      className="w-5 h-5 text-[#E00000] rounded focus:ring-[#E00000]"
                    />
                    <span className="text-sm">Barang Fragile (+Rp 10k)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                <input
                      type="checkbox"
                      checked={paketBesarData.requiresHelper}
                      onChange={(e) => setPaketBesarData({ ...paketBesarData, requiresHelper: e.target.checked })}
                      className="w-5 h-5 text-[#E00000] rounded focus:ring-[#E00000]"
                    />
                    <span className="text-sm">Butuh Helper (+Rp 25k)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">schedule</span>
                Jadwalkan Pengiriman (Opsional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal</label>
              <input
                    type="date"
                    min={minDate2}
                    value={paketBesarData.scheduledDate}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, scheduledDate: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Waktu</label>
                  <select 
                    value={paketBesarData.scheduleTimeSlot}
                    onChange={(e) => setPaketBesarData({ ...paketBesarData, scheduleTimeSlot: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  >
                    <option value="">Pilih Waktu</option>
                    <option value="09:00-12:00">Pagi (09:00 - 12:00)</option>
                    <option value="13:00-17:00">Siang (13:00 - 17:00)</option>
                    <option value="17:00-20:00">Sore/Malam (17:00 - 20:00)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
              <textarea
                value={paketBesarData.notes}
                onChange={(e) => setPaketBesarData({ ...paketBesarData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                rows="2"
                placeholder="Catatan untuk kurir..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handlePaketBesarSubmit(); }}
              disabled={loading}
              className={`w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Buat Paket Besar Pengiriman'}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              💡 <strong>Info:</strong> Harga: Rp 20.000 (base) + Rp 3.000/kg × berat terbesar (aktual/volume) + Rp 2.500/km + biaya tambahan
            </div>
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
