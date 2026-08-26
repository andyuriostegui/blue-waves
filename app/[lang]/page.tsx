import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import HomePage from '@/components/HomePage'
import { faqJsonLd, fleetItemListJsonLd } from '@/lib/json-ld'
import {
  getDictionary,
  languageAlternates,
  localeUrl,
  ogAlternateLocale,
  ogLocale,
  parseLocale,
} from '@/lib/i18n'
import { SITE_NAME } from '@/lib/site'
import { localizeYachts } from '@/lib/yacht-copy'
import { getYachts } from '@/lib/yachts-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = parseLocale(lang)
  const dict = getDictionary(locale)
  const url = localeUrl(locale, '/')

  return {
    title: { absolute: dict.seo.title },
    description: dict.seo.description,
    keywords: [...dict.seo.keywords],
    alternates: {
      canonical: url,
      languages: languageAlternates('/'),
    },
    openGraph: {
      type: 'website',
      locale: ogLocale(locale),
      alternateLocale: [ogAlternateLocale(locale)],
      url,
      siteName: SITE_NAME,
      title: dict.seo.ogTitle,
      description: dict.seo.description,
      images: [
        {
          url: '/bluebueno.png',
          width: 1200,
          height: 630,
          alt: dict.seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.ogTitle,
      description: dict.seo.description,
      images: ['/bluebueno.png'],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = parseLocale(lang)
  const yachts = localizeYachts(await getYachts(), locale)

  return (
    <>
      <JsonLd data={fleetItemListJsonLd(yachts, locale)} />
      <JsonLd data={faqJsonLd(locale)} />
      <HomePage yachts={yachts} />
    </>
  )
}
