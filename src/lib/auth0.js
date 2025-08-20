// lib/auth0.js
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import axios from 'axios';
import { redirect } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseUrl: process.env.APP_BASE_URL,
  // secret: process.env.AUTH0_SECRET,

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
  async onCallback(error, context, session) {
    // redirect the user to a custom error page
    if (error) {
      console.log('2222222222');
      return NextResponse.redirect(
        new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL),
      );
    }

    console.log('1111111111');
    console.log(session);

    if (session) {
      const result = await axios.get('https://randomuser.me/api/');
      console.log('2222222222');
      console.log(result.data);
      console.log(result.data.results);
      console.log(result.data.results.length);
      if (result.data.results.length === 1) console.log('999');
      console.log('3333333333');
    }

    // complete the redirect to the provided returnTo URL
    return NextResponse.redirect(new URL(context.returnTo || '/', process.env.APP_BASE_URL));
  },
});
// conclusion: The Auth0 client is now initialized and can be used in your application for authentication purposes.
