import type { User } from '@/types/User.types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

/**
 * Unified User API Service
 * All user-related API calls with consistent authentication and error handling
 */

/**
 * Fetch current user profile
 * @returns Promise<Response> - Response from the API
 */
export const fetchCurrentUser = async (): Promise<Response> => {
  const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`, {
    method: 'GET',
  });
  return response;
};

/**
 * Create a new user profile
 * @param newUser - User data to create
 * @returns Promise<Response> - Response from the API
 */
export const createUser = async (newUser: User): Promise<Response> => {
  // Validate userId to avoid potential conflicts with default username
  if (!newUser.userId || newUser.userId.trim() === '') {
    throw new Error('User ID is required and cannot be empty');
  }

  if (newUser.userId === 'defaultUsername') {
    throw new Error('User ID cannot be "defaultUsername" as it conflicts with system defaults');
  }

  // Create FormData object to match backend's multipart/form-data requirements
  const formData = new FormData();

  // Add required fields
  formData.append('Username', newUser.userId);
  formData.append('Email', newUser.Email);

  // Add optional fields
  formData.append('Gender', newUser.gender?.toString() ?? '');
  formData.append('Nationality', newUser.nationality ?? '');
  formData.append('City', newUser.city ?? '');
  formData.append('PreferredLanguage', newUser.preferredLanguage?.toString() ?? '');

  // If there's an avatar file, it can also be added
  // if (newUser.Avatar && newUser.Avatar instanceof File) {
  //   formData.append('File', newUser.Avatar);
  // }

  const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData, let the browser set it with boundary
      Accept: '*/*',
    },
  });
  return response;
};

/**
 * Update user profile
 * @param userId - User ID to update
 * @param userData - Updated user data
 * @returns Promise<Response> - Response from the API
 */
export const updateUser = async (userId: string, userData: Partial<User>): Promise<Response> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
    {
      method: 'PUT',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response;
};

/**
 * Fetch user by ID (for demo purposes)
 * @param userId - User ID to fetch
 * @returns Promise<Response> - Response from the API
 */
export const fetchUserById = async (userId: string): Promise<Response> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
    {
      method: 'GET',
    },
  );
  return response;
};

/**
 * Delete user profile
 * @param userId - User ID to delete
 * @returns Promise<Response> - Response from the API
 */
export const deleteUser = async (userId: string): Promise<Response> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}`,
    {
      method: 'DELETE',
    },
  );
  return response;
};
