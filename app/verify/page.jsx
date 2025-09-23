"use client";

import React from 'react';
import VerifyHeader from '@/components/auth/verify/VerifyHeader';
import VerifyForm from '@/components/auth/verify/VerifyForm';
import VerifyHero from '@/components/auth/verify/VerifyHero';
import BackButton from '@/components/auth/verify/BackButton';

import VerifyGuard from '@/components/auth/verify/VerifyGuard';

export default function VerifyPage() {
  return (
    <VerifyGuard>
      <div className="min-h-screen w-screen overflow-x-hidden bg-white relative">
        <BackButton />
        
        <main className="min-h-[calc(100vh-4rem)] w-full flex justify-center items-center">
          <div className="w-full h-full flex justify-between items-center">
            {/* Left side - Form */}
            <div className="w-full lg:w-1/2 flex justify-center items-center px-4">
              <div className="w-full max-w-md">
                <VerifyHeader />
                <div className="mt-8">
                  <VerifyForm />
                </div>
              </div>
            </div>
            
            {/* Right side - Hero section */}
            <div className="hidden lg:block lg:w-1/2 h-full">
              <VerifyHero />
            </div>
          </div>
        </main>
      </div>
    </VerifyGuard>
  );
}