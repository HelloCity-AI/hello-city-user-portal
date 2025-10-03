import { type NextRequest, NextResponse } from 'next/server';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import { fetchUserProfile, updateUserProfile } from '@/lib/api-client';
import type { User } from '@/types/User.types';
import axios from 'axios';

// Backend form keys aligned with EditUserDto (Title Case)
type BackendEditUserForm = {
  Username?: string;
  Email?: string;
  Gender?: string | User['Gender'];
  Nationality?: string | User['nationality'];
  City?: string | User['city'];
  University?: string | User['university'];
  Major?: string | User['major'];
  PreferredLanguage?: string | User['preferredLanguage'];
  Avatar?: string; // 当前 JSON 更新不包含文件，保留以兼容现有字段
};

/**
 * Get current user profile
 * This endpoint is used by userSaga.ts for fetching user data
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Validate backend URL
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return backendUrlError;
    }

    // Get access token
    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return tokenResult.error;
    }

    const apiUrl = getBackendUrl()!;
    const userResponse = await fetchUserProfile(tokenResult.token, apiUrl);
    return NextResponse.json(userResponse.data, { status: userResponse.status });
  } catch (error) {
    return handleApiError(error, 'getting user profile');
  }
}

/**
 * Update current user profile
 * This endpoint is used for programmatic updates (e.g., Redux Saga)
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate backend URL
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return backendUrlError;
    }

    // Get access token
    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return tokenResult.error;
    }

    const updateData: Partial<User> = await request.json();

    try {
      const apiUrl = getBackendUrl()!;
      const response = await updateUserProfile(tokenResult.token, apiUrl, updateData);
      return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return handleAxiosError(error, 'update user');
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(error, 'updating user');
  }
}
