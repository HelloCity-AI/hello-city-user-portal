import { createUser, fetchUser } from '@/api/userApi';
import { defaultUser } from '@/types/User.types';

// Mock fetch for Node.js environment
global.fetch = jest.fn();

const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('createUser API', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:5000';
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends POST request to correct URL with user data', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ userId: '12345' }),
    } as Response;

    mockedFetch.mockResolvedValue(mockResponse);

    const newUser = {
      ...defaultUser,
      userId: 'paul123',
      Email: 'paul@example.com',
    };

    const result = await createUser(newUser);

    expect(mockedFetch).toHaveBeenCalledWith(
      '/api/user/me',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
    expect(result.status).toBe(200);
  });
  it('handles API errors correctly', async () => {
    const errorResponse = {
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad Request' }),
    } as Response;

    mockedFetch.mockResolvedValue(errorResponse);

    const testUser = {
      ...defaultUser,
      userId: 'testUser123',
      Email: 'test@example.com',
    };

    await expect(createUser(testUser)).rejects.toThrow('HTTP error! status: 400');
  });
});

describe('fetchUser API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends GET request to correct URL', async () => {
    const mockUserData = { userId: '123', Email: 'test@example.com' };
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockUserData,
    } as Response;

    mockedFetch.mockResolvedValue(mockResponse);

    const result = await fetchUser('123');

    expect(mockedFetch).toHaveBeenCalledWith(
      '/api/user/me',
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(result.status).toBe(200);
  });
});
