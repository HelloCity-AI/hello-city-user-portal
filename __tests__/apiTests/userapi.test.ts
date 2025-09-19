import { createUser, fetchCurrentUser } from '@/api/userApi';
import { defaultUser } from '@/types/User.types';

// Mock the fetchWithAuth utility
jest.mock('@/utils/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

// Mock fetch for Node.js environment
global.fetch = jest.fn();

const { fetchWithAuth } = require('@/utils/fetchWithAuth');
const mockedFetchWithAuth = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

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

    mockedFetchWithAuth.mockResolvedValue(mockResponse);

    const newUser = {
      ...defaultUser,
      userId: 'paul123',
      username: 'paul',
      Email: 'paul@example.com',
      password: 'abc123',
      confirmPassword: 'abc123',
    };

    const result = await createUser(newUser);

    expect(mockedFetchWithAuth).toHaveBeenCalledWith(
      'http://localhost:5000/api/user',
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

    mockedFetchWithAuth.mockResolvedValue(errorResponse);

    const testUser = {
      ...defaultUser,
      userId: 'testUser123',
      Email: 'test@example.com',
    };
    const result = await createUser(testUser);
    expect(result.status).toBe(400);
  });
});

describe('fetchCurrentUser API', () => {
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

    mockedFetchWithAuth.mockResolvedValue(mockResponse);

    const result = await fetchCurrentUser();

    expect(mockedFetchWithAuth).toHaveBeenCalledWith(
      'http://localhost:5000/api/user/me',
      expect.objectContaining({
        method: 'GET',
      }),
    );
    expect(result.status).toBe(200);
  });
});
