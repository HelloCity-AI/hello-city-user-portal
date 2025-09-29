// Mock fetch API for testing App Router endpoints
global.fetch = jest.fn();

import { put, takeLatest, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/User.types';
import { AuthState } from '@/store/slices/user';
import { Cities, Genders, Nationalities, Languages } from '@/enums/UserAttributes';
import userSaga, {
  fetchUserApiWrapper,
  createUserApiWrapper,
  handleFetchUser,
  handleCreateUser,
} from '@/store/sagas/userSaga';
import {
  setUser,
  setLoading,
  setError,
  setAuth,
  fetchUser,
  createUser,
  createUserSuccess,
  createUserFailure,
} from '@/store/slices/user';
// Create typed mock for fetch
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('userSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    userId: 'test-user-id',
    Email: 'test@example.com',
    Avatar: 'avatar-url',
    Gender: Genders.Male,
    nationality: Nationalities.China,
    city: Cities.Sydney,
    university: 'Test University',
    major: 'Computer Science',
    preferredLanguage: Languages.English,
    lastJoinDate: new Date('2023-01-01'),
  };

  describe('fetchUserApiWrapper', () => {
    it('should fetch user successfully', async () => {
      // Mock fetch to return successful response
      mockedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await fetchUserApiWrapper();

      // eslint-disable-next-line no-console
      console.log('fetchUserApiWrapper result:', result);

      expect(mockedFetch).toHaveBeenCalledWith('/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      expect(result).toMatchObject({ status: 200, ok: true });
      expect(result.data).toBeDefined();
    });
  });

  describe('createUserApiWrapper', () => {
    it('should create user successfully', async () => {
      const newUser: User = {
        userId: 'new-user-id',
        Email: 'newuser@example.com',
        Avatar: 'new-avatar-url',
        Gender: Genders.Female,
        nationality: Nationalities.Korea,
        city: Cities.Melbourne,
        university: 'New University',
        major: 'Engineering',
        preferredLanguage: Languages.English,
        lastJoinDate: new Date('2023-02-01'),
      };

      // Mock fetch to return successful response
      mockedFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({ userId: '12345' }),
      } as any);

      const result = await createUserApiWrapper(newUser);

      expect(mockedFetch).toHaveBeenCalledWith('/api/user/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
        cache: 'no-store',
      });
      expect(result).toMatchObject({ status: 201, ok: true });
      expect(result.data).toBeDefined();
      // eslint-disable-next-line no-console
      console.log('createUserApiWrapper result:', result);
    });

    it('should handle errors during user creation', async () => {
      const newUser: User = {
        userId: 'error-user-id',
        Email: 'error@example.com',
        Avatar: 'error-avatar-url',
        Gender: Genders.Other,
        nationality: Nationalities.Japan,
        city: Cities.Adelaide,
        university: 'Error University',
        major: 'Mathematics',
        preferredLanguage: Languages.Chinese,
        lastJoinDate: new Date('2023-03-01'),
      };

      // Mock fetch to return error response
      mockedFetch.mockRejectedValue(new Error('Creation error'));

      const result = await createUserApiWrapper(newUser);
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  describe('handleFetchUser', () => {
    it('should handle successful user fetch', () => {
      const mockResponse = {
        status: 200,
        data: mockUser,
        ok: true,
      };

      const generator = handleFetchUser();

      expect(generator.next().value).toEqual(put(setLoading(true)));
      expect(generator.next().value).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockResponse).value).toEqual(put(setUser(mockUser)));
      expect(generator.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle 401 unauthorized', () => {
      const mockResponse = {
        status: 401,
        data: null,
        ok: false,
      };

      const generator = handleFetchUser();

      expect(generator.next().value).toEqual(put(setLoading(true)));
      expect(generator.next().value).toEqual(call(fetchUserApiWrapper));
      expect(generator.next(mockResponse).value).toEqual(put(setAuth(AuthState.Unauthenticated)));
      expect(generator.next().value).toEqual(put(setUser(null)));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle user fetch error', () => {
      const error = new Error('Fetch failed');
      const generator = handleFetchUser();

      expect(generator.next().value).toEqual(put(setLoading(true)));
      expect(generator.next().value).toEqual(call(fetchUserApiWrapper));
      expect(generator.throw(error).value).toEqual(put(setError('Fetch failed')));
      expect(generator.next().value).toEqual(put(setLoading(false)));
      expect(generator.next().done).toBe(true);
    });
  });

  describe('handleCreateUser', () => {
    it('should handle successful user creation', () => {
      const newUser: User = {
        userId: 'new-user-id',
        Email: 'newuser@example.com',
        Avatar: 'new-avatar-url',
        Gender: Genders.Female,
        nationality: Nationalities.Korea,
        city: Cities.Perth,
        university: 'New University',
        major: 'Engineering',
        preferredLanguage: Languages.English,
        lastJoinDate: new Date('2023-02-01'),
      };

      const mockResponse = {
        status: 201,
        data: newUser,
        ok: true,
      };

      const action: PayloadAction<User> = { type: 'createUser', payload: newUser };
      const generator = handleCreateUser(action);

      expect(generator.next().value).toEqual(call(createUserApiWrapper, newUser));
      expect(generator.next(mockResponse).value).toEqual(put(createUserSuccess(newUser)));
      expect(generator.next().done).toBe(true);
    });

    it('should handle creation error', () => {
      const newUser: User = {
        userId: 'error-user-id',
        Email: 'error@example.com',
        Avatar: 'error-avatar-url',
        Gender: Genders.Other,
        nationality: Nationalities.Japan,
        city: Cities.Adelaide,
        university: 'Error University',
        major: 'Mathematics',
        preferredLanguage: Languages.Chinese,
        lastJoinDate: new Date('2023-03-01'),
      };

      const action: PayloadAction<User> = { type: 'createUser', payload: newUser };
      const generator = handleCreateUser(action);

      const failedResponse = { status: 500, data: null, ok: false };

      expect(generator.next().value).toEqual(call(createUserApiWrapper, newUser));
      expect(generator.next(failedResponse).value).toEqual(
        put(createUserFailure('Failed to create user: 500')),
      );
      expect(generator.next().done).toBe(true);
    });
  });

  describe('userSaga watcher', () => {
    it('should watch for fetchUser and createUser actions', () => {
      const generator = userSaga();

      expect(generator.next().value).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(generator.next().value).toEqual(takeLatest(createUser.type, handleCreateUser));
      expect(generator.next().done).toBe(true);
    });
  });
});
