"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OngkirAPI } from "../../lib/ongkirApi";
import DeliveryAPI from "../../lib/deliveryApi";
import { useAuth } from "../../lib/authContext";
import { OrderAPI } from "../../lib/orderApi";
import { useToast } from "../common/ToastProvider";

export default function MTTransMultiTabForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState('lacak');
  const [trackingNumbers, setTrackingNumbers] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  const [trackingResults, setTrackingResults] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  
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
    pickupAddress: '',
    dropoffLocation: '',
    dropoffAddress: '',
    serviceId: '',
    scheduledDate: '',
    scheduleTimeSlot: '',
    itemName: '',
    weight: '',
    notes: ''
  });
  const [scheduledPrice, setScheduledPrice] = useState(null);
  
  // Scheduled Delivery autocomplete state
  const [scheduledPickupSearch, setScheduledPickupSearch] = useState('');
  const [scheduledDestSearch, setScheduledDestSearch] = useState('');
  const [selectedScheduledPickup, setSelectedScheduledPickup] = useState(null);
  const [selectedScheduledDest, setSelectedScheduledDest] = useState(null);
  const [showScheduledPickupDropdown, setShowScheduledPickupDropdown] = useState(false);
  const [showScheduledDestDropdown, setShowScheduledDestDropdown] = useState(false);
  const scheduledPickupRef = useRef(null);
  const scheduledDestRef = useRef(null);

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
  
  // Paket Besar autocomplete state
  const [paketBesarPickupSearch, setPaketBesarPickupSearch] = useState('');
  const [paketBesarDestSearch, setPaketBesarDestSearch] = useState('');
  const [selectedPaketBesarPickup, setSelectedPaketBesarPickup] = useState(null);
  const [selectedPaketBesarDest, setSelectedPaketBesarDest] = useState(null);
  const [showPaketBesarPickupDropdown, setShowPaketBesarPickupDropdown] = useState(false);
  const [showPaketBesarDestDropdown, setShowPaketBesarDestDropdown] = useState(false);
  const paketBesarPickupRef = useRef(null);
  const paketBesarDestRef = useRef(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const tabs = [
    { id: 'lacak', label: 'Lacak', icon: 'search' },
    { id: 'cek-ongkir', label: 'Cek ongkir', icon: 'attach_money' },
    { id: 'jadwal', label: 'Jadwal Pengiriman', icon: 'schedule' },
    { id: 'multi-drop', label: 'Multi Drop', icon: 'place' },
    { id: 'ekspedisi', label: 'Paket Besar/Ekspedisi Lokal', icon: 'local_shipping' }
  ];

  // Tab yang bisa diakses tanpa login
  const PUBLIC_TABS = ['lacak', 'cek-ongkir'];

  // Handle tab click dengan pengecekan autentikasi
  const handleTabClick = (tabId) => {
    // Cek apakah tab memerlukan login
    const requiresLogin = !PUBLIC_TABS.includes(tabId);
    
    if (requiresLogin && !user) {
      // Simpan URL saat ini untuk redirect setelah login
      sessionStorage.setItem('returnUrl', `/cek-ongkir?tab=${tabId}`);
      router.push('/signin');
      return;
    }

    // Update active tab dan URL
    setActiveTab(tabId);
    const newUrl = `/cek-ongkir?tab=${tabId}`;
    router.push(newUrl);
  };

  // Set active tab from URL parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam && tabs.some(tab => tab.id === tabParam)) {
        const requiresLogin = !PUBLIC_TABS.includes(tabParam);
        
        // Jika tab memerlukan login dan user belum login, redirect ke login
        if (requiresLogin && !user) {
          sessionStorage.setItem('returnUrl', `/cek-ongkir?tab=${tabParam}`);
          router.push('/signin');
          return;
        }
        
        setActiveTab(tabParam);
      } else if (!tabParam) {
        // Jika tidak ada tab parameter, set default ke 'lacak'
        setActiveTab('lacak');
        router.push('/cek-ongkir?tab=lacak');
      }
    }
  }, [searchParams, user, router]);

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
      if (scheduledPickupRef.current && !scheduledPickupRef.current.contains(event.target)) {
        setShowScheduledPickupDropdown(false);
      }
      if (scheduledDestRef.current && !scheduledDestRef.current.contains(event.target)) {
        setShowScheduledDestDropdown(false);
      }
      if (paketBesarPickupRef.current && !paketBesarPickupRef.current.contains(event.target)) {
        setShowPaketBesarPickupDropdown(false);
      }
      if (paketBesarDestRef.current && !paketBesarDestRef.current.contains(event.target)) {
        setShowPaketBesarDestDropdown(false);
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
      showError('Gagal memuat data. Silakan refresh halaman.');
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

  // Scheduled Delivery autocomplete handlers
  const handleScheduledPickupSearch = (value) => {
    setScheduledPickupSearch(value);
    setShowScheduledPickupDropdown(true);
    setSelectedScheduledPickup(null);
  };

  const handleScheduledDestSearch = (value) => {
    setScheduledDestSearch(value);
    setShowScheduledDestDropdown(true);
    setSelectedScheduledDest(null);
  };

  const selectScheduledPickup = (city) => {
    setSelectedScheduledPickup(city);
    setScheduledPickupSearch(`${city.name}, ${city.province}`);
    setShowScheduledPickupDropdown(false);
    setScheduledFormData(prev => ({ ...prev, pickupLocation: `${city.name}, ${city.province}` }));
  };

  const selectScheduledDest = (city) => {
    setSelectedScheduledDest(city);
    setScheduledDestSearch(`${city.name}, ${city.province}`);
    setShowScheduledDestDropdown(false);
    setScheduledFormData(prev => ({ ...prev, dropoffLocation: `${city.name}, ${city.province}` }));
  };

  const filteredScheduledPickupCities = cities.filter(city =>
    city.name.toLowerCase().includes(scheduledPickupSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(scheduledPickupSearch.toLowerCase())
  ).slice(0, 10);

  const filteredScheduledDestCities = cities.filter(city =>
    city.name.toLowerCase().includes(scheduledDestSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(scheduledDestSearch.toLowerCase())
  ).slice(0, 10);

  // Paket Besar autocomplete handlers
  const handlePaketBesarPickupSearch = (value) => {
    setPaketBesarPickupSearch(value);
    setShowPaketBesarPickupDropdown(true);
    setSelectedPaketBesarPickup(null);
  };

  const handlePaketBesarDestSearch = (value) => {
    setPaketBesarDestSearch(value);
    setShowPaketBesarDestDropdown(true);
    setSelectedPaketBesarDest(null);
  };

  const selectPaketBesarPickup = (city) => {
    setSelectedPaketBesarPickup(city);
    setPaketBesarPickupSearch(`${city.name}, ${city.province}`);
    setShowPaketBesarPickupDropdown(false);
    setPaketBesarData({ ...paketBesarData, pickupLocation: `${city.name}, ${city.province}` });
  };

  const selectPaketBesarDest = (city) => {
    setSelectedPaketBesarDest(city);
    setPaketBesarDestSearch(`${city.name}, ${city.province}`);
    setShowPaketBesarDestDropdown(false);
    setPaketBesarData({ ...paketBesarData, dropoffLocation: `${city.name}, ${city.province}` });
  };

  const filteredPaketBesarPickupCities = cities.filter(city =>
    city.name.toLowerCase().includes(paketBesarPickupSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(paketBesarPickupSearch.toLowerCase())
  ).slice(0, 10);

  const filteredPaketBesarDestCities = cities.filter(city =>
    city.name.toLowerCase().includes(paketBesarDestSearch.toLowerCase()) ||
    city.province.toLowerCase().includes(paketBesarDestSearch.toLowerCase())
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
    } else if (activeTab === 'lacak') {
      await handleTrackOrders();
    } else {
      console.log('Form submitted:', { activeTab, formData, trackingNumbers });
    }
  };

  const handleTrackOrders = async () => {
    if (!trackingNumbers.trim()) {
      setToast({ message: 'Masukkan nomor resi terlebih dahulu', type: 'error' });
      return;
    }

    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResults([]);

    try {
      // Parse tracking numbers (support comma, space, or newline separated)
      const numbers = trackingNumbers
        .split(/[,\s\n]+/)
        .map(num => num.trim())
        .filter(num => num.length > 0)
        .slice(0, 5); // Max 5 resi

      if (numbers.length === 0) {
        setToast({ message: 'Masukkan nomor resi yang valid', type: 'error' });
        setTrackingLoading(false);
        return;
      }

      // Track all numbers - support both orderNumber (MT-XXXXXX) and delivery resiCode (MT-DEL-XXXXXX)
      const results = await Promise.allSettled(
        numbers.map(async (num) => {
          // Check if it's a delivery resiCode (MT-DEL-XXXXXX)
          if (num.startsWith('MT-DEL-')) {
            return await DeliveryAPI.trackDelivery(num);
          } else {
            // Otherwise, treat as orderNumber
            return await OrderAPI.trackOrderPublic(num);
          }
        })
      );

      const successful = [];
      const failed = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        } else {
          failed.push({ number: numbers[index], error: result.reason.message });
        }
      });

      setTrackingResults(successful);
      
      if (failed.length > 0) {
        setTrackingError(`Beberapa resi tidak ditemukan: ${failed.map(f => f.number).join(', ')}`);
      }

      if (successful.length > 0) {
        setToast({ 
          message: `Berhasil melacak ${successful.length} resi`, 
          type: 'success' 
        });
      }
    } catch (error) {
      setTrackingError(error.message || 'Gagal melacak resi');
      setToast({ message: error.message || 'Gagal melacak resi', type: 'error' });
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCalculateOngkir = async () => {
    // Validation
    if (!selectedOrigin) {
      showError('Pilih kota asal terlebih dahulu');
      return;
    }
    if (!selectedDest) {
      showError('Pilih kota tujuan terlebih dahulu');
      return;
    }
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      showError('Masukkan berat paket (minimal 0.1 kg)');
      return;
    }
    if (!formData.service) {
      showError('Pilih jenis layanan');
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
      showError('Gagal menghitung ongkir: ' + error.message);
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
    if (!selectedScheduledPickup || !selectedScheduledDest) {
      setToast({ message: 'Pilih kota penjemputan dan tujuan dari autocomplete', type: 'warning' });
      return;
    }
    if (!scheduledFormData.pickupAddress.trim() || !scheduledFormData.dropoffAddress.trim()) {
      setToast({ message: 'Lengkapi detail alamat penjemputan dan tujuan', type: 'warning' });
      return;
    }
    if (!scheduledFormData.serviceId) {
      setToast({ message: 'Pilih jenis layanan terlebih dahulu', type: 'warning' });
      return;
    }
    if (!scheduledFormData.scheduledDate || !scheduledFormData.scheduleTimeSlot) {
      setToast({ message: 'Pilih tanggal dan waktu pengiriman', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const pickupCityLabel = selectedScheduledPickup ? `${selectedScheduledPickup.name}, ${selectedScheduledPickup.province}` : scheduledFormData.pickupLocation;
      const dropoffCityLabel = selectedScheduledDest ? `${selectedScheduledDest.name}, ${selectedScheduledDest.province}` : scheduledFormData.dropoffLocation;
      const pickupLocationCombined = `${scheduledFormData.pickupAddress.trim()} • ${pickupCityLabel}`;
      const dropoffLocationCombined = `${scheduledFormData.dropoffAddress.trim()} • ${dropoffCityLabel}`;
      const selectedService = services.find((service) => String(service.id) === scheduledFormData.serviceId);

      const notesParts = [];
      if (selectedService) {
        notesParts.push(`Jenis Layanan: ${selectedService.name}${selectedService.estimasi ? ` (${selectedService.estimasi})` : ''}`);
      }
      if (scheduledFormData.notes.trim()) {
        notesParts.push(scheduledFormData.notes.trim());
      }

      const payload = {
        pickupLocation: pickupLocationCombined,
        dropoffLocation: dropoffLocationCombined,
        scheduledDate: scheduledFormData.scheduledDate,
        scheduleTimeSlot: scheduledFormData.scheduleTimeSlot,
        zone: selectedScheduledDest?.zone || undefined, // Add zone from selected destination city
        barang: scheduledFormData.itemName ? {
          itemName: scheduledFormData.itemName,
          scale: scheduledFormData.weight
        } : undefined,
        notes: notesParts.length ? notesParts.join('\n') : undefined
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
        pickupAddress: '',
        dropoffLocation: '',
        dropoffAddress: '',
        serviceId: '',
        scheduledDate: '',
        scheduleTimeSlot: '',
        itemName: '',
        weight: '',
        notes: ''
      });
      setScheduledPrice(null);
      // Reset autocomplete
      setScheduledPickupSearch('');
      setScheduledDestSearch('');
      setSelectedScheduledPickup(null);
      setSelectedScheduledDest(null);
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
    if (!selectedPaketBesarPickup || !selectedPaketBesarDest) {
      setToast({ message: 'Pilih kota penjemputan dan tujuan dari autocomplete', type: 'warning' });
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
        zone: selectedPaketBesarDest?.zone || undefined, // Add zone from selected destination city
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
      // Reset autocomplete
      setPaketBesarPickupSearch('');
      setPaketBesarDestSearch('');
      setSelectedPaketBesarPickup(null);
      setSelectedPaketBesarDest(null);
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
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Cek Resi / Lacak Pesanan</h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Lacak maks. 5 resi. Pisahkan dengan koma/spasi atau langsung salin, tempel dan tekan enter.
                <br />
                Format Pengiriman: <span className="font-mono font-semibold">MT-DEL-XXXXXX</span> (contoh: MT-DEL-A1B2C3)
                <br />
                Format Pesanan Makanan: <span className="font-mono font-semibold">MT-XXXXXX</span> (contoh: MT-A1B2C3)
              </p>
              <div className="relative">
                <textarea
                  className="w-full min-h-[96px] p-3 sm:p-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000] resize-none uppercase font-mono text-xs sm:text-sm"
                  placeholder="Masukan nomor resi (contoh: MT-DEL-A1B2C3, MT-A1B2C3, atau multiple: MT-DEL-A1B2C3 MT-A1B2C3)"
                  value={trackingNumbers}
                  onChange={handleTrackingChange}
                  aria-label="Input nomor resi untuk dilacak"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{addedCount} resi ditambahkan</span>
                  <button
                    type="submit"
                    disabled={trackingLoading || !trackingNumbers.trim()}
                    className="min-h-[44px] bg-[#E00000] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Lacak nomor resi"
                  >
                    {trackingLoading ? 'Melacak...' : 'Lacak sekarang'}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {trackingError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{trackingError}</p>
              </div>
            )}

            {/* Tracking Results */}
            {trackingResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Hasil Pelacakan</h4>
                {trackingResults.map((item, index) => {
                  // Check if it's a delivery (has resiCode) or order (has orderNumber)
                  const isDelivery = item.resiCode || item.type;
                  const trackingCode = isDelivery ? (item.resiCode || `MT-DEL-${String(item.id).padStart(6, '0')}`) : (item.orderNumber || `MT-${String(item.id).padStart(6, '0')}`);
                  
                  return (
                    <div key={item.id || index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h5 className="text-lg font-bold text-gray-900 font-mono">{trackingCode}</h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {isDelivery && item.type && (
                            <p className="text-xs text-gray-500 mt-1 capitalize">{item.type.replace('_', ' ')}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          item.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                          item.status === 'picked_up' ? 'bg-indigo-100 text-indigo-800' :
                          item.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'delivering' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'delivered' ? 'Terkirim' :
                           item.status === 'in_transit' ? 'Dalam Perjalanan' :
                           item.status === 'picked_up' ? 'Diambil' :
                           item.status === 'accepted' ? 'Diterima' :
                           item.status === 'delivering' ? 'Dikirim' :
                           item.status === 'preparing' ? 'Diproses' :
                           item.status === 'cancelled' ? 'Dibatalkan' :
                           item.status === 'pending' ? 'Pending' :
                           'Menunggu'}
                        </span>
                      </div>

                      {/* Delivery Info */}
                      {isDelivery ? (
                        <>
                          {item.user && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">Customer:</p>
                              <p className="font-semibold text-gray-900">{item.user.fullName || item.user.email}</p>
                            </div>
                          )}
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">Alamat Penjemputan:</p>
                            <p className="text-gray-900">{item.pickupLocation}</p>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600">Alamat Tujuan:</p>
                            <p className="text-gray-900">{item.dropoffLocation}</p>
                            {item.scheduledDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Jadwal: {new Date(item.scheduledDate).toLocaleDateString('id-ID')} {item.scheduleTimeSlot}
                              </p>
                            )}
                          </div>

                          {item.barang && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">Barang:</p>
                              <p className="text-gray-900">{item.barang.itemName} ({item.barang.scale})</p>
                            </div>
                          )}

                          {item.packageDetails && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">Detail Paket:</p>
                              <p className="text-gray-900">
                                {item.packageDetails.weight} kg • {item.packageDetails.length}×{item.packageDetails.width}×{item.packageDetails.height} cm
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Order Info */}
                          {item.restaurant && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">Restaurant:</p>
                              <p className="font-semibold text-gray-900">{item.restaurant.name}</p>
                            </div>
                          )}

                          {item.items && item.items.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-1">Items:</p>
                              <div className="space-y-1">
                                {item.items.map((orderItem, idx) => (
                                  <div key={idx} className="text-sm text-gray-900">
                                    {orderItem.menuName} x {orderItem.quantity}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mb-3">
                            <p className="text-sm text-gray-600">Alamat Pengiriman:</p>
                            <p className="text-gray-900">{item.deliveryAddress}</p>
                          </div>
                        </>
                      )}

                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="text-lg font-bold text-[#E00000]">
                            Rp {Math.round(item.price || item.total || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  className="w-full min-h-[44px] h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota asal..."
                    value={originSearch}
                    onChange={(e) => handleOriginSearch(e.target.value)}
                    onFocus={() => setShowOriginDropdown(true)}
                    aria-label="Pilih kota asal"
                  />
                </div>
                {showOriginDropdown && originSearch && filteredOriginCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOriginCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectOrigin(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
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
                  className="w-full min-h-[44px] h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota tujuan..."
                    value={destSearch}
                    onChange={(e) => handleDestSearch(e.target.value)}
                    onFocus={() => setShowDestDropdown(true)}
                    aria-label="Pilih kota tujuan"
                  />
                </div>
                {showDestDropdown && destSearch && filteredDestCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDestCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectDest(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
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
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                  placeholder="Contoh: 1.5"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  aria-label="Berat paket dalam kilogram"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
                <select
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000] bg-white"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  aria-label="Pilih jenis layanan pengiriman"
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
              className={`w-full min-h-[44px] bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={loading ? 'Menghitung ongkir...' : 'Cek ongkir'}
            >
              {loading ? 'Menghitung...' : 'Cek Ongkir'}
            </button>

            {/* Calculation Result */}
            {calculationResult && (
              <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  Hasil Perhitungan Ongkir
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Asal</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">{calculationResult.originCity.name}</p>
                    <p className="text-xs text-gray-500 break-words">{calculationResult.originCity.province}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Zona {calculationResult.originCity.zone}</p>
                  </div>
                  
                  <div className="bg-white p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Tujuan</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">{calculationResult.destCity.name}</p>
                    <p className="text-xs text-gray-500 break-words">{calculationResult.destCity.province}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">Zona {calculationResult.destCity.zone}</p>
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Layanan:</span>
                    <span className="font-semibold break-words text-right">{calculationResult.service.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Berat:</span>
                    <span className="font-semibold">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Estimasi:</span>
                    <span className="font-semibold text-blue-600 break-words text-right">{calculationResult.service.estimasi}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Total Ongkir:</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#E00000] break-words">
                      Rp {(calculationResult.total || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-blue-800 break-words">
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
              {/* Alamat Penjemputan Autocomplete */}
              <div className="relative" ref={scheduledPickupRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Penjemputan</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl z-10">
                  location_on
                </span>
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota penjemputan..."
                    value={scheduledPickupSearch}
                    onChange={(e) => handleScheduledPickupSearch(e.target.value)}
                    onFocus={() => setShowScheduledPickupDropdown(true)}
                />
              </div>
                {showScheduledPickupDropdown && scheduledPickupSearch && filteredScheduledPickupCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredScheduledPickupCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectScheduledPickup(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.province} • {city.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alamat Tujuan Autocomplete */}
              <div className="relative" ref={scheduledDestRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Tujuan</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl z-10">
                  my_location
                </span>
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota tujuan..."
                    value={scheduledDestSearch}
                    onChange={(e) => handleScheduledDestSearch(e.target.value)}
                    onFocus={() => setShowScheduledDestDropdown(true)}
                />
              </div>
                {showScheduledDestDropdown && scheduledDestSearch && filteredScheduledDestCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredScheduledDestCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectScheduledDest(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Detail Alamat Penjemputan</label>
                <textarea
                  value={scheduledFormData.pickupAddress}
                  onChange={(e) => setScheduledFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                  className="w-full min-h-[44px] px-4 py-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                  placeholder="Nama jalan, nomor rumah, patokan..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detail Alamat Tujuan</label>
                <textarea
                  value={scheduledFormData.dropoffAddress}
                  onChange={(e) => setScheduledFormData(prev => ({ ...prev, dropoffAddress: e.target.value }))}
                  className="w-full min-h-[44px] px-4 py-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                  placeholder="Nama jalan, nomor rumah, patokan..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
              <select
                value={scheduledFormData.serviceId}
                onChange={(e) => setScheduledFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
              >
                <option value="">Pilih jenis layanan</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} {service.estimasi ? `- ${service.estimasi}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengiriman</label>
                <input
                  type="date"
                  min={minDate}
                  value={scheduledFormData.scheduledDate}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, scheduledDate: e.target.value })}
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Pengiriman</label>
                <select 
                  value={scheduledFormData.scheduleTimeSlot}
                  onChange={(e) => setScheduledFormData({ ...scheduledFormData, scheduleTimeSlot: e.target.value })}
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
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
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
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
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
              <textarea
                value={scheduledFormData.notes}
                onChange={(e) => setScheduledFormData({ ...scheduledFormData, notes: e.target.value })}
                className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                rows="3"
                placeholder="Catatan untuk kurir..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handleScheduledSubmit(); }}
              disabled={loading}
              className={`w-full min-h-[44px] bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Jadwalkan Pengiriman'}
            </button>
          </div>
        );

      case 'multi-drop':
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 bg-green-50">
              <h3 className="font-bold text-base sm:text-lg mb-1">Multi Drop</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Kirim ke beberapa alamat dalam satu pengiriman dengan harga lebih hemat (2-10 titik tujuan).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Pickup</label>
              <input
                type="text"
                value={multiDropData.pickupLocation}
                onChange={(e) => setMultiDropData({ ...multiDropData, pickupLocation: e.target.value })}
                className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                placeholder="Masukkan alamat pickup"
                aria-label="Alamat pickup untuk multi drop"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Daftar Tujuan ({dropLocations.length} titik)</h4>
                <button
                  type="button"
                  onClick={addDropLocation}
                  className="min-h-[44px] text-[#E00000] hover:text-red-700 text-sm font-semibold flex items-center gap-1 px-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
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
                          className="min-w-[44px] min-h-[44px] text-red-600 hover:text-red-800 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                          aria-label={`Hapus tujuan ${index + 1}`}
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
                          className="w-full min-h-[44px] h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                          placeholder="Nama Lokasi (Contoh: Kantor Pusat)"
                          aria-label={`Nama lokasi tujuan ${index + 1}`}
                  />
                  <input
                          type="text"
                          value={location.address}
                          onChange={(e) => updateDropLocation(index, 'address', e.target.value)}
                          className="w-full min-h-[44px] h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                          placeholder="Alamat Lengkap *"
                          aria-label={`Alamat lengkap tujuan ${index + 1}`}
                  />
                </div>
                      <div className="grid md:grid-cols-2 gap-3">
                  <input
                          type="text"
                          value={location.recipientName}
                          onChange={(e) => updateDropLocation(index, 'recipientName', e.target.value)}
                          className="w-full min-h-[44px] h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                          placeholder="Nama Penerima"
                          aria-label={`Nama penerima tujuan ${index + 1}`}
                  />
                  <input
                          type="tel"
                          value={location.recipientPhone}
                          onChange={(e) => updateDropLocation(index, 'recipientPhone', e.target.value)}
                          className="w-full min-h-[44px] h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                          placeholder="No. Telp Penerima"
                          aria-label={`Nomor telepon penerima tujuan ${index + 1}`}
                        />
                      </div>
                      <input
                        type="text"
                        value={location.notes}
                        onChange={(e) => updateDropLocation(index, 'notes', e.target.value)}
                        className="w-full min-h-[44px] h-10 px-3 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                        placeholder="Catatan untuk titik ini (Opsional)"
                        aria-label={`Catatan untuk tujuan ${index + 1}`}
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
                className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                rows="2"
                placeholder="Catatan untuk seluruh pengiriman..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handleMultiDropSubmit(); }}
              disabled={loading}
              className={`w-full min-h-[44px] bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <div className="border-l-4 border-orange-500 pl-3 sm:pl-4 py-2 bg-orange-50">
              <h3 className="font-bold text-base sm:text-lg mb-1">Paket Besar / Ekspedisi Lokal</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Untuk paket besar, barang berat (&gt;20kg), dan pengiriman komersial. Berat volume dihitung otomatis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alamat Penjemputan Autocomplete */}
              <div className="relative" ref={paketBesarPickupRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Penjemputan</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl z-10">
                  location_on
                </span>
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota penjemputan..."
                    value={paketBesarPickupSearch}
                    onChange={(e) => handlePaketBesarPickupSearch(e.target.value)}
                    onFocus={() => setShowPaketBesarPickupDropdown(true)}
                />
              </div>
                {showPaketBesarPickupDropdown && paketBesarPickupSearch && filteredPaketBesarPickupCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPaketBesarPickupCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectPaketBesarPickup(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.province} • {city.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alamat Tujuan Autocomplete */}
              <div className="relative" ref={paketBesarDestRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Tujuan</label>
              <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl z-10">
                  my_location
                </span>
                <input
                  type="text"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                    placeholder="Ketik nama kota tujuan..."
                    value={paketBesarDestSearch}
                    onChange={(e) => handlePaketBesarDestSearch(e.target.value)}
                    onFocus={() => setShowPaketBesarDestDropdown(true)}
                  />
                </div>
                {showPaketBesarDestDropdown && paketBesarDestSearch && filteredPaketBesarDestCities.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPaketBesarDestCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => selectPaketBesarDest(city)}
                        className="min-h-[44px] px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 focus:outline-none focus:bg-gray-100"
                      >
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.province} • {city.type}</div>
                      </div>
                    ))}
                  </div>
                )}
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
                  className="w-full min-h-[44px] h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
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
                className="w-full min-h-[44px] px-4 py-2 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-2 focus:ring-[#E00000]"
                rows="2"
                placeholder="Catatan untuk kurir..."
              />
            </div>

            <button
              onClick={(e) => { e.preventDefault(); handlePaketBesarSubmit(); }}
              disabled={loading}
              className={`w-full min-h-[44px] bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    <div className="w-full flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#E00000] focus:ring-inset ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-label={tab.label}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="material-symbols-outlined text-base sm:text-lg">{tab.icon}</span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
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
    </div>
  );
}
