import { SITE_FAQS } from '@/lib/faq'
import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_FACEBOOK,
  SITE_INSTAGRAM,
  SITE_NAME,
  SITE_PHONE,
  SITE_TITLE,
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

function localBusinessNode() {
  return {
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    alternateName: 'Blue Waves',
    url: SITE_URL,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    image: `${SITE_URL}/bluebueno.png`,
    logo: `${SITE_URL}/icon.png`,
    description: SITE_DESCRIPTION,
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

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      localBusinessNode(),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: 'es-MX',
        publisher: { '@id': BUSINESS_ID },
      },
    ],
  }
}

export function fleetItemListJsonLd(yachts: Yacht[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Flota de yates en renta en Cancún',
    description: 'Renta de yates de lujo y charter privado en Cancún con Blue Waves.',
    numberOfItems: yachts.length,
    itemListElement: yachts.map((yacht, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/yates/${getYachtSlug(yacht)}`,
      name: yacht.name,
    })),
  }
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SITE_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function yachtProductJsonLd(yacht: Yacht, reviews: YachtReview[] = []) {
  const slug = getYachtSlug(yacht)
  const url = `${SITE_URL}/yates/${slug}`
  const images = getYachtImages(yacht).map(toAbsoluteUrl)
  const price = parseYachtPrice(yacht)
  const available = yacht.available !== false
  const rating = averageRating(reviews)
  const size = yacht.size?.trim()
  const capacity = yacht.capacity
  const description =
    yacht.description?.replace(/\s+/g, ' ').trim() ||
    `Renta el yate ${yacht.name} en Cancún${size ? `, ${size}` : ''}${
      capacity ? `, hasta ${capacity} huéspedes` : ''
    }. Charter privado con Blue Waves.`

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
            name: 'Renta de yates en Cancún',
            item: SITE_URL,
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
        category: 'Renta de yates en Cancún',
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
          category: 'Charter de yate',
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
