"use client";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

const DeliveryOptions = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleOptionClick = (option) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    if (option === "Pengiriman Instan") {
      router.push('/cek-ongkir?tab=jadwal');
    } else if (option === "Jadwal Kirim") {
      router.push('/cek-ongkir?tab=jadwal');
    } else if (option === "Multi-drop") {
      router.push('/cek-ongkir?tab=multi-drop');
    } else {
      router.push('/cek-ongkir');
    }
  }

  const options = [
    {
      name: "Pengiriman Instan",
      subtitle: "(1-2 jam sampai)",
      icon: "🛵",
      rating: "4.8",
      bgColor: "bg-green-100"
    },
    {
      name: "Jadwal Kirim",
      subtitle: "",
      icon: "📦",
      rating: "4.9",
      bgColor: "bg-blue-100"
    },
    {
      name: "Multi-drop",
      subtitle: "",
      icon: "🚚",
      rating: "4.5",
      bgColor: "bg-yellow-100"
    }
  ]

  return (
    <div className="flex flex-col items-center self-stretch px-4 md:px-8 lg:px-16 xl:px-32 mb-16 md:mb-24">
      <div className="text-center mb-8 md:mb-12">
        <span className="text-red-500 text-sm md:text-base font-bold uppercase tracking-wider mb-2 block">
          Special Dishes
        </span>
        <h2 className="text-black text-2xl md:text-4xl lg:text-5xl font-bold max-w-4xl">
          "Pilihan Pengantaran Sesuai Kebutuhan Anda"
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="flex flex-col bg-white p-6 md:p-8 rounded-3xl shadow-lg relative hover:shadow-xl transition-shadow cursor-pointer" 
            onClick={() => handleOptionClick(option.name)}>
            {/* Heart icon in top right */}
            <div className="absolute top-4 right-4 bg-[#E00000] p-3 rounded-2xl">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center mt-8">
              {/* Icon with colored background */}
              {option.name === "Pengiriman Instan" ? (
                <div className="mb-6">
                  <img 
                    src="/delivery-scooter-right.png" 
                    alt="Delivery Scooter" 
                    className="w-24 h-24 md:w-28 md:h-28 object-contain transform scale-x-[-1]"
                  />
                </div>
              ) : option.name === "Jadwal Kirim" ? (
                <div className="mb-6">
                  <img 
                    src="/delivery-package.png" 
                    alt="Delivery Package" 
                    className="w-24 h-24 md:w-28 md:h-28 object-contain"
                  />
                </div>
              ) : option.name === "Multi-drop" ? (
                <div className="mb-6">
                  <img 
                    src="/multi-drop-delivery.png" 
                    alt="Multi Drop Delivery" 
                    className="w-24 h-24 md:w-28 md:h-28 object-contain"
                  />
                </div>
              ) : (
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${option.bgColor} flex items-center justify-center mb-6`}>
                <span className="text-3xl md:text-4xl">{option.icon}</span>
              </div>
              )}

              {/* Option name and subtitle */}
              <h3 className="text-black text-lg md:text-xl font-bold mb-2">
                {option.name}
              </h3>
              {option.subtitle && (
                <span className="text-gray-600 text-sm md:text-base mb-4">
                  {option.subtitle}
                </span>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[#454545] text-lg md:text-xl font-bold">{option.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeliveryOptions