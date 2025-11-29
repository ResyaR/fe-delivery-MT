"use client"

import { useState } from 'react'

export default function HeroSection() {
  const [isOrdering, setIsOrdering] = useState(false)

  const handleOrder = () => {
    setIsOrdering(true)
    // Simulate order process
    setTimeout(() => {
      alert("Pesanan berhasil! Terima kasih telah memesan.")
      setIsOrdering(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start px-4 sm:px-6 lg:px-8 xl:px-16 gap-8 lg:gap-12">
      <div className="flex flex-col items-start mt-8 lg:mt-[29px] text-center lg:text-left">
        <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-[415px] mb-4">
          {"Makanan Favoritmu, Dikirim dengan Cepat dan Hangat"}
        </span>
        <span className="text-[#555555] text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold max-w-[474px] mb-8 lg:mb-[41px]">
          {"Pesan makanan dari restaurant terbaik di kotamu. Cepat, hangat, dan aman sampai ke rumah."}
        </span>
        <button
          className="flex flex-col items-center lg:items-start bg-[#FF9B44] text-center lg:text-left py-4 lg:py-[18px] px-6 lg:px-[35px] ml-0 lg:ml-[65px] rounded-[10px] border-0 w-full sm:w-auto transition-all duration-300 hover:bg-[#FF8B33] hover:scale-105 active:scale-95"
          style={{
            boxShadow: "-2px 22px 38px #8EFF9980",
          }}
          onClick={handleOrder}
          disabled={isOrdering}
        >
          <span className="text-white text-xl sm:text-2xl lg:text-[35px] font-bold">
            {isOrdering ? "Memproses..." : "Pesan Sekarang"}
          </span>
        </button>
      </div>
      <div className="flex justify-center lg:justify-end w-full lg:w-auto">
        <img
          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/fkb4q1t3_expires_30_days.png"}
          className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[570px] h-auto object-contain"
          alt="Food Delivery Illustration"
        />
      </div>
    </div>
  )
}
