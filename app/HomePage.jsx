"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import MTTransHeader from "../components/delivery/MTTransHeader";
import MTTransHero from "../components/delivery/MTTransHero";
import PromoBanner from "../components/delivery/PromoBanner";
import PopularCategories from "../components/delivery/PopularCategories";
import DeliveryOptions from "../components/delivery/DeliveryOptions";
import WhyChooseUs from "../components/delivery/WhyChooseUs";
import StatsSection from "../components/delivery/StatsSection";
import MTTransTestimonials from "../components/delivery/MTTransTestimonials";
import MTTransCTA from "../components/delivery/MTTransCTA";
import MTTransFooter from "../components/delivery/MTTransFooter";

export default function HomePage() {
  return (
    <div className="relative w-full bg-white text-[#1a1a1a]">
      <MTTransHeader />
      
      <main id="main-content" className="pt-20">
        <MTTransHero />
        <PromoBanner />
        <PopularCategories />
        <DeliveryOptions />
        <WhyChooseUs />
        <StatsSection />
        <MTTransTestimonials />
        <MTTransCTA />
      </main>

      <MTTransFooter />
    </div>
  );
}
