'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LOCALES, switchLocalePath, type Locale } from '@/lib/i18n/config'
import { useI18n } from '@/components/LocaleProvider'

function LanguageSwitchInner({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const { locale, dict } = useI18n()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const suffix = query ? `?${query}` : ''

  const muted = tone === 'light' ? 'text-white/45 hover:text-white' : 'text-zinc-400 hover:text-[#0A192F]'
  const active = tone === 'light' ? 'text-white' : 'text-[#0A192F]'
  const divider = tone === 'light' ? 'text-white/25' : 'text-zinc-300'

  return (
    <nav aria-label={dict.nav.language} className={className}>
      <ul className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em]">
        {LOCALES.map((item, index) => {
          const href = `${switchLocalePath(pathname, item)}${suffix}`
          const isActive = item === locale
          return (
            <li key={item} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className={divider}>
                  ·
                </span>
              ) : null}
              <Link
                href={href}
                hrefLang={item === 'es' ? 'es-MX' : 'en'}
                lang={item === 'es' ? 'es-MX' : 'en'}
                className={`transition ${isActive ? active : muted}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.toUpperCase()}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function LanguageSwitchFallback({
  className,
  tone = 'light',
  locale,
}: {
  className?: string
  tone?: 'light' | 'dark'
  locale: Locale
}) {
  const muted = tone === 'light' ? 'text-white/45' : 'text-zinc-400'
  const active = tone === 'light' ? 'text-white' : 'text-[#0A192F]'
  const divider = tone === 'light' ? 'text-white/25' : 'text-zinc-300'

  return (
    <div className={className} aria-hidden>
      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.28em]">
        <span className={locale === 'es' ? active : muted}>ES</span>
        <span className={divider}>·</span>
        <span className={locale === 'en' ? active : muted}>EN</span>
      </div>
    </div>
  )
}

export default function LanguageSwitch({
  className,
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const { locale } = useI18n()

  return (
    <Suspense
      fallback={
        <LanguageSwitchFallback className={className} tone={tone} locale={locale} />
      }
    >
      <LanguageSwitchInner className={className} tone={tone} />
    </Suspense>
  )
}
