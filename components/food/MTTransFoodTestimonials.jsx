"use client";

export default function MTTransFoodTestimonials() {
  const testimonials = [
    {
      name: "Wulan",
      rating: "5 Bintang",
      comment: "Makanan sampai cepat dan masih hangat. Kurirnya juga sangat ramah.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG7NmGsXZcu9Ejg6VMfKijVgnOelYUv_smDBL4DM2CiijFSJz-GPZQ7bdL0W_cnz_YChxMPTsRj8MH3MOuSDyw-EvqQxmuybaob0NEdP6AbtWJ3yiMOHkSDtfo6yWIjuwT4stbxbKrhBBEg0TTAVCDvb2OSrWGBiR7EvQnNIEHWDBYdf3hBQpE4Lefh0csWmK0PY9uctRT3Mqz5LHal8Re1Nlw4et5dlCcAIY2_iCxjrCx56h3GEY5PlkapdSq6t4WEC71JFeZVvY"
    },
    {
      name: "Agung",
      rating: "4 Bintang",
      comment: "Saya suka variasi pilihan makanan yang tersedia di platform ini. Mudah menemukan sesuatu yang saya suka.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx0REnztzrCY6OYZFVl-Y8zVORrzhPwZ7wFSSKl7pdSgEQNFyYiW_pi10uJWmjeZxH_U2n6Su66_vSbyYXNmgiS-vM5GSAKcZ-Qhk3uYE6_jWWSubnA6lX5Yc9DKKopMpOw2EhhKD72XjxhbQggqHp8Qm0lpiBY9HQkAhxtuy8Ye3afacHY2lIjhLp-qsLDrTPAJlr8gEqYbcEUKlZJEapGyRQuGiutlF9A8XNA1SFnErNjkZEP_aFJng4LA9gi1LSLhhZouCMklw"
    },
    {
      name: "Maya",
      rating: "5 Bintang",
      comment: "Aplikasinya mudah digunakan dan proses pemesanan sangat lancar. Saya juga menghargai fitur pelacakan real-time.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmUdxDfTgPVBCONgbW9RNBfWhnS1MmXShpGiMSVEZo3meqor4uTZfEOkC10CPAXPvDo4613L6iwdnek1Szjd-io_gjvvLc_lyhA324vlwJKiVvajBHMbKsX4R3miLfAMWMS9sf7TdmYXqiczZdN2PDPxupO5oHkOZRJTmLn5JBk2JJB6cheg8hXy34TRleYHalLqEFig4oujkUmsnCobCDH9YJGe2-Hg47UYmUv2N2tOP72UMArB2I8yLJFfldKwc6jY4SX1yF1l8"
    }
  ];

  return (
    <section>
      <h2 className="text-4xl font-bold text-center mb-8">Apa Kata Pelanggan Kami</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-8 space-y-4 flex flex-col">
            <div className="flex items-center gap-4">
              <img 
                alt="Foto Pelanggan" 
                className="w-16 h-16 rounded-full object-cover" 
                src={testimonial.avatar}
              />
              <div>
                <h4 className="text-lg font-bold">{testimonial.name}</h4>
                <p className="text-subtle-light dark:text-subtle-dark">{testimonial.rating}</p>
              </div>
            </div>
            <p className="text-foreground-light dark:text-foreground-dark flex-grow">"{testimonial.comment}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
