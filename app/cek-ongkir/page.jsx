"use client";

import { Suspense } from 'react';
import MTTransHeader from '@/components/delivery/MTTransHeader';
import MTTransMultiTabForm from '../../components/cek-ongkir/MTTransMultiTabForm';
import MTTransFooter from '@/components/delivery/MTTransFooter';

export default function CekOngkirPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black antialiased">
      <style jsx global>{`
        :root {
          --brand-red: #FF0000;
          --brand-red-dark: #E60000;
        }
        body {
          font-family: 'Poppins', sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 800;
        }
        .material-symbols-outlined {
          font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 24
        }
      `}</style>
      
      <MTTransHeader />
      <main className="pt-20">
        <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
          <MTTransMultiTabForm />
        </Suspense>
      </main>
      <MTTransFooter />
    </div>
  );
}
