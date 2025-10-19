"use client";

export default function MTTransFoodPromo() {
  const promos = [
    {
      title: "Diskon 50%",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdhNmJa7ITjVRhN1JC5P6kVxApjptUY6bGAxril21NZqB9A3ssfNdwXwB8Q4ed1x_38sKLfQ1a39mGXqYsJKh44eT3Ep-3eAwu6LS0C-x7-fRWO5UqB7QRun7M1WfNbi5h8e_1ZbJvN4qemrVy28WHhvAPbc8YDc0CGg4sxeuFVY6jURfCZJuRZ4QbmclTePwuLGxwF7c_8m7WfINm_zyP2aiOQhDFLAZP_B6aRc06ewQtiycMUSA04wIKsIIkrdCvXkiE4R0Rnsw"
    },
    {
      title: "Voucher Makanan Korea",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1FzJNeh5x7w-GQj-jmk1aVT3KIH0VcHxBzPrFDHjdpek29GLrjg17Vo4uCS0t1DL_B4LfHLqCJQnXS-R2EoTBKpp9t9aM8g7slpq0vyp-4tz7u0nj0x8ms_YSsB_kNqcVzA4ewzhlOk6tqaMJuKwXds3GbQH4cGKpv-a94Lnd1TBJlmUAt48sWwWRU6k9QgHF0Pk87M_vaZHljkGPFZ0dm_Ff1KQ3egCm0A0lrxcuTIiw8N6kFBYkQ5lMXvGGknq_eiNT7NRFfvE"
    },
    {
      title: "Promo Burger",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe4jEyJreJJOuB7JQaUVKi-Yfd03BMiKjmrthRClMAhi2QnEkb5geLVLWbxBDZvBOsFSS2Y-OZ1fiZfZXVMefvVNUy5aZ5T68w12KJOKjHKwMnv-xA3FSk952iG8ud_DFHlGn0b75AvgqFiOHUuzVcFaz8kPWqmDMDNi6zF2EFER4nVlS5PI-nPw8dj1yydP3XjgRSs5jjwZ8tKE_fsEGeH1Z_h-ZwTtOMnyXuMCbKZdsoTYjf-RveVkF1sd5nvvvfwJLXEqkA5sE"
    }
  ];

  return (
    <section className="bg-card-light dark:bg-card-dark rounded-xl p-12">
      <h2 className="text-4xl font-bold text-center mb-8">Udah Kenyang, Banyak Promo Lagi~</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {promos.map((promo, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div 
              className="w-full aspect-video rounded-lg bg-cover bg-center shadow-lg" 
              style={{backgroundImage: `url("${promo.image}")`}}
            />
            <p className="text-lg font-semibold text-center">{promo.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
