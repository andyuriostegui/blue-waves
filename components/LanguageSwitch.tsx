'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { LOCALES, switchLocalePath, type Locale } from '@/lib/i18n/config'
import { useI18n } from '@/components/LocaleProvider'

function switchClasses(tone: 'light' | 'dark') {
  const light = {
    muted: 'text-white hover:bg-white/15',
    active: 'bg-white text-[#0A192F]',
    shell: 'border-white/40 bg-white/20 backdrop-blur-sm',
  }
  const dark = {
    muted: 'text-zinc-500 hover:text-[#0A192F]',
    active: 'bg-[#0A192F] text-white',
    shell: 'border-zinc-300 bg-white',
  }
  return tone === 'light' ? light : dark
}

function LocaleOptions({
  locale,
  tone,
  hrefFor,
}: {
  locale: Locale
  tone: 'light' | 'dark'
  hrefFor?: (item: Locale) => string
}) {
  const colors = switchClasses(tone)
  const itemClass =
    'inline-flex h-7 w-8 items-center justify-center rounded-full text-[9px] font-bold uppercase tracking-[0.14em] transition sm:h-8 sm:w-9 sm:text-[10px]'

  return (
    <ul className={`flex items-center rounded-full border p-0.5 ${colors.shell}`}>
      {LOCALES.map((item) => {
        const isActive = item === locale
        const label = item.toUpperCase()
        const classes = `${itemClass} ${isActive ? colors.active : colors.muted}`

        return (
          <li key={item}>
            {hrefFor ? (
              <Link
                href={hrefFor(item)}
                hrefLang={item === 'es' ? 'es-MX' : 'en'}
                lang={item === 'es' ? 'es-MX' : 'en'}
                className={classes}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            ) : (
              <span className={classes}>{label}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

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

  return (
    <nav aria-label={dict.nav.language} className={`shrink-0 ${className ?? ''}`}>
      <LocaleOptions
        locale={locale}
        tone={tone}
        hrefFor={(item) => `${switchLocalePath(pathname, item)}${suffix}`}
      />
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
  return (
    <div className={`shrink-0 ${className ?? ''}`} aria-hidden>
      <LocaleOptions locale={locale} tone={tone} />
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
