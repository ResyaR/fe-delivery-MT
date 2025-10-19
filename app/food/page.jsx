"use client";

import MTTransFoodHeader from '../../components/food/MTTransFoodHeader';
import MTTransFoodHero from '../../components/food/MTTransFoodHero';
import MTTransFoodPartners from '../../components/food/MTTransFoodPartners';
import MTTransFoodPromo from '../../components/food/MTTransFoodPromo';
import MTTransFoodCategories from '../../components/food/MTTransFoodCategories';
import MTTransFoodTestimonials from '../../components/food/MTTransFoodTestimonials';
import MTTransFoodWhyChoose from '../../components/food/MTTransFoodWhyChoose';
import MTTransFoodFooter from '../../components/food/MTTransFoodFooter';

export default function FoodPage() {
  return (
    <div className="relative w-full min-h-screen bg-background-light dark:bg-background-dark font-display text-foreground-light dark:text-foreground-dark">
      <MTTransFoodHeader />
      
      <main className="container mx-auto px-6 pt-24 pb-16 space-y-24">
        <MTTransFoodHero />
        <MTTransFoodPartners />
        <MTTransFoodPromo />
        <MTTransFoodCategories />
        <MTTransFoodTestimonials />
        <MTTransFoodWhyChoose />
      </main>
      
      <MTTransFoodFooter />
        </div>
  );
}
