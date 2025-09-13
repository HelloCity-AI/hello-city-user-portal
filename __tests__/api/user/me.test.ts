import axios from 'axios';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

jest.mock('axios');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));
jest.mock('@/lib/auth0', () => ({
  auth0: {
    getAccessToken: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;
const mockedAuth0 = auth0 as jest.Mocked<typeof auth0>;

// Override axios.isAxiosError with proper typing
Object.defineProperty(mockedAxios, 'isAxiosError', {
  value: jest.fn<boolean, [unknown]>(),
  writable: true,
});
const mockedIsAxiosError = mockedAxios.isAxiosError as jest.MockedFunction<
  typeof axios.isAxiosError
>;

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

const createMockTokenResponse = (token: string | null) => {
  if (token === null) {
    return { token: null, expiresAt: Date.now() + 3600000, scope: 'read:profile' } as never;
  }
  return {
    token,
    expiresAt: Date.now() + 3600000,
    scope: 'read:profile',
  };
};

const setupEnvironment = (backendUrl?: string) => {
  const originalEnv = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (backendUrl !== undefined) {
    process.env.NEXT_PUBLIC_BACKEND_URL = backendUrl;
  } else {
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  return () => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_BACKEND_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
    }
  };
};

describe('FetchUserProfile', () => {
  let fetchUserProfile: (
    token: string,
    backendUrl: string,
  ) => Promise<{
    data: unknown;
    status: number;
    statusText: string;
    headers: unknown;
    config: unknown;
  }>;

  beforeAll(async () => {
    const { fetchUserProfile: fn } = await import('@/app/api/user/me/route');
    fetchUserProfile = fn;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should make correct API call with token and return user data', async () => {
    const mockUserData = {
      userId: '1',
      Email: 'test@example.com',
      Avatar: 'avatar.jpg',
    };
    const token = 'test-token';
    const backendUrl = 'http://localhost:5001';

    mockedAxios.get.mockResolvedValue(createMockAxiosResponse(mockUserData, 200));

    const result = await fetchUserProfile(token, backendUrl);

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
    const token = 'test-token';
    const backendUrl = 'http://localhost:5001';

    mockedAxios.get.mockResolvedValue(createMockAxiosResponse(null, 404));

    const result = await fetchUserProfile(token, backendUrl);

    expect(result.status).toBe(404);
    expect(result.data).toBe(null);
  });

  it('Should reject for non-200/404 status codes', async () => {
    const token = 'test-token';
    const backendUrl = 'http://localhost:5001';
    const axiosError = {
      isAxiosError: true,
      response: { status: 403, data: { error: 'Forbidden' } },
    };

    mockedAxios.get.mockRejectedValue(axiosError);

    await expect(fetchUserProfile(token, backendUrl)).rejects.toBe(axiosError);
  });

  it('Should configure validateStatus correctly', async () => {
    const token = 'test-token';
    const backendUrl = 'http://localhost:5001';

    mockedAxios.get.mockResolvedValue(createMockAxiosResponse({}, 200));

    await fetchUserProfile(token, backendUrl);

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

  beforeAll(async () => {
    const { GET: handler } = await import('@/app/api/user/me/route');
    GET = handler;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    restoreEnv = setupEnvironment('http://localhost:5001');
    mockedNextResponse.json.mockImplementation((data: unknown, init?: ResponseInit) => {
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));
      mockedAxios.get.mockResolvedValue(createMockAxiosResponse(mockUserData, 200));

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(mockUserData, { status: 200 });
    });
  });

  describe('Authentication errors', () => {
    it('Should return 401 when no access token', async () => {
      const mockRequest = {} as NextRequest;
      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse(null));

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthenticated', code: 'NO_ACCESS_TOKEN' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="No access token"',
          },
        },
      );
    });

    it('Should return 401 when getAccessToken returns undefined', async () => {
      const mockRequest = {} as NextRequest;
      mockedAuth0.getAccessToken.mockResolvedValue(undefined as never);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
        { error: 'Unauthenticated', code: 'NO_ACCESS_TOKEN' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="No access token"',
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
      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('invalid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Unauthenticated',
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(axiosError);
      mockedIsAxiosError.mockReturnValue(true);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(genericError);
      mockedIsAxiosError.mockReturnValue(false);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
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

      mockedAuth0.getAccessToken.mockResolvedValue(createMockTokenResponse('valid-token'));
      mockedAxios.get.mockRejectedValue(stringError);
      mockedIsAxiosError.mockReturnValue(false);

      await GET(mockRequest);

      expect(mockedNextResponse.json).toHaveBeenCalledWith(
        {
          error: 'Error occurred while getting ME profile',
          details: 'Something went wrong',
        },
        { status: 500 },
      );
    });
  });
});
