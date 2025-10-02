import { type NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { auth0 } from './lib/auth0';
import linguiConfig from '../lingui.config';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = linguiConfig.locales;
  const negotiator = new Negotiator({ headers: negotiatorHeaders });

  const detectedLocale = negotiator.language(locales);
  return (detectedLocale ?? linguiConfig.sourceLocale) as string;
}

function resolveLang(request: NextRequest, pathname: string): string {
  const pathSegments = pathname.split('/');
  return linguiConfig.locales.includes(pathSegments[1]) ? pathSegments[1] : getLocale(request);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // bypass auth routes and api routes and nextjs internals
  if (
    // pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/icon' ||
    pathname.startsWith('/icon.')
  ) {
    return await auth0.middleware(request);
  }

  // check locale
  const pathnameIsMissingLocale = linguiConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url,
    );
    const res = NextResponse.redirect(redirectUrl);

    // NEW: 重定向时，写入 lang cookie（与将要前往的语言一致）
    res.cookies.set('lang', locale, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  }

  const lang = resolveLang(request, pathname);

  const protectedPrefixes = [
    `/${lang}/assistant`,
    `/${lang}/profile`,
    `/${lang}/create-user-profile`,
  ];
  const pathnameIsProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (pathnameIsProtected) {
    const session = await auth0.getSession(request);
    if (!session?.user) {
      const res = NextResponse.redirect(new URL(`/${lang}/`, request.url));

      res.cookies.set('lang', lang, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });

      return res;
    }
  }

  const res = NextResponse.next();
  res.cookies.set('lang', lang, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|sitemap.xml|robots.txt|images|fonts).*)',
  ],
};
