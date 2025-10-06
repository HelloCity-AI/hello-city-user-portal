import type { User } from '@/types/User.types';
import {
  createUserProfile,
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createApiClient,
} from '@/lib/api-client';
import { getAccessTokenWithValidation, getBackendUrl } from '@/lib/auth-utils';

/**
 * @deprecated Use createUserProfile from @/lib/api-client instead
 * This function is kept for backward compatibility but will be removed in future versions
 */
export const createUser = async (newUser: User) => {
  // Get access token and backend URL
  const tokenResponse = await getAccessTokenWithValidation();
  if ('error' in tokenResponse) {
    throw new Error('Failed to get access token');
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // Create FormData object to match backend's multipart/form-data requirements
  const formData = new FormData();

  // Add required fields: prefer username then fallback to userId
  formData.append('Username', newUser.username || newUser.userId || 'defaultUsername');
  formData.append('Email', newUser.email);

  // Add optional fields
  if (newUser.gender) {
    formData.append('Gender', newUser.gender.toString());
  }
  if (newUser.nationality) {
    formData.append('Nationality', newUser.nationality);
  }
  if (newUser.city) {
    formData.append('City', newUser.city);
  }
  if (newUser.preferredLanguage) {
    formData.append('PreferredLanguage', newUser.preferredLanguage.toString());
  }

  // Use the new api-client function
  const response = await createUserProfile(tokenResponse.token, backendUrl, formData);

  return {
    data: response.data,
    status: response.status,
  };
};

/**
 * @deprecated Use fetchUserProfile from @/lib/api-client instead
 * This function is kept for backward compatibility but will be removed in future versions
 * Used in demo, currently unused, waiting for new ticket
 */
export const fetchUser = async (newUserId: string) => {
  // Get access token and backend URL
  const tokenResponse = await getAccessTokenWithValidation();
  if ('error' in tokenResponse) {
    throw new Error('Failed to get access token');
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }

  // Use the new api-client function
  const response = await fetchUserProfile(tokenResponse.token, backendUrl);

  return {
    data: response.data,
    status: response.status,
  };
};

// Re-export the new API functions for easier migration
export {
  createUserProfile,
  fetchUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createApiClient,
} from '@/lib/api-client';
