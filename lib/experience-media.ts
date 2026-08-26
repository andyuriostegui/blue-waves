import { supabase } from '@/lib/supabase'
import {
  EXPERIENCE_CHAPTERS,
  EXPERIENCE_LOOKBOOK,
  EXPERIENCIAS_CTA_MEDIA,
  EXPERIENCIAS_HERO_MEDIA,
  type ExperienceChapter,
  type ExperienceMedia,
} from '@/lib/experiencias'

export type ExperienceSlotId =
  | 'hero'
  | 'cta'
  | 'lookbook'
  | 'zarpe'
  | 'isla-mujeres'
  | 'mesa'
  | 'atardecer'
  | 'toys'

export type StoredExperienceMedia = ExperienceMedia & {
  id: string
  path?: string
}

export type ExperienceMediaManifest = {
  version: 1
  updatedAt: string
  slots: Partial<Record<ExperienceSlotId, StoredExperienceMedia[]>>
}

export type ResolvedExperienceContent = {
  hero: ExperienceMedia
  cta: ExperienceMedia
  chapters: ExperienceChapter[]
  lookbook: ExperienceMedia[]
}

export const EXPERIENCE_MEDIA_SLOTS: {
  id: ExperienceSlotId
  label: string
  hint: string
}[] = [
  { id: 'hero', label: 'Portada', hint: 'Hero a pantalla completa. La primera foto o video es la que se ve.' },
  { id: 'zarpe', label: '01 — El zarpe', hint: 'Galería del capítulo Bahía de Cancún.' },
  { id: 'isla-mujeres', label: '02 — Isla Mujeres', hint: 'Agua turquesa y anclaje.' },
  { id: 'mesa', label: '03 — La mesa', hint: 'Comida, champagne y mesa a bordo.' },
  { id: 'atardecer', label: '04 — El atardecer', hint: 'Golden hour, jacuzzi y brindis.' },
  { id: 'toys', label: '05 — Water toys', hint: 'Jet ski, AquaBanas y juguetes.' },
  { id: 'lookbook', label: 'Lookbook', hint: 'Rejilla de momentos al final de la página.' },
  { id: 'cta', label: 'Cierre / Reservar', hint: 'Fondo de la sección para cotizar.' },
]

const BUCKET = 'yachts'
const MANIFEST_PATH = 'experiencias/manifest.json'

function staticId(src: string) {
  return `static:${src}`
}

function asStored(media: ExperienceMedia): StoredExperienceMedia {
  return {
    id: staticId(media.src),
    src: media.src,
    type: media.type,
    alt: media.alt,
  }
}

export function defaultExperienceSlots(): Record<ExperienceSlotId, StoredExperienceMedia[]> {
  const chapterMedia = Object.fromEntries(
    EXPERIENCE_CHAPTERS.map((chapter) => [chapter.id, chapter.media.map(asStored)]),
  ) as Record<ExperienceSlotId, StoredExperienceMedia[]>

  return {
    hero: [asStored(EXPERIENCIAS_HERO_MEDIA)],
    cta: [asStored(EXPERIENCIAS_CTA_MEDIA)],
    lookbook: EXPERIENCE_LOOKBOOK.map(asStored),
    zarpe: chapterMedia.zarpe ?? [],
    'isla-mujeres': chapterMedia['isla-mujeres'] ?? [],
    mesa: chapterMedia.mesa ?? [],
    atardecer: chapterMedia.atardecer ?? [],
    toys: chapterMedia.toys ?? [],
  }
}

function isSlotId(value: string): value is ExperienceSlotId {
  return EXPERIENCE_MEDIA_SLOTS.some((slot) => slot.id === value)
}

function parseMedia(value: unknown): StoredExperienceMedia | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const src = String(row.src ?? '').trim()
  const type = row.type === 'video' ? 'video' : row.type === 'image' ? 'image' : null
  if (!src || !type) return null
  const alt = String(row.alt ?? '').trim()
  const id = String(row.id ?? '').trim() || staticId(src)
  const path = String(row.path ?? '').trim()
  return {
    id,
    src,
    type,
    alt,
    ...(path ? { path } : {}),
  }
}

function parseManifest(value: unknown): ExperienceMediaManifest | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const rawSlots = row.slots
  if (!rawSlots || typeof rawSlots !== 'object') return null

  const slots: ExperienceMediaManifest['slots'] = {}
  for (const [key, list] of Object.entries(rawSlots as Record<string, unknown>)) {
    if (!isSlotId(key) || !Array.isArray(list)) continue
    slots[key] = list.map(parseMedia).filter((item): item is StoredExperienceMedia => item != null)
  }

  return {
    version: 1,
    updatedAt: String(row.updatedAt ?? ''),
    slots,
  }
}

function toPublicMedia(item: StoredExperienceMedia): ExperienceMedia {
  return { src: item.src, type: item.type, alt: item.alt }
}

function slotOrDefault(
  manifest: ExperienceMediaManifest | null,
  slot: ExperienceSlotId,
): StoredExperienceMedia[] {
  const defaults = defaultExperienceSlots()
  if (!manifest) return defaults[slot]
  if (Object.prototype.hasOwnProperty.call(manifest.slots, slot)) {
    return manifest.slots[slot] ?? []
  }
  return defaults[slot]
}

