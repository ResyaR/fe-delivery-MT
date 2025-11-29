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
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
      color: "text-orange-500"
    },
    {
      name: "Minuman",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
      color: "text-blue-500"
    },
    {
      name: "Bakso",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
      color: "text-red-500"
    },
    {
      name: "Korea",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop",
      color: "text-purple-500"
    },
    {
      name: "Es Krim",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop",
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
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all overflow-hidden relative">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
