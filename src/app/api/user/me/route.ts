import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { handleAxiosError, handleApiError } from '@/lib/error-handlers';
import {
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '@/lib/api-client';

/**
 * Get current user profile
 */
export async function GET(_request: NextRequest) {
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
    return handleApiError(error, 'getting ME profile');
  }
}

/**
 * Create a new user profile
 */
export async function POST(request: NextRequest) {
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

    // Get the form data from the request
    const formData = await request.formData();

    try {
      const apiUrl = getBackendUrl()!;
      const response = await createUserProfile(tokenResult.token, apiUrl, formData);
      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError)) {
        return handleAxiosError(axiosError, 'create user');
      }
      throw axiosError;
    }
  } catch (error) {
    return handleApiError(error, 'creating user');
  }
}

/**
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
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

    // Get the JSON data from the request
    const userData = await request.json();

    try {
      const apiUrl = getBackendUrl()!;
      const response = await updateUserProfile(tokenResult.token, apiUrl, userData);
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

/**
 * Delete current user profile
 */
export async function DELETE(_request: NextRequest) {
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

    try {
      const apiUrl = getBackendUrl()!;
      const response = await deleteUserProfile(tokenResult.token, apiUrl);
      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError)) {
        return handleAxiosError(axiosError, 'delete user');
      }
      throw axiosError;
    }
  } catch (error) {
    return handleApiError(error, 'deleting user');
  }
}
