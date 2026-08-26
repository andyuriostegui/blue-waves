'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import LanguageSwitch from '@/components/LanguageSwitch'
import { useI18n } from '@/components/LocaleProvider'
import {
  EXPERIENCE_CHAPTERS,
  EXPERIENCE_LOOKBOOK,
  EXPERIENCIAS_CTA_MEDIA,
  EXPERIENCIAS_HERO_MEDIA,
  type ExperienceChapter,
  type ExperienceMedia,
} from '@/lib/experiencias'
import { localizePath } from '@/lib/i18n/config'
import { SITE_FACEBOOK, SITE_INSTAGRAM, SITE_LOCATION } from '@/lib/site'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '600'],
  variable: '--font-exp-serif',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-exp-sans',
})

function CoverMedia({
  media,
  className,
  priority = false,
}: {
  media: ExperienceMedia
  className?: string
  priority?: boolean
}) {
  if (media.type === 'video') {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full ${className ?? ''}`}
        aria-hidden
      >
        <source src={media.src} type="video/mp4" />
      </video>
    )
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      preload={priority}
      loading={priority ? 'eager' : undefined}
      quality={90}
      sizes="100vw"
      className={className}
    />
  )
}

export default function ExperienciasPage({
  hero = EXPERIENCIAS_HERO_MEDIA,
  cta = EXPERIENCIAS_CTA_MEDIA,
  chapters = EXPERIENCE_CHAPTERS,
  lookbook = EXPERIENCE_LOOKBOOK,
}: {
  hero?: ExperienceMedia
  cta?: ExperienceMedia
  chapters?: ExperienceChapter[]
  lookbook?: ExperienceMedia[]
}) {
  const { dict, locale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [lightbox, setLightbox] = useState<ExperienceMedia | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`${serif.variable} ${sans.variable} min-h-screen overflow-x-hidden bg-[#F4F4F4] font-[family-name:var(--font-exp-sans)] text-[#0A192F] antialiased`}
    >
      <SiteNav scrolled={scrolled} />

      <header className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-[#0B2A30]">
        <CoverMedia media={hero} priority className="object-cover scale-105" />
        <div className="absolute inset-0 bg-[#0B2A30]/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B2A30] via-[#0B2A30]/40 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/70 md:text-[10px] md:tracking-[0.48em]"
          >
            {dict.experiencias.heroKicker}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-[12ch] font-[family-name:var(--font-exp-serif)] text-[2.55rem] font-light italic leading-[0.95] text-white drop-shadow-2xl sm:max-w-none sm:text-6xl md:text-[8.5vw]"
          >
            {dict.experiencias.heroTitle}
          </motion.p>
          <h1 className="mt-6 max-w-[16rem] text-[8px] font-medium uppercase tracking-[0.16em] text-white/75 sm:max-w-none md:text-[10px] md:tracking-[0.42em]">
            {dict.experiencias.heroH1}
          </h1>
          <motion.a
            href="#diario"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#0A192F] shadow-lg transition hover:bg-zinc-200 md:text-[10px]"
          >
            {dict.experiencias.seeDay}
          </motion.a>
        </div>
      </header>

      <section
        id="diario"
        className="yacht-linen border-b border-[#0A192F]/8 px-6 py-16 md:py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-sky-700">
            {dict.experiencias.diaryKicker}
          </p>
          <p className="mt-6 font-[family-name:var(--font-exp-serif)] text-3xl font-light italic leading-tight text-[#0A192F] md:text-5xl">
            {dict.experiencias.diaryTitle}
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-[#0A192F]/30" />
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-600 md:text-base">
            {dict.experiencias.diaryBody}
          </p>
        </div>

        <nav
          aria-label={dict.experiencias.diaryNav}
          className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className="text-[9px] font-semibold uppercase tracking-[0.28em] text-zinc-500 transition hover:text-[#0A192F]"
            >
              {chapter.index} {chapter.kicker}
            </a>
          ))}
        </nav>
      </section>

      {chapters.map((chapter, index) => (
        <Chapter
          key={chapter.id}
          chapter={chapter}
          reverse={index % 2 === 1}
          onOpen={setLightbox}
        />
      ))}

      <section className="bg-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-zinc-400">
              {dict.experiencias.lookbookKicker}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-exp-serif)] text-3xl italic text-[#0A192F] md:text-5xl">
              {dict.experiencias.lookbookTitle}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {lookbook.map((item, index) => (
              <button
                key={`${item.src}-${index}`}
                type="button"
                onClick={() => {
                  if (item.type === 'image') setLightbox(item)
                }}
                className="group relative aspect-[4/5] overflow-hidden bg-zinc-100 md:aspect-[5/4]"
                aria-label={item.alt}
              >
                {item.type === 'video' ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-[#0A192F] text-white">
                    <Play size={22} fill="currentColor" />
                  </span>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[#0A192F]/0 transition group-hover:bg-[#0A192F]/15" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0A192F] px-6 py-24 text-center md:py-32">
        <CoverMedia media={cta} className="object-cover object-center opacity-40" />
        <div className="absolute inset-0 bg-[#0A192F]/55" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/50">
            {dict.experiencias.ctaKicker}
          </p>
          <p className="mt-5 font-[family-name:var(--font-exp-serif)] text-4xl font-light italic text-white md:text-6xl">
            {dict.experiencias.ctaTitle}
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm font-light text-white/70">
            {dict.experiencias.ctaBody}
          </p>
          <Link
            href={localizePath(locale, '/#contact')}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-[9px] font-bold uppercase tracking-[0.28em] text-[#0A192F] shadow-lg transition hover:bg-zinc-200 md:text-[10px]"
          >
            {dict.experiencias.ctaButton}
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-100 bg-white py-20 text-center">
        <Link
          href={localizePath(locale, '/')}
          className="font-[family-name:var(--font-exp-serif)] text-4xl italic text-[#0A192F]"
        >
          Blue Waves
        </Link>
        <p className="mt-3 mb-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
          {dict.footer.tagline}
        </p>
        <p className="mb-10 text-[11px] font-light text-zinc-500">{SITE_LOCATION}</p>
        <LanguageSwitch tone="dark" className="mb-10 flex justify-center" />
        <nav aria-label={dict.footer.social} className="mb-10">
          <ul className="flex items-start justify-center gap-2 sm:gap-4">
            <li>
              <SocialLink href={SITE_INSTAGRAM} label="Instagram">
                <InstagramIcon />
              </SocialLink>
            </li>
            <li>
              <SocialLink href={SITE_FACEBOOK} label="Facebook">
                <FacebookIcon />
              </SocialLink>
            </li>
          </ul>
        </nav>
        <p className="text-[9px] uppercase tracking-[0.6em] text-zinc-300">
          {dict.footer.copyright}
        </p>
      </footer>

      <Lightbox media={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}

function SiteNav({ scrolled }: { scrolled: boolean }) {
  const { dict, locale } = useI18n()
  const home = localizePath(locale, '/')
  const experiences = localizePath(locale, '/experiencias')
  const fleet = localizePath(locale, '/#fleet')
  const journey = localizePath(locale, '/#journey')
  const contact = localizePath(locale, '/#contact')

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-all duration-500 sm:px-5 md:gap-8 md:px-10 md:py-6 ${
        scrolled
          ? 'bg-[#fffcf6]/92 text-[#0A192F] shadow-[0_8px_30px_rgba(10,25,47,0.06)] backdrop-blur-md'
          : 'bg-transparent text-white'
      }`}
    >
      <Link
        href={home}
        className="min-w-0 truncate text-[9px] font-bold uppercase tracking-[0.18em] md:text-[10px] md:tracking-[0.5em]"
      >
        Blue Waves
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-8">
        <div
          className={`hidden gap-8 text-[10px] font-medium uppercase tracking-widest md:flex ${
            scrolled ? 'text-[#0A192F]/70' : 'text-white/70'
          }`}
        >
          <Link href={experiences} className={scrolled ? 'text-[#0A192F]' : 'text-white'}>
            {dict.nav.experiences}
          </Link>
          <Link href={fleet} className="transition hover:text-inherit">
            {dict.nav.fleet}
          </Link>
          <Link href={journey} className="transition hover:text-inherit">
            {dict.nav.journey}
          </Link>
        </div>
        <LanguageSwitch tone={scrolled ? 'dark' : 'light'} />
        <Link
          href={contact}
          className={`shrink-0 rounded-full px-3 py-2 text-[8px] font-bold tracking-widest transition sm:px-5 md:px-6 md:text-[9px] ${
            scrolled
              ? 'bg-[#0A192F] text-white hover:bg-[#0A192F]/90'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {dict.nav.book}
        </Link>
      </div>
    </nav>
  )
}

function Chapter({
  chapter,
  reverse,
  onOpen,
}: {
  chapter: ExperienceChapter
  reverse: boolean
  onOpen: (media: ExperienceMedia) => void
}) {
  return (
    <section
      id={chapter.id}
      className={`scroll-mt-24 px-4 py-16 md:px-8 md:py-24 lg:px-12 ${
        reverse ? 'bg-white' : 'yacht-linen'
      }`}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div
          className={`lg:col-span-7 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <MediaStage media={chapter.media} onOpen={onOpen} />
        </div>
        <div
          className={`lg:col-span-5 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-sky-700">
              {chapter.index} — {chapter.kicker}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-exp-serif)] text-4xl font-light italic leading-[1.05] text-[#0A192F] md:text-6xl">
              {chapter.title}
            </h2>
            <div className="mt-5 h-px w-12 bg-sky-500" />
            <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-zinc-600">
              {chapter.body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MediaStage({
  media,
  onOpen,
}: {
  media: ExperienceMedia[]
  onOpen: (item: ExperienceMedia) => void
}) {
  const { dict } = useI18n()
  const [active, setActive] = useState(0)
  const current = media[active] ?? media[0]
  const total = media.length

  const goTo = useCallback(
    (index: number) => setActive((index + total) % total),
    [total],
  )

  if (!current) return null

  return (
    <div className="relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-black sm:aspect-[5/4] lg:aspect-[16/11]">
        {current.type === 'video' ? (
          <video
            key={current.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            aria-label={current.alt}
          >
            <source src={current.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            quality={90}
            className="object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {current.type === 'image' ? (
          <button
            type="button"
            onClick={() => onOpen(current)}
            className="absolute inset-0 z-10 cursor-zoom-in"
            aria-label={`${dict.experiencias.expand}: ${current.alt}`}
          />
        ) : (
          <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
            <Play size={10} fill="currentColor" />
            {dict.experiencias.film}
          </span>
        )}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0A192F] md:flex"
              aria-label={dict.experiencias.prev}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0A192F] md:flex"
              aria-label={dict.experiencias.next}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="mt-3 flex w-full justify-center gap-1.5 overflow-x-auto yacht-filmstrip md:mt-4 md:gap-2">
          {media.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md transition md:h-14 md:w-14 ${
                index === active
                  ? 'ring-2 ring-sky-300 ring-offset-1 ring-offset-[#f3efe6]'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`${dict.experiencias.expand} ${index + 1}`}
              aria-current={index === active}
            >
              {item.type === 'video' ? (
                <span className="flex h-full w-full items-center justify-center bg-[#0A192F] text-white">
                  <Play size={14} fill="currentColor" />
                </span>
              ) : (
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Lightbox({
  media,
  onClose,
}: {
  media: ExperienceMedia | null
  onClose: () => void
}) {
  const { dict } = useI18n()
  useEffect(() => {
    if (!media) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [media, onClose])

  if (!media || media.type !== 'image') return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0A192F]/92 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={media.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white"
        aria-label={dict.nav.close}
      >
        <X size={18} strokeWidth={1.5} />
      </button>
      <div
        className="relative h-[80vh] w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="100vw"
          quality={90}
          className="object-contain"
        />
      </div>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group flex flex-col items-center gap-2.5 px-4 text-zinc-400 transition-colors duration-300 hover:text-[#0A192F]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 group-hover:border-[#0A192F] group-hover:text-[#0A192F]">
        {children}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.32em]">{label}</span>
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
