import type { MetadataRoute } from 'next'
import { SITE_URL, toAbsoluteUrl } from '@/lib/site'
import { getYachts } from '@/lib/yachts-data'
import { getYachtImages, getYachtSlug } from '@/lib/yachts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const yachts = await getYachts()

  const yachtEntries: MetadataRoute.Sitemap = yachts.map((yacht) => {
    const images = getYachtImages(yacht).map(toAbsoluteUrl)
    return {
      url: `${SITE_URL}/yates/${getYachtSlug(yacht)}`,
      lastModified: yacht.updated_at || yacht.created_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: images.length > 0 ? images : undefined,
    }
  })

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      images: [`${SITE_URL}/bluebueno.png`],
    },
    ...yachtEntries,
  ]
}
