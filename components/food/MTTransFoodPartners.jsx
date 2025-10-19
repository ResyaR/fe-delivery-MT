"use client";

import { useRouter } from 'next/navigation';

export default function MTTransFoodPartners() {
  const router = useRouter();

  const handleSeeAll = () => {
    router.push('/food/all');
  };
  const partners = [
    {
      name: "Mie Gacoan",
      price: "15rb - 30rb",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5XFuTVWxZ7OH8OFxVYf1vIpZdFzlNnL7HhzLx0LtvO-8Ummo5IoIKdBtHVTq7CY_r-eSrjUjPINURDf-GjQUi5vZ9pGiiIChzFbbtR0ytHiIFeBq_IXMk10jSl6FZl45LaHYF8HmxqPOBZXhnZhi7PZWXCiab6Jp4F887UcoRqFKBtMMVKErnXvkbKCuZlriwYnb0eHHbmkaAowyOA6yMtBpqEmYXirFGhQMeNmPecoWqmRmX1t6l_0aU_T15yKVc9hpBL3dj5TU"
    },
    {
      name: "Mixue",
      price: "10rb - 25rb",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8VvIbA-EI5HxCPDH9ImjjjUvwx_CKpvzVj-q66YLzRFeAmKiD2gEq1-jy716WvX5iBLgRDegXfoWMAL39lJVkbFDkUfEWuodCUdDM0Vv-v9FqJkttvzN3DJORW8DLasYbX3dBqXvmeJL3WN9D2naAYZ2WTFyB9ZjShbTubR_d2zNrS84jrTzb-HFp8wtAn6nEe9GkdHjXyZkv9j7R6HK36qAfdAlWrXIDblLVDZZ1PruAyvW1gYtvzTl-hCIh7gBT3UxkKNnUrYQ"
    },
    {
      name: "Otty's Cafe",
      price: "20rb - 40rb",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCY8lR08o8XChW2eB9csL0dtBUzKPJFQCKC_Y1SxSO1Hi_hCZRistRA7AJvBMCBgIvANsnYxUYVi3KpmPmXkXeHNnFO4bXTfrHaoPX_KxRsFCQIgjOlPrEdH_nzH-V6ErwaUup1N2Od-vKEVeI-6m8ie3Ne0s9M5jnc7BfZmAeSyOAG6Vs9-7Q521x_olUEfbyv4SvAmens36Ak5v9k28yrvkpGKI2iRHt-CXEQHoWCpYL2Xu2fHkVk4jkc7wlR2pqKHQTaJJhBhRw"
    }
  ];

  return (
    <section id="food-partners">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Food Partners</h2>
        <button 
          onClick={handleSeeAll}
          className="text-[#E00000] font-semibold hover:underline flex items-center gap-2 transition-colors"
        >
          See All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map((partner, index) => (
          <div key={index} className="bg-card-light dark:bg-card-dark rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl group">
            <div 
              className="w-full h-56 bg-cover bg-center" 
              style={{backgroundImage: `url("${partner.image}")`}}
            />
            <div className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{partner.name}</h3>
                <p className="text-subtle-light dark:text-subtle-dark mt-1">{partner.price}</p>
              </div>
              <span className="material-symbols-outlined text-subtle-light dark:text-subtle-dark group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
