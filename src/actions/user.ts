'use server';

import {
  createUserProfile,
  fetchUserProfile,
  updateUserProfile,
  updateCurrentUserProfile,
} from '@/lib/api-client';
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
      Gender?: string | User['gender'];
      Nationality?: string | User['nationality'];
      City?: string | User['city'];
      University?: string | User['university'];
      Major?: string | User['major'];
      PreferredLanguage?: string | User['preferredLanguage'];
      Avatar?: string;
    };

    // Type-safe mapping: accept both lowercase and Title Case form keys
    const backendUserData: BackendEditUserForm = {};
    // Prefer using `username` for backend `Username`; fall back to `userId` or `Username`
    const username =
      (userData as Record<string, unknown>)['username'] ??
      (userData as Record<string, unknown>)['userId'] ??
      (userData as Record<string, unknown>)['Username'];
    if (username !== undefined && String(username) !== '') {
      backendUserData.Username = String(username);
    }

    const email =
      (userData as Record<string, unknown>)['email'] ??
      (userData as Record<string, unknown>)['Email'];
    if (email !== undefined) backendUserData.Email = String(email);

    const gender =
      (userData as Record<string, unknown>)['gender'] ??
      (userData as Record<string, unknown>)['Gender'];
    if (gender !== undefined) backendUserData.Gender = gender as string;

    const nationality =
      (userData as Record<string, unknown>)['nationality'] ??
      (userData as Record<string, unknown>)['Nationality'];
    if (nationality !== undefined) backendUserData.Nationality = String(nationality);

    const city =
      (userData as Record<string, unknown>)['city'] ??
      (userData as Record<string, unknown>)['City'];
    if (city !== undefined) backendUserData.City = String(city);

    const university =
      (userData as Record<string, unknown>)['university'] ??
      (userData as Record<string, unknown>)['University'];
    if (university !== undefined) backendUserData.University = String(university);

    const major =
      (userData as Record<string, unknown>)['major'] ??
      (userData as Record<string, unknown>)['Major'];
    if (major !== undefined) backendUserData.Major = String(major);

    const preferredLanguage =
      (userData as Record<string, unknown>)['preferredLanguage'] ??
      (userData as Record<string, unknown>)['PreferredLanguage'];
    if (preferredLanguage !== undefined)
      backendUserData.PreferredLanguage = String(preferredLanguage);

    const avatar =
      (userData as Record<string, unknown>)['avatar'] ??
      (userData as Record<string, unknown>)['Avatar'];
    if (avatar !== undefined) backendUserData.Avatar = String(avatar);

    // Build FormData for /api/user/me endpoint (multipart/form-data)
    const form = new FormData();
    if (backendUserData.Username !== undefined) form.append('Username', backendUserData.Username);
    if (backendUserData.Email !== undefined) form.append('Email', backendUserData.Email);
    if (backendUserData.Gender !== undefined) form.append('Gender', String(backendUserData.Gender));
    if (backendUserData.Nationality !== undefined)
      form.append('Nationality', String(backendUserData.Nationality));
    if (backendUserData.City !== undefined) form.append('City', String(backendUserData.City));
    if (backendUserData.University !== undefined)
      form.append('University', String(backendUserData.University));
    if (backendUserData.Major !== undefined) form.append('Major', String(backendUserData.Major));
    if (backendUserData.PreferredLanguage !== undefined)
      form.append('PreferredLanguage', String(backendUserData.PreferredLanguage));
    if (backendUserData.Avatar !== undefined) form.append('Avatar', String(backendUserData.Avatar));

    // Call the API to update current user profile without GUID
    const response: AxiosResponse<User> = await updateCurrentUserProfile(
      tokenResult.token,
      apiUrl,
      form,
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
