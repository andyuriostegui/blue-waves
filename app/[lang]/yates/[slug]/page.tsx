import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import YachtDetail from '@/components/YachtDetail'
import {
  getDictionary,
  languageAlternates,
  localizePath,
  localeUrl,
  LOCALES,
  ogAlternateLocale,
  ogLocale,
  parseLocale,
  yachtFallbackDescription,
  yachtMetaKeywords,
  yachtMetaTitle,
  yachtOgAlt,
} from '@/lib/i18n'
import { yachtProductJsonLd } from '@/lib/json-ld'
import { SITE_NAME, toAbsoluteUrl } from '@/lib/site'
import { localizeYacht } from '@/lib/yacht-copy'
import { loadYachtReviews, reviewsForJsonLd } from '@/lib/yacht-reviews'
import { getYachtBySlug, getYachts } from '@/lib/yachts-data'
import {
  getYachtImages,
  getYachtSlug,
  toStringList,
  yachtMetaDescription,
} from '@/lib/yachts'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const yachts = await getYachts()
  return LOCALES.flatMap((lang) =>
    yachts.map((yacht) => ({ lang, slug: getYachtSlug(yacht) })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = parseLocale(lang)
  const dict = getDictionary(locale)
  const found = await getYachtBySlug(slug)

  if (!found) {
    return {
      title: dict.yacht.notFoundTitle,
      robots: { index: false, follow: false },
    }
  }

  const yacht = localizeYacht(found, locale)
  const title = yachtMetaTitle(locale, yacht.name.trim())
  const description = yachtMetaDescription(
    yacht,
    (name) => yachtFallbackDescription(locale, name),
  )
  const images = getYachtImages(yacht)
  const ogImage = images[0] ? toAbsoluteUrl(images[0]) : '/bluebueno.png'
  const path = `/yates/${getYachtSlug(yacht)}`
  const url = localeUrl(locale, path)

  return {
    title,
    description,
    keywords: yachtMetaKeywords(locale, yacht.name, yacht.size ?? ''),
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      locale: ogLocale(locale),
      alternateLocale: [ogAlternateLocale(locale)],
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: yachtOgAlt(locale, yacht.name),
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

export default async function YachtPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = parseLocale(lang)
  const found = await getYachtBySlug(slug)

  if (!found) notFound()

  const yacht = localizeYacht(found, locale)

  const images = getYachtImages(yacht)
  const features = toStringList(yacht.features)
  const includes = toStringList(yacht.includes)
  const reviews = await loadYachtReviews(yacht.id, slug)

  return (
    <>
      <JsonLd data={yachtProductJsonLd(yacht, reviewsForJsonLd(reviews), locale)} />
      <YachtDetail
        yacht={yacht}
        images={images}
        features={features}
        includes={includes}
        reviews={reviews}
        bookHref={localizePath(
          locale,
          `/?yate=${encodeURIComponent(yacht.name)}#contact`,
        )}
      />
    </>
  )
}
