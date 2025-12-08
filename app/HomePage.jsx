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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <MTTransHero />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <PromoBanner />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <PopularCategories />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <DeliveryOptions />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <WhyChooseUs />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <StatsSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        >
          <MTTransTestimonials />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <MTTransCTA />
        </motion.div>
      </main>

      <MTTransFooter />
    </div>
  );
}
