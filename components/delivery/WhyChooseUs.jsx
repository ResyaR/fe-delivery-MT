"use client";

import React from "react";

export default function WhyChooseUs() {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          {/* Left side - Text content */}
          <div className="flex-1">
            <span className="text-[#FF6868] text-xl font-bold mb-4 block">
              Our Story & Services
            </span>
            <h2 className="text-black text-4xl lg:text-6xl font-bold mb-4">
              Kenapa Pilih Kami?
            </h2>
            <p className="text-[#555555] text-lg lg:text-xl mb-8 max-w-2xl">
              Berlandaskan komitmen, kami menghadirkan layanan pengantaran yang aman, cepat, dan terpercaya, memastikan setiap kiriman sampai tepat waktu.
            </p>
            <button 
              className="bg-[#39DA49] text-white py-4 px-8 rounded-full text-lg font-bold hover:bg-green-600 transition-colors"
              onClick={() => console.log("Explore clicked!")}
            >
              Explore
            </button>
          </div>

          {/* Right side - Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 - Aman */}
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/wfgc53f4_expires_30_days.png"
                className="w-16 h-16 mb-4 mx-auto"
                alt="Aman icon"
              />
              <h3 className="text-[#5FE26C] text-2xl font-bold mb-3 text-center">
                Aman
              </h3>
              <p className="text-[#90BD94] text-lg text-center">
                Nikmati layanan pengantaran yang cepat, aman, dan terpercaya.
              </p>
            </div>

            {/* Card 2 - Fast delivery */}
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/c0a6v58w_expires_30_days.png"
                className="w-16 h-16 mb-4 mx-auto"
                alt="Fast delivery icon"
              />
              <h3 className="text-[#5FE26C] text-2xl font-bold mb-3 text-center">
                Fast delivery
              </h3>
              <p className="text-[#90BD94] text-lg text-center">
                Pesanan Anda, sampai cepat di depan pintu.
              </p>
            </div>

            {/* Card 3 - Terjangkau */}
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/wohn1lw1_expires_30_days.png"
                className="w-16 h-16 mb-4 mx-auto"
                alt="Terjangkau icon"
              />
              <h3 className="text-[#5FE26C] text-2xl font-bold mb-3 text-center">
                Terjangkau
              </h3>
              <p className="text-[#90BD94] text-lg text-center">
                Pengantaran ramah kantong, dari kota hingga pelosok desa.
              </p>
            </div>

            {/* Card 4 - Lokal */}
            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/2ytbknpt_expires_30_days.png"
                className="w-16 h-16 mb-4 mx-auto"
                alt="Lokal icon"
              />
              <h3 className="text-[#5FE26C] text-2xl font-bold mb-3 text-center">
                Lokal
              </h3>
              <p className="text-[#90BD94] text-lg text-center">
                Kemudahan untuk anda menebarkan kebahagian bagi sekitar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}