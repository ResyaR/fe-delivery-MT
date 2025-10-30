export default function ServicesSection() {
  return (
    <div id="services" className="py-8 lg:py-16">
      {/* Services Section */}
      <div className="flex flex-col lg:flex-row items-start mb-16 lg:mb-[31px] justify-center gap-8 lg:gap-16">
        <div className="flex flex-col shrink-0 items-start mt-8 lg:mt-[47px] mr-0 lg:mr-[68px] text-center lg:text-left">
          <span className="text-[#FF6868] text-xl font-bold mb-8 lg:mb-16">Our Story & Services</span>
          <span className="text-black text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-[17px] ml-0 lg:ml-[3px]">Kenapa Pilih Kami?</span>
          <span className="text-[#555555] text-lg sm:text-xl lg:text-[26px] font-bold max-w-[645px]">
            Berlandaskan komitmen, kami menghadirkan layanan pengantaran yang aman, cepat, dan terpercaya,
            memastikan setiap kiriman sampai tepat waktu.
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5 w-full max-w-4xl">
          <div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full h-[240px] lg:h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/aman.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Aman"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Aman</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full max-w-[200px]">
              Nikmati layanan pengantaran yang cepat, aman, dan terpercaya.
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full h-[240px] lg:h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/fast.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Fast delivery"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Fast delivery</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full max-w-[200px]">
              Pesanan Anda, sampai cepat di depan pintu.
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full h-[240px] lg:h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/lokal.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Lokal"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Lokal</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full max-w-[200px]">
              Kemudahan untuk anda menebarkan kebahagian bagi sekitar
            </span>
          </div>
          <div
            className="flex flex-col items-center justify-between bg-white py-5 lg:py-6 px-4 lg:px-5 rounded-[24px] w-full h-[240px] lg:h-[280px]"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <div className="flex flex-col items-center">
              <img
                src="/terjangkau.png"
                className="w-16 h-16 lg:w-20 lg:h-20 object-fill mb-3"
                alt="Terjangkau"
              />
              <span className="text-[#E00000] text-lg lg:text-xl font-bold mb-2">Terjangkau</span>
            </div>
            <span className="text-gray-600 text-sm lg:text-base font-medium text-center w-full max-w-[200px]">
              Pengantaran ramah kantong, dari kota hingga pelosok desa.
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
