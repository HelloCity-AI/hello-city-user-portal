import axios from 'axios';

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
