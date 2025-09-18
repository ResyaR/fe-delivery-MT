"use client"

import { motion } from 'framer-motion'
import TopHeader from '../../components/food/TopHeader'
import HeroSection from '../../components/food/HeroSection'
import FoodPartners from '../../components/food/FoodPartners'
import PromoSection from '../../components/food/PromoSection'
import ExploreSection from '../../components/food/ExploreSection'
import TestimonialSection from '../../components/food/TestimonialSection'
import ServicesSection from '../../components/food/ServicesSection'
import FooterSection from '../../components/food/FooterSection'

export default function FoodPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col min-h-screen bg-background overflow-x-hidden w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TopHeader />
      </motion.div>

      <div className="flex flex-col items-center self-stretch bg-[#FCFCFC]">
        <motion.div 
          id="home"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center self-stretch pb-8 lg:pb-[50px] mb-0.5 gap-2 w-full"
        >
          <HeroSection />
        </motion.div>

        <motion.div 
          id="food-partners"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full"
        >
          <FoodPartners />
        </motion.div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <PromoSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <ExploreSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <TestimonialSection />
          </motion.div>

          <motion.div 
            id="services"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <ServicesSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <FooterSection />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
