import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') ?? 'en';

  const ok = new URL(`/${lang}`, req.url);
  const fail = new URL(`/${lang}/create-user-profile`, req.url);

  try {
    const me = await fetch(new URL('/api/user/me', req.url), {
      cache: 'no-store',
      headers: { cookie: req.headers.get('cookie') ?? '' }, // 传递会话
    });

    if (!me.ok) return NextResponse.redirect(fail);

    let data: unknown = null;
    try {
      data = await me.json();
    } catch {}

    const hasUser =
      data != null &&
      (typeof data !== 'object' || Object.keys(data as Record<string, unknown>).length > 0);

    return NextResponse.redirect(hasUser ? ok : fail);
  } catch {
    return NextResponse.redirect(fail);
  }
}
