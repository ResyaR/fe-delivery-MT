"use client";

import { motion } from 'framer-motion';

export default function ServicesSection() {
  return (
    <div id="services" className="py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Section */}
        <div className="flex flex-col lg:flex-row items-start mb-16 lg:mb-[31px] justify-center gap-8 lg:gap-16">
          <motion.div 
            className="flex flex-col shrink-0 items-start mt-8 lg:mt-[47px] mr-0 lg:mr-[68px] text-center lg:text-left w-full lg:w-auto"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span className="text-[#FF6868] text-lg sm:text-xl font-bold mb-6 sm:mb-8 lg:mb-16">Our Story & Services</span>
            <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-[17px] ml-0 lg:ml-[3px]">Kenapa Pilih Kami?</span>
            <span className="text-[#555555] text-base sm:text-lg lg:text-[26px] font-bold max-w-full lg:max-w-[645px]">
              Berlandaskan komitmen, kami menghadirkan layanan pengantaran yang aman, cepat, dan terpercaya,
              memastikan setiap kiriman sampai tepat waktu.
            </span>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5 w-full lg:max-w-4xl">
          {/* Card 1: Aman - Slide dari kiri */}
          <motion.div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full min-h-[240px] lg:min-h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
            initial={{ opacity: 0, x: -80, y: 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/aman.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Aman"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Aman</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full px-2">
              Nikmati layanan pengantaran yang cepat, aman, dan terpercaya.
            </span>
          </motion.div>
          
          {/* Card 2: Fast delivery - Slide dari atas */}
          <motion.div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full min-h-[240px] lg:min-h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
            initial={{ opacity: 0, y: -80, x: 40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/fast.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Fast delivery"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Fast delivery</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full px-2">
              Pesanan Anda, sampai cepat di depan pintu.
            </span>
          </motion.div>
          
          {/* Card 3: Lokal - Slide dari bawah */}
          <motion.div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full min-h-[240px] lg:min-h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
            initial={{ opacity: 0, y: 80, x: -40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/lokal.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Lokal"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Lokal</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full px-2">
              Kemudahan untuk Anda menebarkan kebahagiaan bagi sekitar
            </span>
          </motion.div>
          
          {/* Card 4: Terjangkau - Slide dari kanan */}
          <motion.div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full min-h-[240px] lg:min-h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
            initial={{ opacity: 0, x: 80, y: 40 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/terjangkau.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Terjangkau"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Terjangkau</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full px-2">
              Pengantaran ramah kantong, dari kota hingga pelosok desa.
            </span>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  )
}
