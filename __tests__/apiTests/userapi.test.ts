import { createUser, fetchUser } from '@/api/userApi';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { defaultUser } from '@/types/User.types';

describe('createUser API', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';
  });
  it('sends POST request to correct URL with user data', async () => {
    const mockResponse = { data: { data: { userId: '12345' } } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const newUser = {
      ...defaultUser,
      username: 'paul',
      email: 'paul@example.com',
      password: 'abc123',
      confirmPassword: 'abc123',
    };

    const response = await createUser(newUser);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/user-profile',
      newUser,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      },
    );

    expect(response).toEqual(mockResponse);
  });
  it('sends GET request to correct URL with user data', async () => {
    const mockResponse = { data: { data: { userId: '12345' } } };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const newUserId = '12345';

    const response = await fetchUser(newUserId);

    expect(mockedAxios.get).toHaveBeenCalledWith(`http://localhost:5000/api/${newUserId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    expect(response).toEqual(mockResponse);
  });
});
