"use client";

export default function MTTransTestimonials() {
  const testimonials = [
    {
      name: "Wulan Sari",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCO3u0Yp-kwu91VEudsVjjoifF1TISU3jn7Ka0LBkooYSDzJ2ebZKxtM4UqZ28HLvSQfZ0aU4pFoL34vR_58PetsRwzt8SDp-Djq3ZOtAIboLTlDFMTT8Vjoz8XB6JqzJQvfv6Vl2hGzW_lYgfvlWya6v4mLV4ftDqywg7WZiJkNIjaNkXutDi8em0zsXT5lrECtwuf4y7z-i7zOz626bR1Bl6RYltuMcfQjjNG7Gve3gmp_a2d4WG_FQ6Fpuk2OTlMHuYgrysCQ5g",
      rating: 5,
      comment: "MT Trans adalah andalan saya untuk semua kebutuhan pengiriman. Cepat, andal, dan selalu tepat waktu!"
    },
    {
      name: "Agung Prasetyo",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdjX_uDfRH91DnZur_qJ9fssGS79CpNaacPs-Y3gvDp-PjH_XzaMeHrKwswSAr6K7NMxl4APtFgf8Lf39x6JTDCTJwJ2NUv3iY-xbrJJQKDMNONt3DTBcqSQkYGKcyMnG9poOZ8iIuTJvHiJw4J0GOiWOxuZHGO3kagky2YpHad-wvv3A1ia2G1toit2DxwpKww1cBcY4QTBj4bT5XAUWFYgYMnuqwRM9OcpuiU-8EFYbGzKlUHn-G2mWvZjJZivaaFwOmdpASJNE",
      rating: 5,
      comment: "Layanan hebat dan harga terjangkau. Saya sudah beberapa kali menggunakan jasa mereka dan tidak pernah ada masalah."
    },
    {
      name: "Maya Indira",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCO3u0Yp-kwu91VEudsVjjoifF1TISU3jn7Ka0LBkooYSDzJ2ebZKxtM4UqZ28HLvSQfZ0aU4pFoL34vR_58PetsRwzt8SDp-Djq3ZOtAIboLTlDFMTT8Vjoz8XB6JqzJQvfv6Vl2hGzW_lYgfvlWya6v4mLV4ftDqywg7WZiJkNIjaNkXutDi8em0zsXT5lrECtwuf4y7z-i7zOz626bR1Bl6RYltuMcfQjjNG7Gve3gmp_a2d4WG_FQ6Fpuk2OTlMHuYgrysCQ5g",
      rating: 5,
      comment: "Saya suka kemudahan penjadwalan pengiriman. MT Trans membuat hidup saya jauh lebih mudah!"
    }
  ];

  const StarIcon = () => (
    <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20">
      <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
    </svg>
  );

  return (
    <section className="py-20 sm:py-24 bg-[#F5F5F5] fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">Apa Kata Pelanggan Kami</h2>
          <p className="mt-4 text-lg text-gray-600">Kisah nyata dari para pelanggan setia kami.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col p-8 bg-white rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  alt={testimonial.name} 
                  className="size-14 rounded-full object-cover" 
                  src={testimonial.avatar}
                />
                <div>
                  <p className="font-bold text-lg text-[#1a1a1a]">{testimonial.name}</p>
                  <div className="flex items-center text-yellow-400">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
