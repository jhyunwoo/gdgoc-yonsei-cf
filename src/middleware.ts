import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { i18n } from './i18n-config'

import { match as matchLocale } from '@formatjs/intl-localematcher'

function getLocale(request: NextRequest): string | undefined {
  // Edge-compatible Accept-Language parser
  const acceptLanguage = request.headers.get('accept-language')
  const languages: string[] = []
  
  if (acceptLanguage) {
    // Parse Accept-Language header manually
    // Example: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
    const parsed = acceptLanguage.split(',').map(lang => {
      const [tag, qFunc] = lang.trim().split(';')
      const q = qFunc ? parseFloat(qFunc.split('=')[1]) : 1.0
      return { tag, q }
    }).sort((a, b) => b.q - a.q).map(item => item.tag)
    
    languages.push(...parsed)
  }

  // @ts-expect-error - i18n.locales is a readonly array
  const locales: string[] = i18n.locales

  // Fix: If no languages found, default to en-US to prevent matchLocale error if applicable, 
  // though matchLocale usually handles empty arrays by returning default. 
  // We pass detected languages to matchLocale.
  return matchLocale(languages, locales, i18n.defaultLocale)
}

export const runtime = 'experimental-edge'

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  // if (
  //   [
  //     '/manifest.json',
  //     '/favicon.ico',
  //     // Your other files in `public`
  //   ].includes(pathname)
  // )
  //   return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|sitemap.xml|auth|robots.txt|admin|_next/static|_next/image|default-image.png|default-user-profile.png|gdgoc-logo.png|session-default.png|favicon.ico|googleda69d559d3e8d484.html).*)',
  ],
}
