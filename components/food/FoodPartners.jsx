export default function FoodPartners() {
  const partners = [
    {
      id: 1,
      name: "Mie Gacoan, Ponorogo",
      price: "25rb-35rb",
      category: "(Bakmie)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/5urbs1d2_expires_30_days.png"
    },
    {
      id: 2,
      name: "Mixue, Sultan Agung",
      price: "14rb-25rb",
      category: "(Es krim)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/7ly9mpeh_expires_30_days.png"
    },
    {
      id: 3,
      name: "Otty's Cafe, Sultan Agung",
      price: "15rb-45rb",
      category: "(Cafe)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/otty_cafe_image_expires_30_days.png"
    },
    {
      id: 4,
      name: "Geprekinaja, Teuku Umar",
      price: "9rb-20rb",
      category: "(Ayam)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/c8n4699b_expires_30_days.png"
    },
    {
      id: 5,
      name: "Akademi Kopi, Ponorogo",
      price: "12rb-34rb",
      category: "(Cafe)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/44p03km3_expires_30_days.png"
    },
    {
      id: 6,
      name: "Mbak Kebab, Ponorogo",
      price: "9rb-18rb",
      category: "(Kebab)",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/asfzjypb_expires_30_days.png"
    }
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 lg:mb-[31px] justify-center gap-4 sm:gap-8">
        <span className="text-black text-3xl sm:text-4xl lg:text-6xl font-bold text-center sm:text-left">{"Food Partners"}</span>
        <span className="text-[#7F7D7D] text-lg sm:text-xl lg:text-2xl font-bold cursor-pointer hover:text-gray-600 transition-colors">{"See All >"}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-[204px]">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col items-start bg-white pt-2 pb-5 lg:pt-[3px] lg:pb-[21px] rounded-[30px] transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{
              boxShadow: "7px 12px 43px #00000024",
            }}
          >
            <img
              src={partner.image}
              className="w-full h-32 sm:h-40 lg:h-[186px] mb-3 lg:mb-3.5 object-cover rounded-t-[30px]"
              alt={partner.name}
            />
            <span className="text-black text-lg sm:text-xl lg:text-[26px] font-bold mb-2 lg:mb-[13px] ml-4 lg:ml-[23px] px-2 lg:px-0">
              {partner.name}
            </span>
            <div className="flex items-start ml-4 lg:ml-[23px] gap-4 lg:gap-[22px] px-2 lg:px-0">
              <span className="text-[#7F7D7D] text-lg sm:text-xl lg:text-2xl font-bold">{partner.price}</span>
              <span className="text-black text-lg sm:text-xl lg:text-2xl">{partner.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
