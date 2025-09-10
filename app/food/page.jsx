"use client"

import TopHeader from '../../components/food/TopHeader'
import HeroSection from '../../components/food/HeroSection'
import FoodPartners from '../../components/food/FoodPartners'
import PromoSection from '../../components/food/PromoSection'
import ExploreSection from '../../components/food/ExploreSection'
import TestimonialSection from '../../components/food/TestimonialSection'
import ServicesSection from '../../components/food/ServicesSection'
import FooterSection from '../../components/food/FooterSection'

export default function FoodPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopHeader />
      <div className="flex flex-col items-center self-stretch bg-[#FCFCFC]">
        <div id="home" className="flex flex-col items-center self-stretch pb-8 lg:pb-[50px] mb-0.5 gap-2 w-full">
          <HeroSection />
        </div>

        <div id="food-partners" className="w-full">
          <FoodPartners />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PromoSection />
          <ExploreSection />
          <TestimonialSection />
          <div id="services">
            <ServicesSection />
          </div>
          <FooterSection />
        </div>
      </div>
    </div>
  )
}
