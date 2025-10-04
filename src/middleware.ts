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

function resolveLangFromPath(pathname: string): string | null {
  const seg1 = pathname.split('/')[1];
  return linguiConfig.locales.includes(seg1) ? seg1 : null;
}

function shouldSetLangCookie(req: NextRequest, lang: string): boolean {
  const current = req.cookies.get('lang')?.value;
  return !current || current !== lang;
}

function setLangCookieIfNeeded(res: NextResponse, req: NextRequest, lang: string) {
  if (!shouldSetLangCookie(req, lang)) return;
  res.cookies.set('lang', lang, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/icon' ||
    pathname.startsWith('/icon.')
  ) {
    return await auth0.middleware(request);
  }

  const langInPath = resolveLangFromPath(pathname);
  if (!langInPath) {
    const locale = getLocale(request);
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url,
    );
    const res = NextResponse.redirect(redirectUrl);
    setLangCookieIfNeeded(res, request, locale);
    return res;
  }

  const protectedPrefixes = [
    `/${langInPath}/assistant`,
    `/${langInPath}/profile`,
    `/${langInPath}/create-user-profile`,
  ];
  const pathnameIsProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (pathnameIsProtected) {
    const session = await auth0.getSession(request);
    if (!session?.user) {
      const res = NextResponse.redirect(new URL(`/${langInPath}/`, request.url));
      setLangCookieIfNeeded(res, request, langInPath); 
      return res;
    }
  }

  const res = NextResponse.next();
  setLangCookieIfNeeded(res, request, langInPath);
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|sitemap.xml|robots.txt|images|fonts).*)',
  ],
};
