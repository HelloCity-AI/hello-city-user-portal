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
