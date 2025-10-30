"use client";

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/reset-password/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <ResetPasswordForm />
      </div>
    </Suspense>
  );
}

