import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import ExperienciasPage from '@/components/ExperienciasPage'
import { loadResolvedExperienceContent } from '@/lib/experience-media'
import { localizeExperienceContent } from '@/lib/i18n/experience'
import {
  getDictionary,
  languageAlternates,
  localeUrl,
  ogAlternateLocale,
  ogLocale,
  parseLocale,
} from '@/lib/i18n'
import { experienciasJsonLd } from '@/lib/json-ld'
import { EXPERIENCIAS_OG_IMAGE, EXPERIENCIAS_PATH } from '@/lib/experiencias'
import { SITE_NAME, toAbsoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = parseLocale(lang)
  const dict = getDictionary(locale)
  const pageUrl = localeUrl(locale, EXPERIENCIAS_PATH)
  const ogImage = toAbsoluteUrl(EXPERIENCIAS_OG_IMAGE)

  return {
    title: dict.experiencias.seoTitle,
    description: dict.experiencias.seoDescription,
    keywords: [...dict.experiencias.seoKeywords],
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates(EXPERIENCIAS_PATH),
    },
    openGraph: {
      type: 'website',
      locale: ogLocale(locale),
      alternateLocale: [ogAlternateLocale(locale)],
      url: pageUrl,
      siteName: SITE_NAME,
      title: dict.experiencias.seoOgTitle,
      description: dict.experiencias.seoDescription,
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: dict.experiencias.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.experiencias.seoOgTitle,
      description: dict.experiencias.seoDescription,
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

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = parseLocale(lang)
  const dict = getDictionary(locale)
  const content = localizeExperienceContent(
    await loadResolvedExperienceContent(),
    dict,
  )

  return (
    <>
      <JsonLd data={experienciasJsonLd(locale)} />
      <ExperienciasPage
        hero={content.hero}
        cta={content.cta}
        chapters={content.chapters}
        lookbook={content.lookbook}
      />
    </>
  )
}
