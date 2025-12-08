export default function ServicesSection() {
  return (
    <div className="py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Section */}
        <div className="flex flex-col lg:flex-row items-start mb-16 lg:mb-[31px] justify-center gap-8 lg:gap-16">
          <div className="flex flex-col shrink-0 items-start mt-8 lg:mt-[47px] mr-0 lg:mr-[68px] text-center lg:text-left w-full lg:w-auto">
            <span className="text-[#FF6868] text-lg sm:text-xl font-bold mb-6 sm:mb-8 lg:mb-16">Our Story & Services</span>
            <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 lg:mb-[17px] ml-0 lg:ml-[3px]">Kenapa Pilih Kami?</span>
            <span className="text-[#555555] text-base sm:text-lg lg:text-[26px] font-bold max-w-full lg:max-w-[645px]">
              Berlandaskan komitmen, kami menghadirkan layanan pengantaran yang aman, cepat, dan terpercaya,
              memastikan setiap kiriman sampai tepat waktu.
            </span>
          </div>
          <div className="flex flex-col shrink-0 items-start gap-4 lg:gap-7 w-full lg:w-auto">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-[22px]">
            <button
              className="flex flex-col items-start bg-white text-left py-4 lg:py-5 rounded-[30px] border-0 w-full sm:w-auto transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E00000]"
              style={{
                boxShadow: "7px 12px 43px #00000024",
              }}
              aria-label="Layanan Aman"
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/xcatdimx_expires_30_days.png"
                className="w-16 h-16 lg:w-[104px] lg:h-[104px] mb-4 lg:mb-[17px] ml-8 lg:ml-[78px] object-fill"
              />
              <span className="text-[#5FE26C] text-xl lg:text-2xl font-bold mb-2 lg:mb-3 ml-8 lg:ml-[92px]">Aman</span>
              <span className="text-[#90BD94] text-base lg:text-xl font-bold text-center w-full max-w-[235px] ml-3">
                Nikmati layanan pengantaran yang cepat, aman, dan terpercaya.
              </span>
            </button>
            <div
              className="flex flex-col items-start bg-white pt-8 lg:pt-[45px] pb-8 lg:pb-[62px] rounded-[30px] w-full sm:w-auto"
              style={{
                boxShadow: "7px 12px 43px #00000024",
              }}
            >
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/mxo6u29c_expires_30_days.png"
                className="w-12 h-12 lg:w-16 lg:h-16 mb-6 lg:mb-8 ml-8 lg:ml-[79px] object-fill"
              />
              <span className="text-[#5FE26C] text-xl lg:text-2xl font-bold mb-4 lg:mb-[17px] mx-4 lg:mx-[46px]">Fast delivery</span>
              <span className="text-[#90BD94] text-base lg:text-xl font-bold text-center w-full max-w-56 ml-4 lg:ml-5">
                Pesanan Anda, sampai cepat di depan pintu.
              </span>
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-end gap-4 lg:gap-[22px]">
            <div
              className="flex flex-col items-center bg-white py-6 lg:py-[34px] px-4 lg:px-5 gap-4 lg:gap-[23px] rounded-[30px] w-full sm:w-auto"
              style={{
                boxShadow: "7px 12px 43px #00000024",
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/vuwtrqn3_expires_30_days.png"
                  className="w-20 h-20 lg:w-[115px] lg:h-[115px] object-fill"
                />
                <span className="text-[#5FE26C] text-xl lg:text-2xl font-bold">lokal</span>
              </div>
              <span className="text-[#90BD94] text-base lg:text-xl font-bold text-center w-full max-w-[228px]">
                Kemudahan untuk anda menebarkan kebahagian bagi sekitar
              </span>
            </div>
            <div
              className="flex flex-col items-center bg-white py-6 lg:py-[34px] px-4 lg:px-5 gap-4 lg:gap-[23px] rounded-[30px] w-full sm:w-auto"
              style={{
                boxShadow: "7px 12px 43px #00000024",
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/aldyiieh_expires_30_days.png"
                  className="w-20 h-20 lg:w-[115px] lg:h-[115px] object-fill"
                />
                <span className="text-[#5FE26C] text-xl lg:text-2xl font-bold">terjangkau</span>
              </div>
              <span className="text-[#90BD94] text-base lg:text-xl font-bold text-center w-full max-w-[228px]">
                Pengantaran ramah kantong, dari kota hingga pelosok desa.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
