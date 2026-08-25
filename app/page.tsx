import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import HomePage from '@/components/HomePage'
import { faqJsonLd, fleetItemListJsonLd } from '@/lib/json-ld'
import { getYachts } from '@/lib/yachts-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const yachts = await getYachts()

  return (
    <>
      <JsonLd data={fleetItemListJsonLd(yachts)} />
      <JsonLd data={faqJsonLd()} />
      <HomePage yachts={yachts} />
    </>
  )
}
