import { SITE_URL } from '@/lib/site'
import { en } from './en'
import { es, type Dictionary } from './es'
import {
  DEFAULT_LOCALE,
  hasLocale,
  type Locale,
  localizePath,
} from './config'

export type { Dictionary, Locale }
export {
  DEFAULT_LOCALE,
  LOCALES,
  getLocaleFromPathname,
  hasLocale,
  htmlLang,
  localizePath,
  ogAlternateLocale,
  ogLocale,
  stripLocalePrefix,
  switchLocalePath,
} from './config'

const dictionaries: Record<Locale, Dictionary> = { es, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]
}

export function localeUrl(locale: Locale, path = '/'): string {
  return `${SITE_URL}${localizePath(locale, path)}`
}

export function languageAlternates(path = '/') {
  return {
    'es-MX': localeUrl('es', path),
    en: localeUrl('en', path),
    'x-default': localeUrl('es', path),
  }
}

export function parseLocale(value: string | undefined): Locale {
  if (value && hasLocale(value)) return value
  return DEFAULT_LOCALE
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

export function yachtFallbackDescription(locale: Locale, name: string): string {
  return fill(getDictionary(locale).yacht.fallbackDescription, { name })
}

export function yachtMetaTitle(locale: Locale, name: string): string {
  return fill(getDictionary(locale).yacht.metaTitle, { name })
}

export function yachtOgAlt(locale: Locale, name: string): string {
  return fill(getDictionary(locale).yacht.ogAlt, { name })
}

export function yachtPhotoAlt(
  locale: Locale,
  name: string,
  n: number,
  total: number,
): string {
  return fill(getDictionary(locale).yacht.photoAlt, { name, n, total })
}

export function yachtMetaKeywords(locale: Locale, name: string, size: string): string[] {
  const dict = getDictionary(locale)
  if (locale === 'en') {
    return [
      `${name} charter Cancún`,
      `${name} yacht Cancún`,
      'yacht charter Cancún',
      'private yacht Cancún',
      size,
    ]
  }
  return [
    `renta ${name} Cancún`,
    `yate ${name} Cancún`,
    ...dict.seo.keywords.slice(0, 2),
    size,
  ]
}
