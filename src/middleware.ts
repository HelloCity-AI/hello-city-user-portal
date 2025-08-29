import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { auth0 } from './lib/auth0';
import linguiConfig from '../lingui.config';

function getLocale(request: NextRequest): string {
  // Get locale from Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = linguiConfig.locales;
  const negotiator = new Negotiator({ headers: negotiatorHeaders });

  const detectedLocale = negotiator.language(locales);
  return (detectedLocale ?? linguiConfig.sourceLocale) as string;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.includes('/create-user-profile') ||
    pathname.includes('/contact-us')
  ) {
    return await auth0.middleware(request);
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = linguiConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url),
    );
  }

  // Auth0 login check
  const authResponse = await auth0.middleware(request);
  if (authResponse) {
    return authResponse;
  }

  // Check profile after successful authentication
  try {
    const session = await auth0.getSession(request);
    if (session?.user) {
      const accessToken = await auth0.getAccessToken(request, NextResponse.next());

      if (accessToken?.token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${accessToken.token}` },
          cache: 'no-store',
        });

        if (res.status === 404) {
          const pathSegments = request.nextUrl.pathname.split('/');
          const lang = linguiConfig.locales.includes(pathSegments[1])
            ? pathSegments[1]
            : getLocale(request);

          return NextResponse.redirect(new URL(`/${lang}/create-user-profile`, request.url));
        }
      }
    }
  } catch (err) {
    console.error('Profile check error: ', err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
