"use client"

const Testimonials = () => {
  return (
    <div className="relative flex flex-col items-center self-stretch px-3 sm:px-4 md:px-6 lg:px-8 mb-16 md:mb-24 overflow-x-hidden max-w-7xl mx-auto">
      {/* Extra space before testimonials */}
      <div className="h-32 md:h-48 lg:h-64"></div>
      
      <div className="text-center mb-8 md:mb-12 relative z-10 w-full">
        <span className="text-red-500 text-sm md:text-base font-bold uppercase tracking-wider mb-2 block">
          Testimonials
        </span>
        <h2 
          className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold w-full px-2 sm:px-0"
        >
          What Our Customers Say About Us
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full max-w-6xl relative z-10">
        {/* Customer Image & Info */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
          <div className="relative mb-6 w-full max-w-[492px]">
            {/* Green shape background */}
            <div 
              className="w-full max-w-[492px] h-[280px] sm:h-[320px] md:h-[362px] bg-green-500 mx-auto"
              style={{
                borderTopLeftRadius: '140px',
                borderTopRightRadius: '140px',
                borderBottomRightRadius: '41px',
                borderBottomLeftRadius: '41px',
                opacity: 1
              }}
            ></div>
            
            {/* Green rounded rectangle image for M. Zaky - positioned to fit properly */}
            <img
              src="/green-rounded-rectangle.png"
              alt="M. Zaky"
              className="hidden md:block absolute w-full max-w-[600px] h-auto object-cover"
              style={{
                top: '-200px',
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 1
              }}
            />
            
            {/* Abstract shapes around customer */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">😊</span>
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🍕</span>
            </div>
            <div className="absolute top-1/2 -left-4 w-6 h-6 bg-green-300 rounded-full"></div>
          </div>
          
          <div className="text-center lg:text-left">
            {/* M. Zaky image instead of text */}
            <img
              src="/mzaky-pengusaha-makanan.png"
              alt="M. Zaky Pengusaha Makanan"
              className="absolute"
              style={{
                width: '230px',
                height: '79px',
                top: '320px',
                left: '300px',
                transform: 'rotate(0deg)',
                opacity: 1,
                borderRadius: '50px'
              }}
            />
            
            {/* M. Zaky text with specified styling */}
            <div
              className="absolute"
              style={{
                width: '120px',
                height: '25px',
                top: '350px',
                left: '345px',
                transform: 'rotate(0deg)',
                opacity: 1,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#202020',
                zIndex: 10
              }}
            >
              M. Zaky<br/>(Pengusaha Makanan)
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="flex-1 text-center lg:text-left">
          <blockquote className="text-black text-lg md:text-2xl font-medium mb-6 italic">
            "Barang saya sampai dengan aman dalam 30 menit. Recommended!"
          </blockquote>
          
          {/* Customer Feedback Rating */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <h4 className="text-black text-lg md:text-xl font-bold">Customer Feedback</h4>
            
            {/* Profile pictures */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
            </div>
            
            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-black text-lg md:text-xl font-bold">4.9 (18.6k Reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
