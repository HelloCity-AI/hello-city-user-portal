import { type NextRequest, NextResponse } from 'next/server';
import {
  getAccessTokenWithValidation,
  validateBackendUrl,
  getBackendUrl,
  getAuthContext,
  AuthError,
} from '@/lib/auth-utils';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import { fetchUserProfile, updateCurrentUserProfile, updateUserProfile } from '@/lib/api-client';
import type { User } from '@/types/User.types';
import axios from 'axios';

// Backend form keys aligned with EditUserDto (Title Case)
type BackendEditUserForm = {
  Username?: string;
  Email?: string;
  Gender?: string | User['gender'];
  Nationality?: string | User['nationality'];
  City?: string | User['city'];
  University?: string | User['university'];
  Major?: string | User['major'];
  PreferredLanguage?: string | User['preferredLanguage'];
  Avatar?: string;
};

/**
 * Get current user profile
 * This endpoint is used by userSaga.ts for fetching user data
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await fetchUserProfile(token, apiUrl);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'getting user profile');
  }
}

/**
 * Update current user profile
 * This endpoint is used for programmatic updates (e.g., Redux Saga)
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const userData: Partial<User> = await request.json();
    const response = await updateUserProfile(token, apiUrl, userData);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'updating user');
  }
}
