"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MTTransFoodPromo() {
  const router = useRouter();
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const promos = [
    {
      id: 1,
      title: "Diskon 50%",
      code: "MAKAN50",
      description: "Diskon 50% untuk menu pilihan",
      terms: "Minimal pembelian Rp 100.000. Berlaku untuk pengguna baru.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdhNmJa7ITjVRhN1JC5P6kVxApjptUY6bGAxril21NZqB9A3ssfNdwXwB8Q4ed1x_38sKLfQ1a39mGXqYsJKh44eT3Ep-3eAwu6LS0C-x7-fRWO5UqB7QRun7M1WfNbi5h8e_1ZbJvN4qemrVy28WHhvAPbc8YDc0CGg4sxeuFVY6jURfCZJuRZ4QbmclTePwuLGxwF7c_8m7WfINm_zyP2aiOQhDFLAZP_B6aRc06ewQtiycMUSA04wIKsIIkrdCvXkiE4R0Rnsw"
    },
    {
      id: 2,
      title: "Voucher Makanan Korea",
      code: "KOREA25",
      description: "Diskon 25% untuk semua menu Korea",
      terms: "Berlaku di merchant Korea. Maksimal diskon Rp 50.000.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1FzJNeh5x7w-GQj-jmk1aVT3KIH0VcHxBzPrFDHjdpek29GLrjg17Vo4uCS0t1DL_B4LfHLqCJQnXS-R2EoTBKpp9t9aM8g7slpq0vyp-4tz7u0nj0x8ms_YSsB_kNqcVzA4ewzhlOk6tqaMJuKwXds3GbQH4cGKpv-a94Lnd1TBJlmUAt48sWwWRU6k9QgHF0Pk87M_vaZHljkGPFZ0dm_Ff1KQ3egCm0A0lrxcuTIiw8N6kFBYkQ5lMXvGGknq_eiNT7NRFfvE"
    },
    {
      id: 3,
      title: "Promo Burger",
      code: "BURGER30",
      description: "Hemat 30% untuk pembelian burger",
      terms: "Berlaku untuk semua varian burger. Min. pembelian 2 item.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe4jEyJreJJOuB7JQaUVKi-Yfd03BMiKjmrthRClMAhi2QnEkb5geLVLWbxBDZvBOsFSS2Y-OZ1fiZfZXVMefvVNUy5aZ5T68w12KJOKjHKwMnv-xA3FSk952iG8ud_DFHlGn0b75AvgqFiOHUuzVcFaz8kPWqmDMDNi6zF2EFER4nVlS5PI-nPw8dj1yydP3XjgRSs5jjwZ8tKE_fsEGeH1Z_h-ZwTtOMnyXuMCbKZdsoTYjf-RveVkF1sd5nvvvfwJLXEqkA5sE"
    }
  ];

  const handlePromoClick = (promo) => {
    setSelectedPromo(promo);
    setShowPromoModal(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Kode promo ${code} berhasil disalin!`);
  };

  const handleUsePromo = (promo) => {
    router.push(`/cart?promo=${promo.code}`);
  };

  return (
    <>
      <section id="food-promo" className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Promo Spesial Hari Ini</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {promos.map((promo) => (
            <div 
              key={promo.id} 
              onClick={() => handlePromoClick(promo)}
              className="flex flex-col gap-4 cursor-pointer group transition-transform hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity">
                    visibility
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold mb-1">{promo.title}</p>
                <p className="text-sm text-gray-600">{promo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Detail Modal */}
      {showPromoModal && selectedPromo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowPromoModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">{selectedPromo.title}</h3>
              <button 
                onClick={() => setShowPromoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <img
              src={selectedPromo.image}
              alt={selectedPromo.title}
              className="w-full aspect-video object-cover rounded-lg mb-4"
            />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kode Promo:</p>
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
                  <span className="font-mono font-bold text-lg flex-1">{selectedPromo.code}</span>
                  <button
                    onClick={() => handleCopyCode(selectedPromo.code)}
                    className="px-4 py-2 bg-[#E00000] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Deskripsi:</p>
                <p className="text-gray-800">{selectedPromo.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Syarat & Ketentuan:</p>
                <p className="text-sm text-gray-700">{selectedPromo.terms}</p>
              </div>

              <button
                onClick={() => handleUsePromo(selectedPromo)}
                className="w-full py-3 bg-[#E00000] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Gunakan Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
