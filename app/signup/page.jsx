"use client";

import React from "react";
import SignupForm from "@/components/auth/signup/SignupForm";
import SignupHeader from "@/components/auth/signup/SignupHeader";
import BackButton from "@/components/auth/signup/BackButton";
import SignupHero from "@/components/auth/signup/SignupHero";

export default function SignUpPage() {
  return (
    <div className="bg-white min-h-screen w-full relative overflow-x-hidden">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <BackButton />
      </div>

      <div className="flex min-h-screen w-full">
        {/* Left Side - Form Container */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md py-12 flex flex-col items-center">
            <SignupHeader />
            <SignupForm />
          </div>
        </div>
        
        {/* Right Side - Hero Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <SignupHero />
        </div>
      </div>
    </div>
  );
}