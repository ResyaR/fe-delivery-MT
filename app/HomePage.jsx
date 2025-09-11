"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/delivery/Header";
import Hero from "../components/delivery/Hero";
import PopularCategories from "../components/delivery/PopularCategories";
import DeliveryOptions from "../components/delivery/DeliveryOptions";
import WhyChooseUs from "../components/delivery/WhyChooseUs";
import Testimonials from "../components/delivery/Testimonials";
import Footer from "../components/delivery/Footer";

export default function HomePage() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleSignInClick = () => {
    window.location.href = "/signin";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#C3CFE2] to-[#FCFCFC] overflow-x-hidden"
      style={{
        background: "linear-gradient(180deg, #C3CFE2 0%, #FCFCFC 100%)"
      }}
    >
      <motion.header variants={itemVariants}>
        <Header onLogoClick={handleLogoClick} onSignInClick={handleSignInClick} />
      </motion.header>
      
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>

      <motion.main 
        variants={itemVariants} 
        className="bg-white w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut"
          }}
        >
          <PopularCategories />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut",
            delay: 0.1
          }}
        >
          <DeliveryOptions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut",
            delay: 0.2
          }}
        >
          <Testimonials />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut",
            delay: 0.3
          }}
        >
          <WhyChooseUs />
        </motion.div>
      </motion.main>

      <motion.footer variants={itemVariants}>
        <Footer />
      </motion.footer>
    </motion.div>
  );
}
