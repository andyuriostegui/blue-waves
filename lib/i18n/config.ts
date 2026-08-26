export const LOCALES = ['es', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export function hasLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'es-MX'
}

export function ogLocale(locale: Locale): string {
  return locale === 'en' ? 'en_US' : 'es_MX'
}

export function ogAlternateLocale(locale: Locale): string {
  return locale === 'en' ? 'es_MX' : 'en_US'
}

export function getLocaleFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  return DEFAULT_LOCALE
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/en' || pathname === '/es') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  if (pathname.startsWith('/es/')) return pathname.slice(3)
  return pathname || '/'
}

export function localizePath(locale: Locale, path: string): string {
  const hashIndex = path.indexOf('#')
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const queryIndex = withoutHash.indexOf('?')
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : ''
  const base = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  const clean = base === '' ? '/' : base

  const localized =
    locale === DEFAULT_LOCALE
      ? clean
      : clean === '/'
        ? `/${locale}`
        : `/${locale}${clean}`

  return `${localized}${query}${hash}`
}

export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  return localizePath(nextLocale, stripLocalePrefix(pathname))
}
