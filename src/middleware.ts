import { type NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { auth0 } from './lib/auth0';
import linguiConfig from '../lingui.config';

function hyphenToUnderscore(locale: string): string {
  if (!locale) return locale;
  return locale.includes('-') ? locale.replace('-', '_') : locale;
}

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Negotiate against hyphenated tags from Accept-Language, then normalize
  const acceptLocales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
  const negotiator = new Negotiator({ headers: negotiatorHeaders });
  const detected = negotiator.language(acceptLocales) as string | undefined;
  const want: string = detected ?? (linguiConfig.sourceLocale as string) ?? 'en';
  return hyphenToUnderscore(want);
}

function resolveLangFromPath(pathname: string): string | null {
  const seg1 = pathname.split('/')[1];
  if (!seg1) return null;
  if (linguiConfig.locales.includes(seg1)) return seg1; // underscore match
  const normalized = hyphenToUnderscore(seg1);
  return linguiConfig.locales.includes(normalized) ? normalized : null;
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

  // Fix CloudFront + ALB port issue: ensure redirect URLs don't include :443
  // CloudFront sends CloudFront-Forwarded-Proto: https, but ALB sets X-Forwarded-Port: 80
  // This causes Next.js to generate redirect URLs with :443 port
  const cfProto = request.headers.get('cloudfront-forwarded-proto');
  if (cfProto === 'https') {
    // Must update both protocol and port on nextUrl for redirects to work correctly
    request.nextUrl.protocol = 'https:';
    request.nextUrl.port = ''; // Empty string removes port from URL
  }
  const origin = request.nextUrl.origin;
  const buildRedirectUrl = (path: string) => new URL(path, origin);

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
  // Canonicalize hyphenated locale segment to underscore without duplicating locale
  const firstSeg = pathname.split('/')[1];
  if (firstSeg && firstSeg.includes('-')) {
    const normalized = hyphenToUnderscore(firstSeg);
    if (linguiConfig.locales.includes(normalized)) {
      const parts = pathname.split('/');
      parts[1] = normalized;
      const redirectUrl = buildRedirectUrl(parts.join('/'));
      const res = NextResponse.redirect(redirectUrl);
      setLangCookieIfNeeded(res, request, normalized);
      return res;
    }
  }
  if (!langInPath) {
    // Prefer cookie 'lang' if present; fallback to Accept-Language
    const cookieLang = request.cookies.get('lang')?.value;
    const locale =
      cookieLang && linguiConfig.locales.includes(cookieLang) ? cookieLang : getLocale(request);
    const redirectUrl = buildRedirectUrl(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
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
      const res = NextResponse.redirect(buildRedirectUrl(`/${langInPath}/`));
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
