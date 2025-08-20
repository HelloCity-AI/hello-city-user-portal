// lib/auth0.js
import { Auth0Client } from '@auth0/nextjs-auth0/server'; // ← 若你用 edge 中间件，请改成 /edge
// import { redirect } from 'next/navigation'; // ❌ 删掉
import { NextResponse } from 'next/server';
import axios from 'axios';

const base = process.env.APP_BASE_URL;

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
  async onCallback(error, context, session) {
    if (error) {
      return NextResponse.redirect(
        new URL(`/error?error=${encodeURIComponent(error.message)}`, base),
      );
    }

    if (session) {
      // 这里在 Edge 运行时不建议用 axios；如是 Edge，请改用 fetch
      const result = await axios.get('https://randomuser.me/api/');
      if (result.data?.results?.length === 1) {
        // ✅ 用 NextResponse.redirect，并且 return
        return NextResponse.redirect(new URL('/auth', base));
      }
    }

    // 完成默认回跳
    return NextResponse.redirect(new URL(context.returnTo || '/', base));
  },
});
