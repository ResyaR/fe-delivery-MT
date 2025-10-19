"use client";

export default function MTTransWhyChooseUs() {
  const features = [
    {
      icon: (
        <img 
          src="/image 12.png" 
          alt="Safe delivery character" 
          className="w-12 h-12 object-contain"
        />
      ),
      title: "Safe",
      description: "Paket Anda dijamin aman dari penjemputan hingga tujuan."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Fast",
      description: "Kami mengutamakan kecepatan untuk setiap pengiriman Anda."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <path d="M17 9.5A5.5 5.5 0 0112 15a5.5 5.5 0 01-5-5.5A5.5 5.5 0 0112 4a5.5 5.5 0 015 5.5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Affordable",
      description: "Tarif kompetitif tanpa mengurangi kualitas layanan."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      ),
      title: "Local",
      description: "Jangkauan luas di seluruh area lokal Anda."
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-white fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Backdrop color aligned with SAFE badge (subtle red) */}
            <div className="rounded-2xl bg-red-100 shadow-sm p-6 border border-red-200/60">
              <img 
                alt="Kurir MT Trans sedang bekerja dengan paket dan smartphone" 
                className="rounded-xl shadow w-full h-auto object-cover" 
                src="/green-rounded-rectangle.png"
              />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl mb-8">Kenapa Memilih Kami?</h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-[#E00000]">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="mt-1 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
