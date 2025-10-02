import axios, { type AxiosResponse } from 'axios';

/**
 * Create a configured axios instance for backend API calls
 */
export function createApiClient(baseURL: string, token: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

/**
 * Fetch user profile with proper error handling
 */
export async function fetchUserProfile(token: string, backendUrl: string): Promise<AxiosResponse> {
  const userResponse = await axios.get(`${backendUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
      Accept: 'application/json',
    },
    timeout: 10000,
    validateStatus: (status) => status === 200 || status === 404,
  });
  return userResponse;
}

/**
 * Create user profile
 */
export async function createUserProfile(
  token: string,
  backendUrl: string,
  formData: FormData,
): Promise<AxiosResponse> {
  const response = await axios.post(`${backendUrl}/api/user`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
    timeout: 10000,
  });
  return response;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string,
  backendUrl: string,
  userData: any,
): Promise<AxiosResponse> {
  const response = await axios.put(`${backendUrl}/api/user/me`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
  return response;
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(token: string, backendUrl: string): Promise<AxiosResponse> {
  const response = await axios.delete(`${backendUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
  return response;
}

export async function fetchAllConversations(
  token: string,
  backendUrl: string,
): Promise<AxiosResponse> {
  const response = await axios.get(`${backendUrl}/api/conversation/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
  return response;
}
