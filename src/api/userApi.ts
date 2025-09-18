import type { User } from '@/types/User.types';
import axios from 'axios';

export const createUser = async (newUser: User) => {
  // Get access token
  const tokenResponse = await fetch('/api/auth/token');
  let accessToken = '';

  if (tokenResponse.ok) {
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.accessToken || '';
  }

  // Create FormData object to match backend's multipart/form-data requirements
  const formData = new FormData();

  // Add required fields
  formData.append('Username', newUser.userId || 'defaultUsername'); // Use userId as username, or can add separate username field
  formData.append('Email', newUser.email);

  // Add optional fields
  formData.append('Gender', newUser.gender?.toString() ?? '');
  formData.append('Nationality', newUser.nationality ?? '');
  formData.append('City', newUser.city ?? '');
  formData.append('PreferredLanguage', newUser.preferredLanguage?.toString() ?? '');

  // If there's an avatar file, it can also be added
  // if (newUser.Avatar && newUser.Avatar instanceof File) {
  //   formData.append('File', newUser.Avatar);
  // }

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
    Accept: '*/*',
  };

  // If there's an access token, add it to request headers
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, formData, {
    headers,
  });
  return response;
};

export const updateUser = async (updatedUser: User) => {
  // Get access token
  const tokenResponse = await fetch('/api/auth/token');
  let accessToken = '';

  if (tokenResponse.ok) {
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.accessToken || '';
  }

  // Create FormData object to match backend's multipart/form-data requirements
  const formData = new FormData();

  formData.append('Username', updatedUser.email || 'defaultUsername');
  formData.append('Email', updatedUser.email);

  formData.append('Gender', updatedUser.gender?.toString() ?? '');
  formData.append('Nationality', updatedUser.nationality ?? '');
  formData.append('City', updatedUser.city ?? '');
  formData.append('University', updatedUser.university ?? '');
  formData.append('Major', updatedUser.major ?? '');
  formData.append('PreferredLanguage', updatedUser.preferredLanguage?.toString() ?? '');

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
    Accept: '*/*',
  };

  // If there's an access token, add it to request headers
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Use PUT with user ID in the URL path to match the controller endpoint
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${updatedUser.userId}`,
    formData,
    {
      headers,
    },
  );
  return response;
};

// Used in demo, currently unused, waiting for new ticket
export const fetchUser = async (newUserId: string) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${newUserId}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
  return response;
};
