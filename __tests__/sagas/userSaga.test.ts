import { put, takeLatest, call } from 'redux-saga/effects';
import {
  setUser,
  setLoading,
  fetchUser,
  setError,
  setAuth,
  AuthState,
  createUser,
  createUserSuccess,
  createUserFailure,
} from '@/store/slices/user';
import userSaga, {
  handleFetchUser,
  handleCreateUser,
  fetchUserApiWrapper,
  createUserApiWrapper,
} from '@/store/sagas/userSaga';
import type { User } from '@/types/User.types';
import { fetchUser as fetchCurrentUserApi, createUser as createUserApi } from '@/api/userApi';

// Mock the fetchWithAuth utility
jest.mock('@/utils/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

// Mock the userApi module
jest.mock('@/api/userApi', () => ({
  fetchUser: jest.fn(),
  createUser: jest.fn(),
}));

const mockedFetchCurrentUser = fetchCurrentUserApi as jest.MockedFunction<
  typeof fetchCurrentUserApi
>;
const mockedCreateUser = createUserApi as jest.MockedFunction<typeof createUserApi>;

const createMockResponse = <T>(data: T, status = 200, ok = true): Response =>
  ({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
    url: '',
    redirected: false,
    type: 'basic',
    body: null,
    bodyUsed: false,
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    bytes: jest.fn(),
  }) as unknown as Response;

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

      const mockResponse = { status: 200, data: mockUserData, ok: true };

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockResponse).value).toEqual(put(setUser(mockResponse.data)));
      expect(generator.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API call with 404 status', () => {
      const mockResponse = { status: 404, data: null, ok: false };

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockResponse).value).toEqual(
        put(setError('Failed to fetch user: 404')),
      );
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API call with 401 status', () => {
      const mockResponse = { status: 401, data: null, ok: false };

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockResponse).value).toEqual(put(setAuth(AuthState.Unauthenticated)));
      expect(generator.next().value).toEqual(put(setUser(null)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle API errors', () => {
      const mockErrorResponse = { status: 500, data: null, ok: false };

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));

      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockErrorResponse).value).toEqual(
        put(setError('Failed to fetch user: 500')),
      );
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle errors with message via catch', () => {
      const mockError = new Error('Request failed with status code 500');

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.throw(mockError).value).toEqual(
        put(setError('Request failed with status code 500')),
      );
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle unknown errors via catch', () => {
      const unknownError = 'Unknown error';

      const generator = handleFetchUser();
      expect(generator.next().value).toEqual(put(setLoading(true)));
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(fetchUserApiWrapper));
      expect(generator.throw(unknownError).value).toEqual(put(setError('Unknown error occurred')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('handleCreateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should handle successful user creation with 200 status', () => {
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

      const mockResponse = { status: 200, data: mockUserData, ok: true };
      const action = { type: 'user/createUser', payload: mockUserData };

      const generator = handleCreateUser(action);
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(createUserApiWrapper, mockUserData));
      expect(generator.next(mockResponse).value).toEqual(put(createUserSuccess(mockUserData)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle successful user creation with 201 status', () => {
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

      const mockResponse = { status: 201, data: mockUserData, ok: true };
      const action = { type: 'user/createUser', payload: mockUserData };

      const generator = handleCreateUser(action);
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(createUserApiWrapper, mockUserData));
      expect(generator.next(mockResponse).value).toEqual(put(createUserSuccess(mockUserData)));
      expect(generator.next().done).toBe(true);
    });

    it('Should handle user creation failure', () => {
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

      const mockResponse = { status: 400, data: { error: 'User already exists' }, ok: false };
      const action = { type: 'user/createUser', payload: mockUserData };

      const generator = handleCreateUser(action);
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(createUserApiWrapper, mockUserData));
      expect(generator.next(mockResponse).value).toEqual(
        put(createUserFailure('Failed to create user: 400')),
      );
      expect(generator.next().done).toBe(true);
    });

    it('Should handle user creation error', () => {
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

      const mockError = new Error('Network error');
      const action = { type: 'user/createUser', payload: mockUserData };

      const generator = handleCreateUser(action);
      const callEffect = generator.next().value;
      expect(callEffect).toEqual(call(createUserApiWrapper, mockUserData));
      expect(generator.throw(mockError).value).toEqual(put(createUserFailure('Network error')));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('userSaga root', () => {
    it('Should watch for fetchUser and createUser actions with takeLatest', () => {
      const userSagaGenerator = userSaga();

      const fetchEffect = userSagaGenerator.next().value;
      expect(fetchEffect).toEqual(takeLatest(fetchUser.type, handleFetchUser));

      const createEffect = userSagaGenerator.next().value;
      expect(createEffect).toEqual(takeLatest(createUser.type, handleCreateUser));

      expect(userSagaGenerator.next().done).toBe(true);
    });
  });
});
