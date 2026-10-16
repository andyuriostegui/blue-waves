import { cache } from 'react'
import { applyFleetGallery } from '@/lib/fleet-gallery'
import { supabase } from '@/lib/supabase'
import { getYachtSlug, type Yacht } from '@/lib/yachts'

// Same yacht photo, without the BLUE / WAVES words burned into the file.
const CLEAN_COVERS: Record<string, string> = {
  '1776400216073-f8qv4120fx': '/covers/golden-sun.jpg',
  '1776323919578-zli0zrtdhgj': '/covers/vive.jpg',
  '1776323620561-qtc0dtmrsv': '/covers/azimut.jpg',
  '1776317741941-5ua3jithpg8': '/covers/sunseeker.jpg',
  '1776316936780-m00wl9kbedk': '/covers/pershing.jpg',
}

function withoutWatermarks(yacht: Yacht): Yacht {
  const images = (yacht.images ?? [])
    .map((src) => {
      if (!src || src.includes('ISLAN GYPSI/DJI_0276')) return ''
      for (const [id, clean] of Object.entries(CLEAN_COVERS)) {
        if (src.includes(id)) return clean
      }
      return src
    })
    .filter((src) => src.length > 0)
  if (images.length === 0) return yacht
  return { ...yacht, images }
}

export const getYachts = cache(async (): Promise<Yacht[]> => {
  const { data, error } = await supabase
    .from('yachts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando yates:', error.message)
    return applyFleetGallery([]).map(withoutWatermarks)
  }

  return applyFleetGallery((data ?? []) as Yacht[]).map(withoutWatermarks)
})

export const getYachtBySlug = cache(async (slug: string): Promise<Yacht | null> => {
  const yachts = await getYachts()
  return yachts.find((yacht) => getYachtSlug(yacht) === slug) ?? null
})
