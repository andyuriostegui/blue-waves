import { getDictionary, type Locale } from '@/lib/i18n'

export function getFaqs(locale: Locale = 'es') {
  return getDictionary(locale).faq.items
}
