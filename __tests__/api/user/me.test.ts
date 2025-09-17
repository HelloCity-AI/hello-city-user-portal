import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import type { UserProfileResponse } from '@/app/api/types/response.types';
import type { User } from '@/types/User.types';

// Debug mode test:  let x=1;const    y =   2;

jest.mock('axios');
jest.mock('@/lib/auth0', () => ({
  auth0: {
    getAccessToken: jest.fn(),
  },
}));
jest.mock('@auth0/nextjs-auth0/errors', () => ({
  AccessTokenError: class MockAccessTokenError extends Error {
    code: string;
    constructor(code: string, message: string) {
      super(message);
      this.name = 'AccessTokenError';
      this.code = code;
    }
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAuth0 = auth0 as jest.Mocked<typeof auth0>;

let mockedIsAxiosError: jest.MockedFunction<typeof axios.isAxiosError>;

beforeAll(() => {
  // Set up axios.isAxiosError mock
  Object.defineProperty(mockedAxios, 'isAxiosError', {
    value: jest.fn<boolean, [unknown]>(),
    writable: true,
  });
  mockedIsAxiosError = mockedAxios.isAxiosError as jest.MockedFunction<typeof axios.isAxiosError>;
});

afterAll(() => {
  // Restore axios.isAxiosError to prevent test pollution
  // Restore to basic function to prevent test pollution
  Object.defineProperty(mockedAxios, 'isAxiosError', {
    value: () => false,
    writable: true,
  });
});

const createMockAxiosResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {
    url: '',
    method: 'get',
    headers: {},
  },
});

const createMockNextResponse = (
  data: unknown,
  status: number,
  headers?: Record<string, string>,
) => ({
  json: data,
  status,
  headers,
});

type AccessTokenLike = { token: string | null; expiresAt: number; scope: string };
const createMockTokenResponse = (token: string | null): AccessTokenLike => ({
  token,
  expiresAt: Date.now() + 3600000,
  scope: 'read:profile',
});

// Helper to cast AccessTokenLike to auth0's expected type when needed
const createMockAuth0TokenResponse = (token: string | null) =>
  createMockTokenResponse(token) as unknown as Awaited<ReturnType<typeof auth0.getAccessToken>>;

const setupEnvironment = (backendUrl?: string) => {
  const originalEnv = { ...process.env };
  if (backendUrl !== undefined) {
    process.env.NEXT_PUBLIC_BACKEND_URL = backendUrl;
  } else {
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  return () => {
    process.env = originalEnv;
  };
};

describe('FetchUserProfile', () => {
  let fetchUserProfile: (token: string, backendUrl: string) => Promise<UserProfileResponse>;

  const TEST_TOKEN = 'test-token';
  const TEST_BACKEND_URL = 'http://localhost:5001';

  beforeAll(async () => {
    const { fetchUserProfile: fn } = await import('@/app/api/user/me/route');
    fetchUserProfile = fn;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should make correct API call with token and return user data', async () => {
    const mockUserData: Partial<User> = {
      userId: '1',
      Email: 'test@example.com',
      Avatar: 'avatar.jpg',
    };

    mockedAxios.get.mockResolvedValue(createMockAxiosResponse(mockUserData, 200));

    const result = await fetchUserProfile(TEST_TOKEN, TEST_BACKEND_URL);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5001/api/user/me', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer test-token',
        'Cache-Control': 'no-store',
      },
      timeout: 10000,
      validateStatus: expect.any(Function),
    });
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockUserData);
  });

  it('Should handle 404 response', async () => {
    mockedAxios.get.mockResolvedValue(createMockAxiosResponse(null, 404));

    const result = await fetchUserProfile(TEST_TOKEN, TEST_BACKEND_URL);

    expect(result.status).toBe(404);
    expect(result.data).toBe(null);
  });

  it('Should reject for 403 status codes', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 403, data: { error: 'Forbidden' } },
    };

    mockedAxios.get.mockRejectedValue(axiosError);

    await expect(fetchUserProfile(TEST_TOKEN, TEST_BACKEND_URL)).rejects.toBe(axiosError);
  });

  it('Should reject for 500 status codes', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 500, data: { error: 'Internal Server Error' } },
    };

    mockedAxios.get.mockRejectedValue(axiosError);

    await expect(fetchUserProfile(TEST_TOKEN, TEST_BACKEND_URL)).rejects.toBe(axiosError);
  });

  it('Should configure validateStatus correctly', async () => {
    mockedAxios.get.mockResolvedValue(createMockAxiosResponse({}, 200));

    await fetchUserProfile(TEST_TOKEN, TEST_BACKEND_URL);

    const axiosCall = mockedAxios.get.mock.calls[0];
    const config = axiosCall[1];
    const validateStatusFn = config?.validateStatus;

    expect(validateStatusFn).toBeDefined();
    expect(validateStatusFn!(200)).toBe(true);
    expect(validateStatusFn!(404)).toBe(true);
    expect(validateStatusFn!(403)).toBe(false);
    expect(validateStatusFn!(500)).toBe(false);
  });
});

