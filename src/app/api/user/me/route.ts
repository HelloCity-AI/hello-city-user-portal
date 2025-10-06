import { type NextRequest, NextResponse } from 'next/server';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import { fetchUserProfile, updateUserProfile, updateCurrentUserProfile } from '@/lib/api-client';
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

    const userData: Partial<User> = await request.json();

    const backendUserData: BackendEditUserForm = {};
    // 优先使用前端提供的 username，其次回退到 userId
    if (userData.username !== undefined && userData.username !== '') {
      backendUserData.Username = userData.username;
    } else if (userData.userId !== undefined) {
      backendUserData.Username = userData.userId;
    }
    if (userData.email !== undefined) backendUserData.Email = userData.email;
    if (userData.gender !== undefined) backendUserData.Gender = userData.gender;
    if (userData.nationality !== undefined) backendUserData.Nationality = userData.nationality;
    if (userData.city !== undefined) backendUserData.City = userData.city;
    if (userData.university !== undefined) backendUserData.University = userData.university;
    if (userData.major !== undefined) backendUserData.Major = userData.major;
    if (userData.preferredLanguage !== undefined)
      backendUserData.PreferredLanguage = userData.preferredLanguage;
    if (userData.avatar !== undefined) backendUserData.Avatar = userData.avatar;

    // Convert to FormData for backend that expects multipart/form-data
    const formData = new FormData();
    Object.entries(backendUserData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      const apiUrl = getBackendUrl()!;

      // Always resolve backend GUID (UserId) for path id
      let guid: string | undefined = undefined;
      try {
        const currentUserResponse = await fetchUserProfile(tokenResult.token, apiUrl);
        // Backend returns GUID as `UserId`; do not use username
        guid = (currentUserResponse.data as { UserId?: string })?.UserId;
      } catch (fetchError) {
        console.error('Failed to fetch current user for GUID:', fetchError);
      }

      let response;
      if (guid) {
        response = await updateUserProfile(tokenResult.token, apiUrl, formData, guid);
      } else {
        // Fallback to backend /api/user/me to avoid 500 when GUID not resolved
        response = await updateCurrentUserProfile(tokenResult.token, apiUrl, formData);
      }
      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError)) {
        return handleAxiosError(axiosError, 'update user');
      }
      throw axiosError;
    }
  } catch (error) {
    return handleApiError(error, 'updating user');
  }
}
