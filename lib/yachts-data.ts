import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { getYachtSlug, type Yacht } from '@/lib/yachts'

export const getYachts = cache(async (): Promise<Yacht[]> => {
  const { data, error } = await supabase
    .from('yachts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando yates:', error.message)
    return []
  }

  return (data ?? []) as Yacht[]
})

export const getYachtBySlug = cache(async (slug: string): Promise<Yacht | null> => {
  const yachts = await getYachts()
  return yachts.find((yacht) => getYachtSlug(yacht) === slug) ?? null
})
