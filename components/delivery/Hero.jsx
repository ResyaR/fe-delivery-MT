"use client"

const Hero = () => {
  const handleOrderNow = () => {
    alert("Order Now clicked!")
  }

  return (
    <div className="flex flex-col items-center self-stretch px-4 md:px-8 lg:px-16 xl:px-32">
      <div className="relative w-full max-w-7xl">
        {/* Background with delivery illustration */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <img
            src="/WhatsApp Image 2025-07-25 at 11.00.24 1.png"
            alt="Delivery Service Background"
            className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[753px] object-cover mx-auto"
          />
          
          {/* Hero content overlay */}
          <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
            {/* Left side - Text content */}
            <div className="flex-1 text-white mb-6 sm:mb-8 lg:mb-0 lg:mr-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                Pengantaran Mudah & Praktis
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 lg:mb-10 opacity-90 leading-relaxed">
                Biarkan kami yang mengantar kebutuhan Anda dengan cepat dan andal.
              </p>
              <button
                onClick={handleOrderNow}
                className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl text-base sm:text-lg md:text-xl font-bold shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                Order Now
              </button>
            </div>

            {/* Right side - Empty space for layout balance */}
            <div className="flex-1"></div>
          </div>

          {/* Callout bubble */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8">
            <div className="bg-white border-2 border-red-500 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
              <span className="text-red-500 text-xs sm:text-sm md:text-base font-bold">
                Jelas Lebih Murah dan Cepat
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
