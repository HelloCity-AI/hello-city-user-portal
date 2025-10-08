/**
 * Generic fetch wrapper with error handling
 * Returns a consistent response format for all API calls
 *
 * @param url - The URL to fetch
 * @param options - Optional fetch configuration
 * @returns Promise with { status, data, ok } structure
 *
 * @example
 * const response = await fetchWithErrorHandling<User[]>('/api/users', {
 *   method: 'GET',
 *   headers: { 'Content-Type': 'application/json' },
 * });
 *
 * if (response.ok) {
 *   console.log(response.data); // User[]
 * } else {
 *   console.error(response.status); // 404, 500, etc.
 * }
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit,
): Promise<{ status: number; data: T | null; ok: boolean }> {
  try {
    const response = await fetch(url, options);
    let data: T | null = null;
    try {
      data = await response.json();
    } catch {}

    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return {
      status: 500,
      data: null,
      ok: false,
    };
  }
}
