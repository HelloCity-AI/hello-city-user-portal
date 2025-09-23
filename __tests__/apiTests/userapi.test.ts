import { createUser, fetchUser } from '@/api/userApi';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
import { defaultUser } from '@/types/User.types';

// Mock fetch for Node.js environment
global.fetch = jest.fn();

describe('createUser API', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';
  });
  it('sends POST request to correct URL with user data', async () => {
    const mockResponse = { data: { data: { userId: '12345' } } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    // Mock fetch for token endpoint
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'mock-token' }),
    } as Response);

    const newUser = {
      ...defaultUser,
      username: 'paul',
      Email: 'paul@example.com', // Use capital E to match User type
      password: 'abc123',
      confirmPassword: 'abc123',
    };

    const response = await createUser(newUser);

    // Check that axios.post was called with correct URL and headers
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/user',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*',
          Authorization: 'Bearer mock-token',
        },
      },
    );

    // Verify FormData contains expected fields
    const callArgs = mockedAxios.post.mock.calls[0];
    const formData = callArgs[1] as FormData;
    expect(formData.get('Email')).toBe('paul@example.com');
    expect(formData.get('Username')).toBe('defaultUsername'); // userId is empty, so defaults to 'defaultUsername'

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
