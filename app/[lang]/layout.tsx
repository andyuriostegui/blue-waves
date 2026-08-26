import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/components/LocaleProvider'
import { getDictionary, hasLocale, LOCALES } from '@/lib/i18n'

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = getDictionary(lang)

  return (
    <LocaleProvider locale={lang} dict={dict}>
      {children}
    </LocaleProvider>
  )
}
