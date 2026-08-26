export type Yacht = {
  id: string
  name: string
  slug?: string | null
  size?: string | null
  capacity?: number | null
  cabins?: number | null
  bathrooms?: number | null
  description?: string | null
  features?: string[] | string | null
  includes?: string[] | string | null
  images?: string[] | null
  price?: number | string | null
  currency?: string | null
  available?: boolean | null
  created_at?: string | null
  updated_at?: string | null
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getYachtSlug(yacht: Pick<Yacht, 'id' | 'name' | 'slug'>): string {
  if (yacht.slug) return yacht.slug
  return slugify(yacht.name) || slugify(yacht.id)
}

export function getYachtImages(yacht: Yacht): string[] {
  return (yacht.images ?? []).filter((src): src is string => Boolean(src))
}

export function parseYachtPrice(yacht: Yacht): number | null {
  const value = yacht.price
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.]/g, ''))
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return null
}

export function toStringList(value: Yacht['features']): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function summarizeYachtCopy(
  description?: string | null,
  maxLength = 360,
): string {
  if (!description) return ''
  const cleaned = description.replace(/\s+/g, ' ').trim()
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean)
  let summary = ''
  for (const sentence of sentences) {
    const next = summary ? `${summary} ${sentence}` : sentence
    if (summary && next.length > maxLength) break
    summary = next
    if (summary.length >= 160) break
  }
  if (!summary) return cleaned.slice(0, maxLength).trim()
  return summary
}

export function toSentenceCase(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  const source =
    trimmed === trimmed.toUpperCase() ? trimmed.toLowerCase() : trimmed
  return source.charAt(0).toUpperCase() + source.slice(1)
}

export function formatLength(size?: string | null): string {
  if (!size?.trim()) return '—'
  return size.replace(/\s+/g, '').toUpperCase()
}

export function formatGuests(capacity?: number | null): string {
  if (capacity == null) return '—'
  return `${capacity} ${capacity === 1 ? 'GUEST' : 'GUESTS'}`
}

export function formatRooms(cabins?: number | null): string {
  if (cabins == null) return '—'
  return `${cabins} ${cabins === 1 ? 'ROOM' : 'ROOMS'}`
}

export function formatBaths(bathrooms?: number | null): string {
  if (bathrooms == null) return '—'
  return `${bathrooms} WC`
}

export function yachtMetaDescription(
  yacht: Yacht,
  fallback: (name: string) => string,
  useDatabaseCopy = true,
): string {
  const fromDb = yacht.description?.replace(/\s+/g, ' ').trim()
  if (useDatabaseCopy && fromDb && fromDb.length >= 70) {
    return fromDb.length > 160 ? `${fromDb.slice(0, 157).trimEnd()}...` : fromDb
  }

  return fallback(yacht.name.trim())
}
