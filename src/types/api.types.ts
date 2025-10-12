/**
 * Standard API response wrapper
 * Used by all saga API calls via fetchWithErrorHandling
 *
 * @module api.types
 */

export interface ApiResponse<T> {
  /** HTTP status code */
  status: number;

  /** Response data (null if error) */
  data: T | null;

  /** Whether the request succeeded */
  ok: boolean;
}
