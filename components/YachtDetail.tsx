'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Bath, BedDouble, ChevronLeft, ChevronRight, Ruler, Star, Users, X } from 'lucide-react'
import { averageRating, type YachtReview } from '@/lib/yacht-reviews'
import {
  formatBaths,
  formatGuests,
  formatLength,
  formatRooms,
  summarizeYachtCopy,
  toSentenceCase,
  type Yacht,
} from '@/lib/yachts'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-yacht-serif',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-yacht-sans',
})

const FALLBACK_IMAGE = '/bluebueno.png'

function isBrandedCover(width: number, height: number): boolean {
  const ratio = width / Math.max(height, 1)
  return ratio >= 0.88 && ratio <= 1.12
}

function useGalleryPhotos(images: string[]): string[] {
  const withoutCover = images.length > 1 ? images.slice(1) : images
  const initial = withoutCover.length > 0 ? withoutCover : [FALLBACK_IMAGE]
  const [photos, setPhotos] = useState(initial)

  useEffect(() => {
    if (images.length === 0) {
      setPhotos([FALLBACK_IMAGE])
      return
    }

    let cancelled = false
    const inspect = (src: string) =>
      new Promise<{ src: string; branded: boolean }>((resolve) => {
        const img = new window.Image()
        img.onload = () => {
          resolve({ src, branded: isBrandedCover(img.naturalWidth, img.naturalHeight) })
        }
        img.onerror = () => resolve({ src, branded: false })
        img.src = src
      })

    void (async () => {
      const inspected = await Promise.all(images.map(inspect))
      if (cancelled) return
      const clean = inspected.filter((item) => !item.branded).map((item) => item.src)
      setPhotos(clean.length > 0 ? clean : images)
    })()

    return () => {
      cancelled = true
    }
  }, [images])

  return photos
}

type YachtDetailProps = {
  yacht: Yacht
  images: string[]
  features: string[]
  includes: string[]
  reviews: YachtReview[]
  bookHref: string
}

