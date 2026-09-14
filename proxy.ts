import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, hasLocale } from '@/lib/i18n/config'

const LOCALE_EXEMPT_SEGMENTS = new Set([
  'api',
  'dashboard',
  'auth',
  'links',
  'pago-exitoso',
  'pay',
])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1] ?? ''

  if (LOCALE_EXEMPT_SEGMENTS.has(firstSegment)) {
    return NextResponse.next()
  }

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
    '/((?!api/|dashboard(?:/|$)|auth(?:/|$)|links(?:/|$)|pago-exitoso(?:/|$)|pay(?:/|$)|_next/|favicon.ico|sitemap.xml|robots.txt|icon.png|.*\\..*).*)',
  ],
}
