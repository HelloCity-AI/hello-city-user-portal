'use server';

import { createUserProfile, fetchUserProfile, updateUserProfile } from '@/lib/api-client';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import type { AxiosResponse } from 'axios';
import type { User } from '@/types/User.types';

export interface UserActionResult<T = User> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export type CreateUserResult = UserActionResult<User>;
export type FetchUserResult = UserActionResult<User>;
export type UpdateUserResult = UserActionResult<User>;

/**
 * Server Action for creating a user profile
 * Replaces the POST /api/user/me route handler
 */
export async function createUserAction(formData: FormData): Promise<CreateUserResult> {
  try {
    // Validate backend URL first
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return {
        success: false,
        error: 'Backend URL validation failed',
        status: 500,
      };
    }

    // Get access token with validation
    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    // Get backend URL (already validated above)
    const apiUrl = getBackendUrl()!;

    // Call the API to create user profile
    const response: AxiosResponse<User> = await createUserProfile(
      tokenResult.token,
      apiUrl,
      formData,
    );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error('Error in createUserAction:', error);

    // Use the centralized error handler from lib
    const errorResponse = handleApiError(error, 'create user profile');
    const errorData = await errorResponse.json();

    return {
      success: false,
      error: errorData.error || 'Failed to create user profile',
      status: errorResponse.status,
    };
  }
}

/**
 * Server Action for fetching a user profile
 * Can be used to replace the GET /api/user/me route handler
 */
export async function fetchUserAction(): Promise<FetchUserResult> {
  try {
    // Validate backend URL first
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return {
        success: false,
        error: 'Backend URL validation failed',
        status: 500,
      };
    }

    // Get access token with validation
    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    // Get backend URL (already validated above)
    const apiUrl = getBackendUrl()!;

    // Call the API to fetch user profile
    const response: AxiosResponse<User> = await fetchUserProfile(tokenResult.token, apiUrl);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error('Error in fetchUserAction:', error);

    // Use the centralized error handler from lib
    const errorResponse = handleApiError(error, 'fetch user profile');
    const errorData = await errorResponse.json();

    return {
      success: false,
      error: errorData.error || 'Failed to fetch user profile',
      status: errorResponse.status,
    };
  }
}

/**
 * Server Action for updating a user profile
 * Used for form-based user profile updates
 */
export async function updateUserAction(formData: FormData): Promise<UpdateUserResult> {
  try {
    // Validate backend URL first
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return {
        success: false,
        error: 'Backend URL validation failed',
        status: 500,
      };
    }

    // Get access token with validation
    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return {
        success: false,
        error: 'Authentication failed',
        status: 401,
      };
    }

    // Get backend URL (already validated above)
    const apiUrl = getBackendUrl()!;

    // Convert FormData to a typed Partial<User>
    const userData: Partial<User> = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        (userData as Record<string, string>)[key] = value;
      }
    });

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
      Avatar?: string;
    };

    // Type-safe mapping: frontend fields -> backend Title Case fields
    const backendUserData: BackendEditUserForm = {};
    // Prefer using frontend `username` for backend `Username`; fall back to `userId`
    if (userData.username !== undefined && userData.username !== '') {
      backendUserData.Username = userData.username;
    } else if (userData.userId !== undefined) {
      backendUserData.Username = userData.userId;
    }
    if (userData.Email !== undefined) backendUserData.Email = userData.Email;
    if (userData.Gender !== undefined) backendUserData.Gender = userData.Gender;
    if (userData.nationality !== undefined) backendUserData.Nationality = userData.nationality;
    if (userData.city !== undefined) backendUserData.City = userData.city;
    if (userData.university !== undefined) backendUserData.University = userData.university;
    if (userData.major !== undefined) backendUserData.Major = userData.major;
    if (userData.preferredLanguage !== undefined)
      backendUserData.PreferredLanguage = userData.preferredLanguage;
    if (userData.Avatar !== undefined) backendUserData.Avatar = userData.Avatar;

    // Call the API to update user profile
    const response: AxiosResponse<User> = await updateUserProfile(
      tokenResult.token,
      apiUrl,
      backendUserData,
    );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error('Error in updateUserAction:', error);

    // Use the centralized error handler from lib
    const errorResponse = handleApiError(error, 'update user profile');
    const errorData = await errorResponse.json();

    return {
      success: false,
      error: errorData.error || 'Failed to update user profile',
      status: errorResponse.status,
    };
  }
}
