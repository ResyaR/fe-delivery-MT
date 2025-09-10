"use client"

import { useSearchParams } from 'next/navigation'
import Header from './Header.jsx'
import OngkirForm from './OngkirForm.jsx'
import Footer from './Footer.jsx'

export default function CekOngkirClient() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  return (
    <div className="flex flex-col bg-white">
      <div 
        className="flex flex-col items-start self-stretch h-[1074px]"
        style={{ background: "linear-gradient(180deg, #C3CFE2, #FCFCFC)" }}
      >
        <Header />
        <OngkirForm type={type || 'pengiriman-instan'} />
        <Footer />
      </div>
    </div>
  )
}
