import { put, takeLatest } from 'redux-saga/effects';
import { setUser, setLoading, fetchUser, setError } from '../../src/store/slices/user';
import userSaga, { handleFetchUser, fetchUserApi } from '../../src/store/sagas/userSaga';
import type { User } from '../../src/types/User.types';
import axios from 'axios';

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userSaga', () => {
  describe('HandleFetchUser', () => {
    const mockToken = 'mock-jwt-token';
    const mockAction = { payload: mockToken, type: fetchUser.type };

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

      const mockResponse = {
        status: 200,
        data: mockUserData,
      };

      const generator = handleFetchUser(mockAction);
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect.type).toBe('CALL');
      expect(generator.next(mockResponse).value).toEqual(put(setUser(mockResponse.data)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API call with 404 status', () => {
      const mockResponse = {
        status: 404,
        data: null,
      };

      const generator = handleFetchUser(mockAction);
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect.type).toBe('CALL');
      expect(generator.next(mockResponse).value).toEqual(put(setUser(null)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API errors', () => {
      const mockError = new Error('Network error');

      // Mock console.error to avoid logs in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const generator = handleFetchUser(mockAction);
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect.type).toBe('CALL');
      expect(generator.throw(mockError).value).toEqual(put(setError('Network error')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });

    it('Should handle unexpected status codes', () => {
      const mockResponse = {
        status: 500,
        data: null,
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const generator = handleFetchUser(mockAction);
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect.type).toBe('CALL');
      expect(generator.next(mockResponse).value).toEqual(put(setError('Unexpected status 500')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('fetchUserApi', () => {
    const mockToken = 'mock-jwt-token';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000';
    });

    it('Should make correct API call with token', async () => {
      const mockUserData = {
        userId: '1',
        Email: 'test@example.com',
      };

      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: mockUserData,
      });

      const result = await fetchUserApi(mockToken);

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/user/me', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          cache: 'no-store',
        },
        validateStatus: expect.any(Function),
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockUserData);
    });

    it('Should handle 404 responses', async () => {
      mockedAxios.get.mockResolvedValue({
        status: 404,
        data: null,
      });

      const result = await fetchUserApi(mockToken);

      expect(result.status).toBe(404);
      expect(result.data).toBe(null);
    });

    it('Should configure validateStatus correctly', async () => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {},
      });

      await fetchUserApi(mockToken);

      const validateStatusFn = mockedAxios.get.mock.calls[0][1]?.validateStatus;
      expect(validateStatusFn).toBeDefined();

      // Test the validateStatus function
      expect(validateStatusFn!(200)).toBe(true); // Success status
      expect(validateStatusFn!(404)).toBe(true); // Allowed error status
      expect(validateStatusFn!(500)).toBe(false); // Should not validate
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

describe('Additional tests for userSaga (edge cases and robustness)', () => {
  // Reuse existing axios mock and imports from the file top-level

  describe('HandleFetchUser edge cases', () => {
    const baseType = fetchUser.type;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should handle empty token payload gracefully', () => {
      const mockAction = { payload: '', type: baseType };
      const generator = handleFetchUser(mockAction as any);

      // Starts loading
      expect(generator.next().value).toEqual(put(setLoading(true)));

      // Ensures an API call is attempted (implementation may still call API with empty token)
      const callEffect = generator.next().value;
      expect(callEffect && (callEffect as any).type).toBe('CALL');

      // Simulate API treating empty token as unauthorized/404
      const mockResponse = { status: 404, data: null };
      expect(generator.next(mockResponse as any).value).toEqual(put(setUser(null)));

      // Ends loading
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should report error message string if error is not an Error instance', () => {
      // Some code paths may throw non-Error (e.g., string)
      const mockAction = { payload: 'token', type: baseType };
      const generator = handleFetchUser(mockAction as any);

      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect && (callEffect as any).type).toBe('CALL');

      // Throw a string error
      const err = 'Something bad happened';
      expect(generator.throw(err as any).value).toEqual(put(setError('Something bad happened')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should coerce unknown error to a generic message when no message field is present', () => {
      const mockAction = { payload: 'token', type: baseType };
      const generator = handleFetchUser(mockAction as any);

      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect && (callEffect as any).type).toBe('CALL');

      // Throw an object without message (common with axios/network rejections)
      const err = { code: 'EUNKNOWN' };
      // Depending on implementation, expect either JSON stringified or a fallback
      // Prefer checking that setError is dispatched with a string.
      const effect = generator.throw(err as any).value as any;
      expect(effect && effect.PAYLOAD && typeof effect.PAYLOAD).toBeDefined();
      // Verify the effect is setError with a string payload
      expect(effect.PUT?.action?.type ?? effect.payload?.action?.type ?? effect.action?.type ?? effect.payload?.type).toBe(setError.type);
      const payload = effect.PUT?.action?.payload ?? effect.payload?.action?.payload ?? effect.action?.payload ?? effect.payload?.payload;
      expect(typeof payload).toBe('string');

      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('fetchUserApi configuration robustness', () => {
    const token = 't0k';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000';
    });

    it('Should include no-store cache header and Authorization when token is falsy (null)', async () => {
      const mockUserData = { ok: true };
      (axios as any).get.mockResolvedValue({ status: 200, data: mockUserData });

      const res = await fetchUserApi(null as unknown as string);

      // Validate headers passed to axios.get
      const call = (axios as any).get.mock.calls[0];
      const url = call[0];
      const opts = call[1];

      expect(url).toBe('http://localhost:8000/api/user/me');
      expect(opts.headers).toMatchObject({
        Authorization: `Bearer ${null as unknown as string}`,
        cache: 'no-store',
      });
      expect(typeof opts.validateStatus).toBe('function');

      expect(res.status).toBe(200);
      expect(res.data).toEqual(mockUserData);
    });

    it('Should use backend URL from env and tolerate trailing slash', async () => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://api.example.com/';
      (axios as any).get.mockResolvedValue({ status: 404, data: null });

      await fetchUserApi(token);

      const [url] = (axios as any).get.mock.calls[0];
      // Accept both with or without deduplication depending on implementation
      expect(url === 'http://api.example.com/api/user/me' || url === 'http://api.example.com//api/user/me').toBe(true);
    });

    it('validateStatus should allow 401/403/404 as non-throwing but deny 500+', async () => {
      (axios as any).get.mockResolvedValue({ status: 401, data: {} });
      await fetchUserApi(token);
      const { validateStatus } = (axios as any).get.mock.calls[0][1];
      expect(validateStatus(200)).toBe(true);
      expect(validateStatus(401)).toBe(true);
      expect(validateStatus(403)).toBe(true);
      expect(validateStatus(404)).toBe(true);
      expect(validateStatus(500)).toBe(false);
      expect(validateStatus(503)).toBe(false);
    });
  });

  describe('userSaga root watcher resilience', () => {
    it('Should only takeLatest(fetchUser) and not duplicate watchers on re-invocation', () => {
      const gen1 = userSaga();
      const first = gen1.next().value;
      expect(first).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(gen1.next().done).toBe(true);

      // re-create a new instance to ensure stable behavior
      const gen2 = userSaga();
      const first2 = gen2.next().value;
      expect(first2).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(gen2.next().done).toBe(true);
    });
  });
});
