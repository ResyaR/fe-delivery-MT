"use client";

import React from "react";
import Header from "../components/delivery/Header";
import Hero from "../components/delivery/Hero";
import PopularCategories from "../components/delivery/PopularCategories";
import DeliveryOptions from "../components/delivery/DeliveryOptions";
import WhyChooseUs from "../components/delivery/WhyChooseUs";
import Testimonials from "../components/delivery/Testimonials";
import Footer from "../components/delivery/Footer";

export default function HomePage() {
  const handleLogoClick = () => {
    // Navigate to home if needed
    window.location.href = "/";
  };

  const handleSignInClick = () => {
    // Navigate to signin page
    window.location.href = "/signin";
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-[#C3CFE2] to-[#FCFCFC]"
      style={{
        background: "linear-gradient(180deg, #C3CFE2 0%, #FCFCFC 100%)"
      }}
        >
      <Header onLogoClick={handleLogoClick} onSignInClick={handleSignInClick} />
          <Hero />
      <main className="bg-white">
        <PopularCategories />
        <DeliveryOptions />
        <Testimonials />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
