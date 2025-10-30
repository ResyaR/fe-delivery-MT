"use client";

import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/forgot-password/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <ForgotPasswordForm />
      </div>
    </Suspense>
  );
}

