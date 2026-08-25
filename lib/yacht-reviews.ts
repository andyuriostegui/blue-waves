import { supabase } from '@/lib/supabase'
import { YACHT_REVIEW_SEED } from '@/lib/yacht-reviews-seed'

export type YachtReview = {
  author: string
  quote: string
  rating: number
  source?: string
  date?: string
}

function storagePath(yachtId: string) {
  return `reviews/${yachtId}.json`
}

export function parseYachtReviews(value: unknown): YachtReview[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const author = String(row.author ?? '').trim()
      const quote = String(row.quote ?? '').trim()
      const rating = Number(row.rating)
      if (!author || !quote) return null
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null

      const source = String(row.source ?? '').trim()
      const date = String(row.date ?? '').trim()

      return {
        author,
        quote,
        rating: Math.round(rating),
        ...(source ? { source } : {}),
        ...(date ? { date } : {}),
      } satisfies YachtReview
    })
    .filter((item): item is YachtReview => item != null)
}

export function averageRating(reviews: YachtReview[]): number | null {
  if (reviews.length === 0) return null
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function reviewsForJsonLd(reviews: YachtReview[]): YachtReview[] {
  return reviews.filter((review) => Boolean(review.source?.trim()))
}

export async function loadYachtReviews(
  yachtId: string,
  slug?: string,
): Promise<YachtReview[]> {
  const { data } = supabase.storage.from('yachts').getPublicUrl(storagePath(yachtId))
  try {
    const response = await fetch(data.publicUrl, { cache: 'no-store' })
    if (response.ok) {
      const stored = parseYachtReviews(await response.json())
      if (stored.length > 0) return stored
    }
  } catch {
    // Use the editorial notes for this vessel when nothing is saved yet.
  }

  if (slug && YACHT_REVIEW_SEED[slug]) {
    return YACHT_REVIEW_SEED[slug]
  }
  return []
}

export async function saveYachtReviews(yachtId: string, reviews: YachtReview[]) {
  const payload = parseYachtReviews(reviews)
  const body = new Blob([JSON.stringify(payload)], { type: 'application/json' })
  const { error } = await supabase.storage.from('yachts').upload(
    storagePath(yachtId),
    body,
    { upsert: true, contentType: 'application/json' },
  )
  if (error) throw error
  return payload
}
