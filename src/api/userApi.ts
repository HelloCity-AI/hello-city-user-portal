import type { User } from '@/types/User.types';
import axios from 'axios';

export const createUser = async (newUser: User) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`,
    newUser,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
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
