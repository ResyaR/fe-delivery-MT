"use client";

export default function MTTransFoodPromo() {

  const promos = [
    {
      id: 1,
      title: "Diskon 50%",
      code: "MAKAN50",
      description: "Diskon 50% untuk menu pilihan",
      terms: "Minimal pembelian Rp 100.000. Berlaku untuk pengguna baru.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Voucher Makanan Korea",
      code: "KOREA25",
      description: "Diskon 25% untuk semua menu Korea",
      terms: "Berlaku di merchant Korea. Maksimal diskon Rp 50.000.",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Promo Burger",
      code: "BURGER30",
      description: "Hemat 30% untuk pembelian burger",
      terms: "Berlaku untuk semua varian burger. Min. pembelian 2 item.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop"
    }
  ];

  return (
    <section id="food-promo" className="bg-white rounded-xl p-8 md:p-12 shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Promo Spesial Hari Ini</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {promos.map((promo) => (
          <div 
            key={promo.id} 
            className="flex flex-col gap-4"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold mb-1">{promo.title}</p>
              <p className="text-sm text-gray-600">{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
