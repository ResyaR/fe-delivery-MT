"use client";

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/reset-password/ResetPasswordForm';

// Force dynamic rendering to prevent prerender issues
export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E00000]"></div>
      </div>
    }>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}

