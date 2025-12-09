"use client";

import { useState, useEffect, useRef } from 'react';

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: "shopping_bag",
      value: 100,
      suffix: "+",
      label: "Total Orders",
      color: "text-blue-600"
    },
    {
      icon: "restaurant",
      value: 100,
      suffix: "+",
      label: "Restaurant Partners",
      color: "text-orange-600"
    },
    {
      icon: "people",
      value: 100,
      suffix: "+",
      label: "Happy Customers",
      color: "text-purple-600"
    },
    {
      icon: "star",
      value: 4.8,
      suffix: "/5",
      label: "Average Rating",
      color: "text-yellow-600",
      decimals: 1
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  function AnimatedCounter({ value, suffix, decimals = 0 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span className="text-4xl md:text-5xl lg:text-6xl font-bold">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('id-ID')}
        {suffix}
      </span>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-red-500 text-sm md:text-base font-bold uppercase tracking-wider mb-2 block">
            Our Achievement
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Dipercaya Ratusan Pengguna
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan pelanggan yang sudah merasakan layanan terbaik kami
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${stat.color} mb-4`}>
                <span className="material-symbols-outlined text-5xl md:text-6xl">
                  {stat.icon}
                </span>
              </div>
              <div className={`${stat.color} mb-2`}>
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-sm md:text-base text-gray-600 font-medium text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

