import { getAccessToken } from '@auth0/nextjs-auth0';

/**
 * start an authenticated fetch request
 * @param url The request URL (backend API)
 * @param init The fetch configuration object (method, body, headers, etc.)
 * @returns The Response object returned by fetch
 */
export async function fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
  // Get the access token
  const accessToken = await getAccessToken();

  // Assemble headers
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'application/json');

  // Send the request
  return fetch(url, {
    ...init,
    headers,
  });
}
