"use client"

import { useSearchParams } from 'next/navigation'
import Header from '../../components/cek-ongkir/Header.jsx'
import OngkirForm from '../../components/cek-ongkir/OngkirForm.jsx'
import Footer from '../../components/cek-ongkir/Footer.jsx'

export default function CekOngkirPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  // @ts-ignore
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
