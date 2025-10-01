import { createApiClient } from '@/lib/api-client';
import { getAccessTokenWithValidation, getBackendUrl } from '@/lib/auth-utils';

/**
 * @deprecated Use createApiClient from @/lib/api-client instead
 * This function is kept for backward compatibility but will be removed in future versions
 *
 * start an authenticated fetch request
 * @param url The request URL (backend API)
 * @param init The fetch configuration object (method, body, headers, etc.)
 * @returns The Response object returned by fetch
 */
export async function fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
  // Get access token using the new utility
  const tokenResponse = await getAccessTokenWithValidation();
  if ('error' in tokenResponse) {
    throw new Error('Failed to get access token');
  }

  // Assemble headers
  const headers = new Headers(init.headers || {});
  headers.set('Authorization', `Bearer ${tokenResponse.token}`);

  // Only set default Content-Type for JSON bodies when not FormData and not already set
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Send the request
  return fetch(url, {
    ...init,
    headers,
  });
}

/**
 * Create an authenticated axios client instance
 * @param token Optional access token, if not provided will be fetched automatically
 * @returns Configured axios instance with authentication
 */
export async function createAuthenticatedClient(token?: string) {
  let authToken = token;

  if (!authToken) {
    const tokenResponse = await getAccessTokenWithValidation();
    if ('error' in tokenResponse) {
      throw new Error('Failed to get access token');
    }
    authToken = tokenResponse.token;
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  return createApiClient(authToken, backendUrl);
}
