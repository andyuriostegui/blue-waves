import Link from 'next/link'
import { headers } from 'next/headers'
import { getDictionary, localizePath, parseLocale } from '@/lib/i18n'

export default async function YachtNotFound() {
  const locale = parseLocale((await headers()).get('x-locale') ?? 'es')
  const dict = getDictionary(locale)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-zinc-500">
        404
      </p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-6xl">
        {dict.yacht.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-md text-center text-sm text-zinc-400">
        {dict.yacht.notFoundBody}
      </p>
      <Link
        href={localizePath(locale, '/#fleet')}
        className="mt-10 border-2 border-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-black"
      >
        {dict.yacht.seeFleet}
      </Link>
    </main>
  )
}
