// lib/auth0.js
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Debug: Log Auth0 configuration
console.log('[Auth0 Config]', {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID?.substring(0, 10) + '...',
  audience: process.env.AUTH0_AUDIENCE,
  appBaseUrl: process.env.APP_BASE_URL,
  hasClientSecret: !!process.env.AUTH0_CLIENT_SECRET,
  hasSecret: !!process.env.AUTH0_SECRET,
});

// Initialize the Auth0 client
export const auth0 = new Auth0Client({
  // Options are loaded from environment variables by default
  // Ensure necessary environment variables are properly set
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // appBaseUrl: process.env.APP_BASE_URL,
  // secret: process.env.AUTH0_SECRET,
  signInReturnToPath: '/assistant',

  authorizationParameters: {
    // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK.
    // Instead, we need to provide the values explicitly.
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
});
// conclusion: The Auth0 client is now initialized and can be used in your application for authentication purposes.
