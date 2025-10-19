"use client";

import { useState } from "react";

export default function MTTransCekOngkirForm() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setShowResults(true);
  };

  return (
    <main className="flex-grow flex items-center justify-center py-16 lg:py-24 px-4 bg-gray-50">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black">Cek Ongkir</h2>
          <p className="mt-4 mb-12 text-gray-500">Masukkan kota asal dan tujuan pengiriman Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--brand-red)] text-2xl">
                location_on
              </span>
              <input 
                className="w-full h-16 pl-14 pr-4 bg-white border border-gray-300 focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] rounded-xl shadow-sm placeholder:text-gray-400 transition-all duration-300" 
                placeholder="Kota Awal" 
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-2xl">
                my_location
              </span>
              <input 
                className="w-full h-16 pl-14 pr-4 bg-white border border-gray-300 focus:border-[var(--brand-red)] focus:ring-1 focus:ring-[var(--brand-red)] rounded-xl shadow-sm placeholder:text-gray-400 transition-all duration-300" 
                placeholder="Kota Tujuan" 
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button 
              type="submit"
              className="mt-10 w-full lg:w-auto text-lg font-bold text-white btn-brand py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Cek Ongkir
            </button>
          </form>
        </div>

        {showResults && (
          <div className="mt-12 w-full text-left" id="result-table">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Hasil Estimasi</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimasi Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biaya Ongkir</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">Reguler</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2-3 Hari</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 15.000</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-[var(--brand-red)]">Kilat</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">1 Hari</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-red)] font-semibold">Rp 25.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">Same Day</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">6-8 Jam</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp 40.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
