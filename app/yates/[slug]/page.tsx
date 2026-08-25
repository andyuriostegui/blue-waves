import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import YachtDetail from '@/components/YachtDetail'
import { yachtProductJsonLd } from '@/lib/json-ld'
import { SITE_NAME, SITE_URL, toAbsoluteUrl } from '@/lib/site'
import { loadYachtReviews, reviewsForJsonLd } from '@/lib/yacht-reviews'
import { getYachtBySlug, getYachts } from '@/lib/yachts-data'
import {
  getYachtImages,
  getYachtSlug,
  toStringList,
  yachtMetaDescription,
} from '@/lib/yachts'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const yachts = await getYachts()
  return yachts.map((yacht) => ({ slug: getYachtSlug(yacht) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const yacht = await getYachtBySlug(slug)

  if (!yacht) {
    return {
      title: 'Yate no encontrado',
      robots: { index: false, follow: false },
    }
  }

  const title = `Renta ${yacht.name.trim()} en Cancún`
  const description = yachtMetaDescription(yacht)
  const images = getYachtImages(yacht)
  const ogImage = images[0] ? toAbsoluteUrl(images[0]) : `${SITE_URL}/bluebueno.png`
  const url = `${SITE_URL}/yates/${getYachtSlug(yacht)}`

  return {
    title,
    description,
    keywords: [
      `renta ${yacht.name} Cancún`,
      `yate ${yacht.name} Cancún`,
      'renta de yates en Cancún',
      'charter de yate Cancún',
      yacht.size ?? 'yate de lujo',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${yacht.name} — renta de yate en Cancún`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function YachtPage({ params }: PageProps) {
  const { slug } = await params
  const yacht = await getYachtBySlug(slug)

  if (!yacht) notFound()

  const images = getYachtImages(yacht)
  const features = toStringList(yacht.features)
  const includes = toStringList(yacht.includes)
  const reviews = await loadYachtReviews(yacht.id, slug)

  return (
    <>
      <JsonLd data={yachtProductJsonLd(yacht, reviewsForJsonLd(reviews))} />
      <YachtDetail
        yacht={yacht}
        images={images}
        features={features}
        includes={includes}
        reviews={reviews}
        bookHref={`/?yate=${encodeURIComponent(yacht.name)}#contact`}
      />
    </>
  )
}
