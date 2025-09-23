'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function VerifyGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const email = new URLSearchParams(window.location.search).get('email');
        if (!email) {
          console.log('No email found in URL, redirecting to signup');
          router.push('/signup');
          return;
        }

        // Jika ada email di URL, langsung set valid true
        // karena email ini harusnya datang dari proses signup
        setIsValid(true);
        setLoading(false);
        
      } catch (error) {
        console.error('Error:', error);
        router.push('/signup');
      }
    };

    checkVerification();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5038ED]"></div>
      </div>
    );
  }

  if (!isValid) {
    return null;
  }

  return children;
}