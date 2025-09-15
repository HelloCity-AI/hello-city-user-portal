import { put, takeLatest, call } from 'redux-saga/effects';
import { setUser, setLoading, fetchUser, setError, setAuth, AuthState } from '@/store/slices/user';
import userSaga, { handleFetchUser, fetchUserApi } from '@/store/sagas/userSaga';
import type { User } from '@/types/User.types';
import axios, {
  type AxiosResponse,
  type AxiosRequestHeaders,
  type AxiosResponseHeaders,
} from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createMockAxiosResponse = <T>(data: T, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {} as AxiosResponseHeaders,
  config: {
    url: '',
    method: 'get',
    headers: {} as AxiosRequestHeaders,
  },
});

describe('userSaga', () => {
  describe('HandleFetchUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should handle successful API call with 200 status', () => {
      const mockUserData: User = {
        userId: '1',
        Email: 'test@example.com',
        Avatar: 'avatar.jpg',
        Gender: '',
        nationality: '',
        city: '',
        university: 'Test University',
        major: 'Computer Science',
        preferredLanguage: '',
        lastJoinDate: new Date(),
      };

      const mockResponse = createMockAxiosResponse(mockUserData, 200);

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.next(mockResponse).value).toEqual(put(setUser(mockResponse.data)));
      expect(generator.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API call with 404 status', () => {
      const mockResponse = createMockAxiosResponse(null, 404);

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.next(mockResponse).value).toEqual(put(setUser(null)));
      expect(generator.next().value).toEqual(put(setAuth(AuthState.AuthenticatedButNoProfile)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API call with 401 status', () => {
      const mockResponse = createMockAxiosResponse(null, 401);

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.next(mockResponse).value).toEqual(put(setAuth(AuthState.Unauthenticated)));
      expect(generator.next().value).toEqual(put(setUser(null)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API errors', () => {
      const mockError = new Error('Network error');

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.throw(mockError).value).toEqual(put(setError('Network error')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle 4xx/5xx errors with message via catch', () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500, data: { error: 'Internal server error' } },
        message: 'Request failed with status code 500',
      };

      // axios.isAxiosError should return true
      mockedAxios.isAxiosError.mockReturnValue(true);

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.throw(axiosError).value).toEqual(put(setError('Internal server error')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle 4xx without error message via catch', () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403, data: {} },
        message: 'Request failed with status code 403',
      };

      mockedAxios.isAxiosError.mockReturnValue(true);

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApi));
      expect(generator.throw(axiosError).value).toEqual(
        put(setError('Request failed with status code 403')),
      );
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('fetchUserApi', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should make correct API call to BFF endpoint', async () => {
      const mockUserData = {
        userId: '1',
        Email: 'test@example.com',
      };

      mockedAxios.get.mockResolvedValue(createMockAxiosResponse(mockUserData, 200));

      const result = await fetchUserApi();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/user/me',
        expect.objectContaining({ validateStatus: expect.any(Function) }),
      );
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockUserData);
    });

    it('Should handle 404 responses', async () => {
      mockedAxios.get.mockResolvedValue(createMockAxiosResponse(null, 404));

      const result = await fetchUserApi();

      expect(result.status).toBe(404);
      expect(result.data).toBe(null);
    });

    it('Should reject for non-200/404 responses', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 403, data: { error: 'Forbidden' } },
      };
      mockedAxios.get.mockRejectedValue(axiosError);
      await expect(fetchUserApi()).rejects.toBe(axiosError);
    });
  });

  describe('userSaga root', () => {
    it('Should watch for fetchUser actions with takeLatest', () => {
      const userSagaGenerator = userSaga();

      const effect = userSagaGenerator.next().value;
      expect(effect).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(userSagaGenerator.next().done).toBe(true);
    });
  });
});
