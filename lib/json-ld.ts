import {
  EXPERIENCIAS_OG_IMAGE,
  EXPERIENCIAS_PATH,
} from '@/lib/experiencias'
import {
  getDictionary,
  htmlLang,
  localeUrl,
  yachtFallbackDescription,
  type Locale,
} from '@/lib/i18n'
import {
  SITE_EMAIL,
  SITE_FACEBOOK,
  SITE_INSTAGRAM,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/site'
import {
  getYachtImages,
  getYachtSlug,
  parseYachtPrice,
  type Yacht,
} from '@/lib/yachts'
import { averageRating, type YachtReview } from '@/lib/yacht-reviews'

const BUSINESS_ID = `${SITE_URL}/#business`
const WEBSITE_ID = `${SITE_URL}/#website`

function localBusinessNode(locale: Locale) {
  const dict = getDictionary(locale)

  return {
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    alternateName: 'Blue Waves',
    url: localeUrl(locale, '/'),
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    image: `${SITE_URL}/bluebueno.png`,
    logo: `${SITE_URL}/icon.png`,
    description: dict.seo.description,
    priceRange: '$$$',
    currenciesAccepted: 'MXN, USD',
    availableLanguage: ['es', 'en'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cancún',
      addressRegion: 'Quintana Roo',
      addressCountry: 'MX',
    },
    areaServed: [
      { '@type': 'City', name: 'Cancún' },
      { '@type': 'Place', name: 'Isla Mujeres' },
      { '@type': 'Place', name: 'Mar Caribe' },
    ],
    sameAs: [SITE_INSTAGRAM, SITE_FACEBOOK],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_PHONE,
      contactType: 'reservations',
      areaServed: 'MX',
      availableLanguage: ['Spanish', 'English'],
    },
  }
}

export function localBusinessJsonLd(locale: Locale = 'es') {
  const dict = getDictionary(locale)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      localBusinessNode(locale),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: localeUrl(locale, '/'),
        name: SITE_NAME,
        alternateName: dict.seo.title,
        description: dict.seo.description,
        inLanguage: htmlLang(locale),
        publisher: { '@id': BUSINESS_ID },
      },
    ],
  }
}

export function fleetItemListJsonLd(yachts: Yacht[], locale: Locale = 'es') {
  const dict = getDictionary(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.seo.fleetListName,
    description: dict.seo.fleetListDescription,
    numberOfItems: yachts.length,
    itemListElement: yachts.map((yacht, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: localeUrl(locale, `/yates/${getYachtSlug(yacht)}`),
      name: yacht.name,
    })),
  }
}

export function experienciasJsonLd(locale: Locale = 'es') {
  const dict = getDictionary(locale)
  const url = localeUrl(locale, EXPERIENCIAS_PATH)
  const chapters = Object.values(dict.experiencias.chapters)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: dict.seo.breadcrumbHome,
            item: localeUrl(locale, '/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: dict.experiencias.seoTitle,
            item: url,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: dict.experiencias.seoTitle,
        description: dict.experiencias.seoDescription,
        inLanguage: htmlLang(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': BUSINESS_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: toAbsoluteUrl(EXPERIENCIAS_OG_IMAGE),
        },
        mainEntity: {
          '@type': 'ItemList',
          name: dict.seo.experienceListName,
          numberOfItems: chapters.length,
          itemListElement: chapters.map((chapter, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: chapter.title.replace(/\.$/, ''),
            description: chapter.body,
          })),
        },
      },
    ],
  }
}

export function faqJsonLd(locale: Locale = 'es') {
  const dict = getDictionary(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dict.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function yachtProductJsonLd(
  yacht: Yacht,
  reviews: YachtReview[] = [],
  locale: Locale = 'es',
) {
  const dict = getDictionary(locale)
  const slug = getYachtSlug(yacht)
  const url = localeUrl(locale, `/yates/${slug}`)
  const images = getYachtImages(yacht).map(toAbsoluteUrl)
  const price = parseYachtPrice(yacht)
  const available = yacht.available !== false
  const rating = averageRating(reviews)
  const size = yacht.size?.trim()
  const capacity = yacht.capacity
  const description =
    yacht.description?.replace(/\s+/g, ' ').trim() ||
    yachtFallbackDescription(locale, yacht.name.trim())

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: dict.seo.breadcrumbHome,
            item: localeUrl(locale, '/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: yacht.name,
            item: url,
          },
        ],
      },
      {
        '@type': ['Product', 'Boat'],
        '@id': `${url}#product`,
        name: yacht.name,
        url,
        description,
        image: images.length > 0 ? images : [`${SITE_URL}/bluebueno.png`],
        sku: yacht.id,
        brand: {
          '@type': 'Brand',
          name: SITE_NAME,
        },
        category: dict.seo.yachtCategory,
        ...(size ? { identifier: size } : {}),
        ...(capacity ? { occupancy: capacity } : {}),
        ...(yacht.cabins ? { numberOfBerths: yacht.cabins } : {}),
        ...(rating != null
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating.toFixed(1),
                reviewCount: reviews.length,
                bestRating: '5',
                worstRating: '1',
              },
              review: reviews.map((item) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: item.author,
                },
                reviewBody: item.quote,
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: String(item.rating),
                  bestRating: '5',
                  worstRating: '1',
                },
                ...(item.date ? { datePublished: item.date } : {}),
              })),
            }
          : {}),
        offers: {
          '@type': 'Offer',
          '@id': `${url}#offer`,
          url,
          priceCurrency: yacht.currency || 'MXN',
          ...(price != null ? { price: price.toFixed(2) } : {}),
          availability: available
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          category: dict.seo.offerCategory,
          seller: {
            '@id': BUSINESS_ID,
          },
          areaServed: {
            '@type': 'City',
            name: 'Cancún',
          },
        },
      },
    ],
  }
}
