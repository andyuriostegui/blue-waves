import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, hasLocale } from '@/lib/i18n/config'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1] ?? ''

  if (hasLocale(firstSegment) && firstSegment === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (hasLocale(firstSegment)) {
    const headers = new Headers(request.headers)
    headers.set('x-locale', firstSegment)
    return NextResponse.next({ request: { headers } })
  }

  const url = request.nextUrl.clone()
  url.pathname =
    pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`

  const headers = new Headers(request.headers)
  headers.set('x-locale', DEFAULT_LOCALE)
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: [
    '/((?!api/|dashboard(?:/|$)|auth(?:/|$)|_next/|favicon.ico|sitemap.xml|robots.txt|icon.png|.*\\..*).*)',
  ],
}
