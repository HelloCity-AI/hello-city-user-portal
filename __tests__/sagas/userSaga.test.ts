// Mock global fetch
global.fetch = jest.fn();

// Mock the Server Action
jest.mock('@/actions/user', () => ({
  createUserAction: jest.fn(),
}));

import { put, takeLatest, call } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';
import {
  AuthState,
  setUser,
  setLoading,
  setError,
  setAuth,
  fetchUser,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} from '@/store/slices/user';
import { Cities, Genders, Nationalities, Languages } from '@/enums/UserAttributes';
import userSaga, {
  fetchUserApiWrapper,
  createUserApiWrapper,
  updateUserApiWrapper,
  handleFetchUser,
  handleCreateUser,
  handleUpdateUser,
} from '@/store/sagas/userSaga';
import { createUserAction } from '@/actions/user';

const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockedCreateUserAction = createUserAction as jest.MockedFunction<typeof createUserAction>;

describe('userSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    userId: 'test-user-id',
    email: 'test@example.com',
    avatar: 'avatar-url',
    gender: Genders.Male,
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
        email: 'newuser@example.com',
        avatar: 'new-avatar-url',
        gender: Genders.Female,
        nationality: Nationalities.Korea,
        city: Cities.Melbourne,
        university: 'New University',
        major: 'Engineering',
        preferredLanguage: Languages.English,
        lastJoinDate: new Date('2023-02-01'),
      };

      // Mock Server Action to return successful response
      mockedCreateUserAction.mockResolvedValue({
        success: true,
        data: { userId: '12345' },
        status: 201,
      });

      const result = await createUserApiWrapper(newUser);

      // Verify Server Action was called with FormData
      expect(mockedCreateUserAction).toHaveBeenCalledWith(expect.any(FormData));

      // Verify the FormData contains expected fields
      const formDataCall = mockedCreateUserAction.mock.calls[0][0] as FormData;
      expect(formDataCall.get('Email')).toBe('newuser@example.com');
      expect(formDataCall.get('Gender')).toBe(Genders.Female);
      expect(formDataCall.get('City')).toBe(Cities.Melbourne);
      expect(formDataCall.get('Nationality')).toBe(Nationalities.Korea);
      expect(formDataCall.get('PreferredLanguage')).toBe(Languages.English);
      expect(formDataCall.get('Avatar')).toBe('new-avatar-url');
      expect(formDataCall.get('University')).toBe('New University');
      expect(formDataCall.get('Major')).toBe('Engineering');

      expect(result).toMatchObject({ status: 201, ok: true });
      expect(result.data).toBeDefined();
      // eslint-disable-next-line no-console
      console.log('createUserApiWrapper result:', result);
    });

    it('should handle errors during user creation', async () => {
      const newUser: User = {
        userId: 'error-user-id',
        email: 'error@example.com',
        avatar: 'error-avatar-url',
        gender: Genders.Other,
        nationality: Nationalities.Japan,
        city: Cities.Adelaide,
        university: 'Error University',
        major: 'Mathematics',
        preferredLanguage: Languages.Chinese,
        lastJoinDate: new Date('2023-03-01'),
      };

      // Mock Server Action to return error response
      mockedCreateUserAction.mockRejectedValue(new Error('Creation error'));

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
        email: 'newuser@example.com',
        avatar: 'new-avatar-url',
        gender: Genders.Female,
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
        email: 'error@example.com',
        avatar: 'error-avatar-url',
        gender: Genders.Other,
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
    it('should watch for fetchUser, createUser, and updateUser actions', () => {
      const generator = userSaga();

      expect(generator.next().value).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(generator.next().value).toEqual(takeLatest(createUser.type, handleCreateUser));
      expect(generator.next().value).toEqual(takeLatest(updateUser.type, handleUpdateUser));
      expect(generator.next().done).toBe(true);
    });
  });
});
