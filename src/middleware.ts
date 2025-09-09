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
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url),
    );
  }

  // check profile
  // try {
  //   const session = await auth0.getSession(request);

  //   if (session?.user) {
  //     if (pathname.includes('create-user-profile')) {
  //       return NextResponse.next();
  //     }

  //     const accessToken = await auth0.getAccessToken(request, NextResponse.next());
  //     if (!accessToken?.token) {
  //       return NextResponse.next();
  //     }

  //     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
  //       headers: { Authorization: `Bearer ${accessToken.token}` },
  //       cache: 'no-store',
  //     });

  //     if (res.status === 200) {
  //       return NextResponse.next();
  //     }

  //     if (res.status === 404) {
  //       const lang = resolveLang(request, pathname);

  //       return NextResponse.redirect(new URL(`/${lang}/create-user-profile`, request.url));
  //     }
  //   }
  // } catch (err) {
  //   console.error('[middleware] Profile check error: ', err);
  // }

  // auth for protected page
  const lang = resolveLang(request, pathname);
  const protectedPrefixes = [`/${lang}/chat`, `/${lang}/create-user-profile`];
  const pathnameIsProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (pathnameIsProtected) {
    const session = await auth0.getSession(request);
    if (!session?.user) {
      return NextResponse.redirect(new URL(`/${lang}/`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|sitemap.xml|robots.txt|images|fonts).*)',
  ],
};
