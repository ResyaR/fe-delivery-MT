import dynamic from 'next/dynamic'

const CekOngkirClient = dynamic(() => import('../../components/cek-ongkir/CekOngkirClient'), {
  ssr: false
})

export default function CekOngkirPage() {
  return <CekOngkirClient />
}
