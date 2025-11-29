"use client";

export default function MTTransFoodWhyChoose() {
  const features = [
    {
      title: "Aman",
      description: "Layanan terpercaya",
      image: "/aman.png"
    },
    {
      title: "Pengantaran Cepat",
      description: "Sampai tujuan secepat kilat",
      image: "/fast.png"
    },
    {
      title: "Dukungan Lokal",
      description: "Membantu bisnis lokal",
      image: "/lokal.png"
    },
    {
      title: "Terjangkau",
      description: "Harga ramah kantong",
      image: "/terjangkau.png"
    }
  ];

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-12">Kenapa Pilih Kami?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-8 text-center shadow-lg space-y-4 hover:shadow-xl transition-shadow"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <div className="flex justify-center mb-4">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  // Fallback jika gambar tidak ditemukan
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-20 h-20 bg-[#E00000]/10 rounded-full flex items-center justify-center mx-auto">
                      <span class="material-symbols-outlined text-[#E00000] text-4xl">restaurant</span>
                    </div>
                  `;
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-[#E00000]">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
