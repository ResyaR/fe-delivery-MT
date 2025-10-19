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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <VerifyForm />
        </main>
      </div>
    </VerifyGuard>
  );
}