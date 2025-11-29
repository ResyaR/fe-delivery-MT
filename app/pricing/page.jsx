"use client";

import React from "react";
import MTTransHeader from "@/components/delivery/MTTransHeader";
import MTTransFooter from "@/components/delivery/MTTransFooter";

export default function PricingPage() {
  const pricingData = {
    food: {
      title: "Food Delivery",
      description: "Pesan makanan dari restaurant terbaik di kotamu",
      items: [
        {
          name: "Ongkir Makanan",
          description: "Pengiriman dalam satu kota",
          price: "Rp 15.000",
          details: "Flat rate untuk semua pesanan makanan dalam satu kota"
        },
        {
          name: "Biaya Aplikasi",
          description: "Biaya layanan aplikasi",
          price: "10%",
          details: "Biaya aplikasi 10% dari subtotal pesanan"
        },
        {
          name: "Minimum Order",
          description: "Minimal pembelian",
          price: "Tidak ada",
          details: "Tidak ada minimum order untuk pesanan makanan"
        }
      ]
    },
    delivery: {
      title: "Kirim Barang",
      description: "Pengiriman paket cepat dan aman",
      items: [
        {
          name: "Pengiriman Instan",
          description: "1-2 jam sampai",
          price: "Mulai dari Rp 20.000",
          details: "Harga tergantung jarak dan berat paket"
        },
        {
          name: "Pengiriman Reguler",
          description: "Same day delivery",
          price: "Mulai dari Rp 15.000",
          details: "Pengiriman dalam hari yang sama"
        },
        {
          name: "Jadwal Pengiriman",
          description: "Pilih waktu pengiriman",
          price: "Mulai dari Rp 15.000",
          details: "Jadwalkan pengiriman sesuai waktu yang Anda inginkan"
        },
        {
          name: "Multi Drop",
          description: "Kirim ke beberapa lokasi",
          price: "Rp 15.000 + Rp 10.000/lokasi",
          details: "Lokasi pertama Rp 15.000, lokasi tambahan Rp 10.000 per lokasi"
        }
      ]
    },
    ekspedisi: {
      title: "Paket Besar / Ekspedisi Lokal",
      description: "Solusi logistik untuk bisnis",
      items: [
        {
          name: "Paket Besar",
          description: "Pengiriman paket besar",
          price: "Negosiasi",
          details: "Harga disesuaikan dengan volume dan kebutuhan"
        },
        {
          name: "Ekspedisi Lokal",
          description: "Pengiriman rutin untuk bisnis",
          price: "Kontrak",
          details: "Paket khusus untuk pengiriman rutin"
        }
      ]
    },
    additional: {
      title: "Informasi Tambahan",
      items: [
        {
          name: "Pembayaran",
          description: "Metode pembayaran yang diterima",
          details: "Tunai, Transfer Bank, E-Wallet (OVO, GoPay, DANA, LinkAja)"
        },
        {
          name: "Asuransi",
          description: "Perlindungan paket",
          details: "Tersedia asuransi untuk paket berharga (opsional)"
        },
        {
          name: "Tracking",
          description: "Pelacakan real-time",
          details: "Gratis - Lacak pengiriman Anda secara real-time"
        },
        {
          name: "Customer Service",
          description: "Dukungan 24/7",
          details: "Tim customer service siap membantu Anda kapan saja"
        }
      ]
    }
  };

  return (
    <div className="relative w-full bg-white text-[#1a1a1a] min-h-screen">
      <MTTransHeader />
      
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Harga & Tarif
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparan, jelas, dan tanpa biaya tersembunyi. Lihat semua harga layanan kami di sini.
            </p>
          </div>
        </section>

        {/* Pricing Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
             {/* Food Delivery */}
             <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
               <div className="text-center mb-8">
                 <div className="inline-block mb-4">
                   <span className="material-symbols-outlined text-[#E00000] text-6xl">restaurant</span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {pricingData.food.title}
                </h2>
                <p className="text-lg text-gray-600">{pricingData.food.description}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {pricingData.food.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="text-2xl font-bold text-[#E00000] mb-3">{item.price}</div>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* Kirim Barang */}
             <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
               <div className="text-center mb-8">
                 <div className="inline-block mb-4">
                   <span className="material-symbols-outlined text-[#E00000] text-6xl">local_shipping</span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {pricingData.delivery.title}
                </h2>
                <p className="text-lg text-gray-600">{pricingData.delivery.description}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingData.delivery.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="text-2xl font-bold text-[#E00000] mb-3">{item.price}</div>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* Ekspedisi Lokal */}
             <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
               <div className="text-center mb-8">
                 <div className="inline-block mb-4">
                   <span className="material-symbols-outlined text-[#E00000] text-6xl">inventory</span>
                 </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {pricingData.ekspedisi.title}
                </h2>
                <p className="text-lg text-gray-600">{pricingData.ekspedisi.description}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {pricingData.ekspedisi.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="text-2xl font-bold text-[#E00000] mb-3">{item.price}</div>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {pricingData.additional.title}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingData.additional.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-yellow-600 text-3xl">info</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Catatan Penting</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
                    <li>• Harga pengiriman dapat berbeda tergantung jarak, berat, dan zona</li>
                    <li>• Untuk informasi lebih detail, silakan hubungi customer service kami</li>
                    <li>• Harga yang tertera adalah estimasi, harga final akan ditampilkan saat checkout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MTTransFooter />
    </div>
  );
}

