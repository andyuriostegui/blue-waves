import type { MetadataRoute } from 'next'
import { EXPERIENCIAS_OG_IMAGE, EXPERIENCIAS_PATH } from '@/lib/experiencias'
import { languageAlternates, LOCALES, localeUrl } from '@/lib/i18n'
import { SITE_URL, toAbsoluteUrl } from '@/lib/site'
import { getYachts } from '@/lib/yachts-data'
import { getYachtImages, getYachtSlug } from '@/lib/yachts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const yachts = await getYachts()

  const staticPaths = ['/', EXPERIENCIAS_PATH]

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: localeUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.9,
      alternates: {
        languages: languageAlternates(path),
      },
      images:
        path === '/'
          ? [`${SITE_URL}/bluebueno.png`]
          : [toAbsoluteUrl(EXPERIENCIAS_OG_IMAGE)],
    })),
  )

  const yachtEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    yachts.map((yacht) => {
      const path = `/yates/${getYachtSlug(yacht)}`
      const images = getYachtImages(yacht).map(toAbsoluteUrl)
      return {
        url: localeUrl(locale, path),
        lastModified: yacht.updated_at || yacht.created_at || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: languageAlternates(path),
        },
        images: images.length > 0 ? images : undefined,
      }
    }),
  )

  return [...staticEntries, ...yachtEntries]
}
