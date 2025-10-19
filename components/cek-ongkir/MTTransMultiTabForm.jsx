"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function MTTransMultiTabForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('lacak');
  const [trackingNumbers, setTrackingNumbers] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { activeTab, formData, trackingNumbers });
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
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#E00000] text-xl">
                  location_on
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Kota Asal"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  my_location
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="Kota Tujuan"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Berat (kg)</label>
                <input
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#E00000] focus:ring-1 focus:ring-[#E00000]"
                  placeholder="0.5"
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
                  <option value="reguler">Reguler</option>
                  <option value="kilat">Kilat</option>
                  <option value="same-day">Same Day</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E00000] text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Cek Ongkir
            </button>
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