export default function YachtDetail({
  yacht,
  images,
  features,
  includes,
  reviews = [],
  bookHref,
}: YachtDetailProps) {
  const photos = useGalleryPhotos(images)
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const total = photos.length
  const current = photos[active] ?? FALLBACK_IMAGE
  const highlights = (features.length > 0 ? features : includes).slice(0, 8)
  const description =
    summarizeYachtCopy(yacht.description) ||
    `Renta el yate ${yacht.name.trim()} en Cancún con Blue Waves. Charter privado, salida desde la bahía y tripulación profesional.`
  const rating = averageRating(reviews)

  const goTo = useCallback(
    (index: number) => {
      setActive((index + total) % total)
    },
    [total],
  )

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, prev])

  useEffect(() => {
    setActive(0)
  }, [photos])

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX
    touchStartY.current = event.touches[0].clientY
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = event.changedTouches[0].clientX - touchStartX.current
    const dy = event.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) next()
    else prev()
  }

  const photoCount = `${String(active + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <main
      className={`${serif.variable} ${sans.variable} yacht-linen h-[100dvh] min-h-0 overflow-x-hidden overflow-y-auto overscroll-y-contain font-[family-name:var(--font-yacht-sans)] text-[#0A192F] lg:overflow-hidden`}
    >
      <div className="flex flex-col lg:h-full lg:flex-row">
        <section className="flex w-full shrink-0 flex-col bg-black lg:relative lg:h-full lg:w-[70%]">
          <div
            className="relative h-[42vh] min-h-[260px] w-full touch-pan-y overflow-hidden lg:h-full lg:min-h-0 lg:touch-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={current}
              alt={`${yacht.name} — fotografía ${active + 1} de ${total}, renta de yate en Cancún`}
              fill
              preload
              loading="eager"
              quality={90}
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/25 via-transparent to-black/20 lg:from-black/35" />

            <Link
              href="/#fleet"
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm lg:hidden"
              aria-label="Cerrar ficha y volver a la flota"
            >
              <X size={16} strokeWidth={1.5} />
            </Link>

            {total > 1 ? (
              <p className="absolute left-3 top-3 z-20 rounded-full bg-black/35 px-2.5 py-1 font-[family-name:var(--font-yacht-sans)] text-[10px] tracking-[0.18em] text-white backdrop-blur-sm lg:hidden">
                {photoCount}
              </p>
            ) : null}

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0A192F] lg:left-6 lg:flex"
                  aria-label="Fotografía anterior"
                >
                  <ChevronLeft size={22} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0A192F] lg:right-6 lg:flex"
                  aria-label="Fotografía siguiente"
                >
                  <ChevronRight size={22} strokeWidth={1.5} />
                </button>
              </>
            ) : null}
          </div>

          <div className="z-20 bg-[#0A192F] px-3 py-2 lg:absolute lg:inset-x-6 lg:bottom-5 lg:bg-transparent lg:p-0">
            <div className="mx-auto flex w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-xl yacht-filmstrip lg:gap-2 lg:rounded-2xl lg:bg-black/60 lg:p-2 lg:backdrop-blur-md">
              {photos.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md transition lg:h-14 lg:w-14 ${
                    index === active
                      ? 'ring-2 ring-sky-300 ring-offset-1 ring-offset-black/30'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver fotografía ${index + 1}`}
                  aria-current={index === active}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    loading="lazy"
                    quality={75}
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="yacht-linen relative flex w-full flex-col lg:h-full lg:min-h-0 lg:w-[30%] lg:overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 bg-[#fffcf6]/72" />
          <Link
            href="/#fleet"
            className="absolute right-5 top-5 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 bg-[#fffcf6]/80 text-zinc-500 transition hover:border-[#0A192F] hover:text-[#0A192F] lg:flex"
            aria-label="Cerrar ficha y volver a la flota"
          >
            <X size={16} strokeWidth={1.5} />
          </Link>

          <div className="relative z-[1] flex flex-1 flex-col px-5 pb-28 pt-6 md:px-10 lg:px-9 lg:pb-8 lg:pt-14">
            <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-sky-600 lg:text-[10px]">
              Renta de yate en Cancún
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-yacht-serif)] text-[2rem] font-light italic leading-[1.05] tracking-tight text-[#0A192F] lg:mt-3 lg:text-5xl">
              {yacht.name.trim()}
            </h1>
            {rating != null ? (
              <p className="mt-3 flex items-center gap-2 text-[11px] tracking-[0.12em] text-zinc-500">
                <Stars value={rating} />
                <span className="font-semibold text-[#0A192F]">{rating.toFixed(1)}</span>
                <span>· {reviews.length} guest {reviews.length === 1 ? 'note' : 'notes'}</span>
              </p>
            ) : null}
            <div className="mt-4 h-px w-12 bg-sky-500" />

            {description ? (
              <p className="mt-4 text-[14px] font-light leading-relaxed text-zinc-600 lg:mt-6 lg:text-[15px]">
                {description}
              </p>
            ) : null}

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-zinc-200/80 pt-5 lg:mt-8 lg:gap-x-5 lg:gap-y-6 lg:pt-7">
              <SpecItem
                icon={<Ruler size={16} strokeWidth={1.4} />}
                label="Length"
                value={formatLength(yacht.size)}
              />
              <SpecItem
                icon={<Users size={16} strokeWidth={1.4} />}
                label="Capacity"
                value={formatGuests(yacht.capacity)}
              />
              <SpecItem
                icon={<BedDouble size={16} strokeWidth={1.4} />}
                label="Cabins"
                value={formatRooms(yacht.cabins)}
              />
              <SpecItem
                icon={<Bath size={16} strokeWidth={1.4} />}
                label="Bathrooms"
                value={formatBaths(yacht.bathrooms)}
              />
            </div>

            {highlights.length > 0 ? (
              <ul className="mt-6 lg:mt-8">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="border-b border-zinc-200/70 py-2.5 text-[13px] font-light leading-snug text-zinc-600"
                  >
                    {toSentenceCase(item)}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 hidden pt-2 lg:mt-auto lg:block lg:pt-10">
              <Link
                href={bookHref}
                className="flex w-full items-center justify-center bg-[#0A192F] px-6 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-[#12324a]"
              >
                Book this experience
              </Link>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/70 bg-[#fffcf6]/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
            <Link
              href={bookHref}
              className="flex w-full items-center justify-center bg-[#0A192F] px-6 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white"
            >
              Book this experience
            </Link>
          </div>
        </aside>
      </div>

      {reviews.length > 0 ? (
        <section className="border-t border-zinc-200/70 px-5 pb-28 pt-10 lg:px-12 lg:pb-14 lg:pt-12">
          <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-sky-600 lg:text-[10px]">
            Guest notes
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-yacht-serif)] text-3xl font-light italic text-[#0A192F] lg:text-4xl">
            A bordo del {yacht.name.trim()}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <article
                key={`${review.author}-${review.quote.slice(0, 24)}`}
                className="flex flex-col border-t border-zinc-200/80 pt-5"
              >
                <Stars value={review.rating} />
                <p className="mt-4 font-[family-name:var(--font-yacht-serif)] text-lg font-light italic leading-relaxed text-[#0A192F]">
                  “{review.quote}”
                </p>
                <p className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {review.author}
                  {review.source ? ` · ${review.source}` : ''}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

function Stars({ value }: { value: number }) {
  const filled = Math.round(value)
  return (
    <span className="inline-flex gap-0.5 text-sky-600" aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={13}
          strokeWidth={1.5}
          fill={index < filled ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  )
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-sky-200/80 text-sky-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
          {label}
        </p>
        <p className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#0A192F]">
          {value}
        </p>
      </div>
    </div>
  )
}