describe('GET Handler', () => {
  let GET: (request: NextRequest) => Promise<Response>;
  let restoreEnv: () => void;
  let nextResponseJsonSpy: jest.SpyInstance;

  beforeAll(async () => {
    const { GET: handler } = await import('@/app/api/user/me/route');
    GET = handler;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    restoreEnv = setupEnvironment('http://localhost:5001');

    // Set up NextResponse.json spy
    nextResponseJsonSpy = jest
      .spyOn(NextResponse, 'json')
      .mockImplementation((data: unknown, init?: ResponseInit) => {
        const options = init as { status?: number; headers?: Record<string, string> } | undefined;
        return createMockNextResponse(data, options?.status || 200, options?.headers) as never;
      });
  });

  afterEach(() => {
    restoreEnv();
  });

  describe('Success scenarios', () => {
    it('Should return user data when everything is valid', async () => {
      const mockUserData = { userId: '1', Email: 'test@example.com' };
      const mockRequest = {} as NextRequest;

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockResolvedValue(createMockAxiosResponse(mockUserData, 200));

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(mockUserData, { status: 200 });
    });

    it('Should passthrough 404 when backend returns not found', async () => {
      const mockRequest = {} as NextRequest;
      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockResolvedValue(createMockAxiosResponse(null, 404));

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(null, { status: 404 });
    });
  });

  describe('Authentication errors', () => {
    it('Should handle AccessTokenError from auth0', async () => {
      const mockRequest = {} as NextRequest;
      const accessTokenError = new AccessTokenError('invalid_session', 'Session expired');

      mockedAuth0.getAccessToken.mockRejectedValue(accessTokenError);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Unauthorized',
          code: 'invalid_session',
          details: 'Session expired',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Missing Session"',
          },
        },
      );
    });

    it('Should pass null token to backend and handle 401 response', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = {
        isAxiosError: true,
        response: { status: 401, data: { error: 'Unauthorized' } },
        message: 'Request failed with status code 401',
      };

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse(null));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5001/api/user/me', {
        headers: {
          Authorization: 'Bearer null',
          'Cache-Control': 'no-store',
          Accept: 'application/json',
        },
        timeout: 10000,
        validateStatus: expect.any(Function),
      });

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Unauthorized',
          code: 'BACKEND_UNAUTHORIZED',
          details: 'Request failed with status code 401',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Token expired or invalid"',
          },
        },
      );
    });

    it('Should pass undefined token to backend and handle 401 response', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = {
        isAxiosError: true,
        response: { status: 401, data: { error: 'Unauthorized' } },
        message: 'Request failed with status code 401',
      };

      mockedAuth0.getAccessToken.mockResolvedValue(undefined as never);
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5001/api/user/me', {
        headers: {
          Authorization: 'Bearer undefined',
          'Cache-Control': 'no-store',
          Accept: 'application/json',
        },
        timeout: 10000,
        validateStatus: expect.any(Function),
      });

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Unauthorized',
          code: 'BACKEND_UNAUTHORIZED',
          details: 'Request failed with status code 401',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Token expired or invalid"',
          },
        },
      );
    });

    it('Should pass empty string token to backend and handle 401 response', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = {
        isAxiosError: true,
        response: { status: 401, data: { error: 'Unauthorized' } },
        message: 'Request failed with status code 401',
      };

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse(''));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5001/api/user/me', {
        headers: {
          Authorization: 'Bearer ',
          'Cache-Control': 'no-store',
          Accept: 'application/json',
        },
        timeout: 10000,
        validateStatus: expect.any(Function),
      });

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Unauthorized',
          code: 'BACKEND_UNAUTHORIZED',
          details: 'Request failed with status code 401',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Token expired or invalid"',
          },
        },
      );
    });
  });

  describe('Configuration errors', () => {
    it('Should return 500 when backend URL is not configured', async () => {
      restoreEnv();
      restoreEnv = setupEnvironment();

      const mockRequest = {} as NextRequest;
      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        { error: 'Backend URL is not configured (NEXT_PUBLIC_BACKEND_URL)' },
        { status: 500 },
      );
    });
  });

  describe('Backend errors', () => {
    it('Should return 401 with proper headers when backend returns 401', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = {
        isAxiosError: true,
        response: { status: 401, data: { error: 'Unauthorized' } },
        message: 'Request failed with status code 401',
      };

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('invalid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Unauthorized',
          code: 'BACKEND_UNAUTHORIZED',
          details: 'Request failed with status code 401',
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Token expired or invalid"',
          },
        },
      );
    });

    it('Should handle other axios errors with response', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = {
        isAxiosError: true,
        response: { status: 500, data: { error: 'Internal Server Error' } },
        message: 'Request failed with status code 500',
      };

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Error occurred while getting ME profile',
          details: 'Request failed with status code 500',
        },
        { status: 500 },
      );
    });

    it('Should handle axios errors without response', async () => {
      const mockRequest = {} as NextRequest;
      const axiosError = new Error('Network Error');
      Object.assign(axiosError, { isAxiosError: true });

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Error occurred while getting ME profile',
          details: 'Network Error',
        },
        { status: 500 },
      );
    });
  });

  describe('Generic errors', () => {
    it('Should handle non-axios errors', async () => {
      const mockRequest = {} as NextRequest;
      const genericError = new Error('Unexpected error');

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(genericError);
      mockedIsAxiosError.mockReturnValue(false);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Error occurred while getting ME profile',
          details: 'Unexpected error',
        },
        { status: 500 },
      );
    });

    it('Should handle non-Error objects', async () => {
      const mockRequest = {} as NextRequest;
      const stringError = 'Something went wrong';

      mockedAuth0.getAccessToken.mockResolvedValue(createMockAuth0TokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(stringError);
      mockedIsAxiosError.mockReturnValue(false);

      await GET(mockRequest);

      expect(nextResponseJsonSpy).toHaveBeenCalledWith(
        {
          error: 'Error occurred while getting ME profile',
          details: 'Something went wrong',
        },
        { status: 500 },
      );
    });
  });
});
