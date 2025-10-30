"use client";

import { useRouter } from 'next/navigation';

export default function MTTransFoodCategories() {
  const router = useRouter();

  const handleCategoryClick = (categoryName) => {
    router.push(`/food/all?category=${encodeURIComponent(categoryName)}`);
  };

  const categories = [
    {
      name: "Mie Ayam",
      icon: "ramen_dining",
      color: "text-orange-500"
    },
    {
      name: "Minuman",
      icon: "local_cafe",
      color: "text-blue-500"
    },
    {
      name: "Bakso",
      icon: "soup_kitchen",
      color: "text-red-500"
    },
    {
      name: "Korea",
      icon: "restaurant",
      color: "text-purple-500"
    },
    {
      name: "Es Krim",
      icon: "icecream",
      color: "text-pink-500"
    }
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-8">Aneka Kuliner Menarik</h2>
      <div className="flex justify-center flex-wrap gap-8">
        {categories.map((category, index) => (
          <div 
            key={index} 
            onClick={() => handleCategoryClick(category.name)}
            className="flex flex-col items-center gap-4 group cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Filter by ${category.name}`}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all">
              <span className={`material-symbols-outlined text-5xl md:text-6xl ${category.color}`}>
                {category.icon}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