export function resolveExperienceContent(
  manifest: ExperienceMediaManifest | null,
): ResolvedExperienceContent {
  const heroList = slotOrDefault(manifest, 'hero')
  const ctaList = slotOrDefault(manifest, 'cta')
  const lookbook = slotOrDefault(manifest, 'lookbook')

  return {
    hero: toPublicMedia(heroList[0] ?? asStored(EXPERIENCIAS_HERO_MEDIA)),
    cta: toPublicMedia(ctaList[0] ?? asStored(EXPERIENCIAS_CTA_MEDIA)),
    lookbook: lookbook.map(toPublicMedia),
    chapters: EXPERIENCE_CHAPTERS.map((chapter) => ({
      ...chapter,
      media: slotOrDefault(manifest, chapter.id as ExperienceSlotId).map(toPublicMedia),
    })),
  }
}

export function slotsForEditor(
  manifest: ExperienceMediaManifest | null,
): Record<ExperienceSlotId, StoredExperienceMedia[]> {
  const defaults = defaultExperienceSlots()
  if (!manifest) return defaults
  return {
    ...defaults,
    ...Object.fromEntries(
      EXPERIENCE_MEDIA_SLOTS.map((slot) => [slot.id, slotOrDefault(manifest, slot.id)]),
    ),
  } as Record<ExperienceSlotId, StoredExperienceMedia[]>
}

function manifestPublicUrl() {
  return supabase.storage.from(BUCKET).getPublicUrl(MANIFEST_PATH).data.publicUrl
}

export async function loadExperienceManifest(): Promise<ExperienceMediaManifest | null> {
  try {
    const response = await fetch(manifestPublicUrl(), { cache: 'no-store' })
    if (!response.ok) return null
    return parseManifest(await response.json())
  } catch {
    return null
  }
}

export async function loadResolvedExperienceContent(): Promise<ResolvedExperienceContent> {
  return resolveExperienceContent(await loadExperienceManifest())
}

export async function saveExperienceManifest(
  slots: Record<ExperienceSlotId, StoredExperienceMedia[]>,
): Promise<ExperienceMediaManifest> {
  const manifest: ExperienceMediaManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    slots,
  }
  const body = new Blob([JSON.stringify(manifest)], { type: 'application/json' })
  const { error } = await supabase.storage.from(BUCKET).upload(MANIFEST_PATH, body, {
    upsert: true,
    contentType: 'application/json',
  })
  if (error) throw error
  return manifest
}

function extensionOf(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName
  if (file.type.startsWith('video/')) return 'mp4'
  return 'jpg'
}

function mediaTypeOf(file: File): 'image' | 'video' {
  if (file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name)) return 'video'
  return 'image'
}

function isHeic(file: File) {
  return /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
}

async function prepareFile(file: File): Promise<{ blob: Blob; type: 'image' | 'video'; ext: string }> {
  if (isHeic(file)) {
    throw new Error('El navegador no puede usar fotos HEIC. Conviértelas a JPG o PNG.')
  }

  const type = mediaTypeOf(file)
  if (type === 'video') {
    if (file.size > 40 * 1024 * 1024) {
      throw new Error(`El video ${file.name} pesa más de 40 MB.`)
    }
    return { blob: file, type, ext: extensionOf(file) }
  }

  const imageCompression = (await import('browser-image-compression')).default
  const compressed = await imageCompression(file, {
    maxSizeMB: 4,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    initialQuality: 0.9,
  })
  return { blob: compressed, type: 'image', ext: extensionOf(file) === 'png' ? 'jpg' : extensionOf(file) }
}

export async function uploadExperienceFiles(
  slot: ExperienceSlotId,
  files: FileList | File[],
  current: Record<ExperienceSlotId, StoredExperienceMedia[]>,
): Promise<Record<ExperienceSlotId, StoredExperienceMedia[]>> {
  const list = Array.from(files)
  if (list.length === 0) return current

  const uploaded = await Promise.all(
    list.map(async (file) => {
      const prepared = await prepareFile(file)
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${prepared.ext}`
      const path = `experiencias/media/${slot}/${fileName}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, prepared.blob, {
        contentType: prepared.blob.type || (prepared.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return {
        id: path,
        src: data.publicUrl,
        type: prepared.type,
        alt: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
        path,
      } satisfies StoredExperienceMedia
    }),
  )

  const next = {
    ...current,
    [slot]: [...current[slot], ...uploaded],
  }
  await saveExperienceManifest(next)
  return next
}

export async function removeExperienceMedia(
  slot: ExperienceSlotId,
  id: string,
  current: Record<ExperienceSlotId, StoredExperienceMedia[]>,
): Promise<Record<ExperienceSlotId, StoredExperienceMedia[]>> {
  const target = current[slot].find((item) => item.id === id)
  if (target?.path) {
    const { error } = await supabase.storage.from(BUCKET).remove([target.path])
    if (error) console.error(error)
  }

  const next = {
    ...current,
    [slot]: current[slot].filter((item) => item.id !== id),
  }
  await saveExperienceManifest(next)
  return next
}

export async function reorderExperienceSlot(
  slot: ExperienceSlotId,
  items: StoredExperienceMedia[],
  current: Record<ExperienceSlotId, StoredExperienceMedia[]>,
): Promise<Record<ExperienceSlotId, StoredExperienceMedia[]>> {
  const next = { ...current, [slot]: items }
  await saveExperienceManifest(next)
  return next
}
