import type { User } from '@/types/User.types';

export const createUser = async (newUser: User) => {
  // Create FormData object to match backend's multipart/form-data requirements
  const formData = new FormData();

  // Add required fields
  formData.append('Username', newUser.userId || 'defaultUsername'); // Use userId as username, or can add separate username field
  formData.append('Email', newUser.Email);

  // Add optional fields
  if (newUser.Gender) {
    formData.append('Gender', newUser.Gender.toString());
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

  // If there's an avatar file, it can also be added
  // if (newUser.Avatar && newUser.Avatar instanceof File) {
  //   formData.append('File', newUser.Avatar);
  // }

  // Use unified /api/user/me endpoint for all user operations
  const response = await fetch('/api/user/me', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return {
    data: await response.json(),
    status: response.status,
  };
};

// Used in demo, currently unused, waiting for new ticket
export const fetchUser = async (newUserId: string) => {
  // Use unified /api/user/me endpoint for all user operations
  const response = await fetch('/api/user/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return {
    data: await response.json(),
    status: response.status,
  };
};
