// Mock global fetch
global.fetch = jest.fn();

// Mock the Server Action
jest.mock('@/actions/user', () => ({
  createUserAction: jest.fn(),
  updateUserAction: jest.fn(),
}));

import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';
import { registerFile } from '@/upload/fileRegistry';
import type { CreateUserPayload } from '@/store/slices/user';

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

import { createUserAction, updateUserAction } from '@/actions/user';

// Narrowed mock types
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockedCreateUserAction = createUserAction as jest.MockedFunction<typeof createUserAction>;
const mockedUpdateUserAction = updateUserAction as jest.MockedFunction<typeof updateUserAction>;

// ---- Test data --------------------------------------------------------------

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

// Helper to build a minimal fetch Response-like object
const res = (status: number, ok: boolean, body?: unknown) =>
  ({
    ok,
    status,
    json:
      body !== undefined
        ? jest.fn().mockResolvedValue(body)
        : jest.fn().mockRejectedValue(new Error('no body')),
  }) as any;

// ---- Tests ------------------------------------------------------------------

describe('UserSaga – API wrappers & handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------- fetchUserApiWrapper -------------------
  describe('FetchUserApiWrapper', () => {
    it('Calls /api/user/me with credentials and no-store, returns parsed JSON on 200', async () => {
      mockedFetch.mockResolvedValue(res(200, true, mockUser));

      const result = await fetchUserApiWrapper();

      expect(mockedFetch).toHaveBeenCalledWith('/api/user/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
      });
      expect(result).toEqual({ status: 200, data: mockUser, ok: true });
    });

    it('Handles 204 (no content): returns ok but data=null (json() fails)', async () => {
      mockedFetch.mockResolvedValue(res(204, true));

      const result = await fetchUserApiWrapper();
      expect(result.status).toBe(204);
      expect(result.ok).toBe(true);
      expect(result.data).toBeNull();
    });

    it('On fetch error: returns { status: 500, ok: false }', async () => {
      mockedFetch.mockRejectedValue(new Error('network boom'));
      const result = await fetchUserApiWrapper();
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- createUserApiWrapper -------------------
  describe('CreateUserApiWrapper', () => {
    it('Passes FormData to server action and maps success result', async () => {
      const imageId = 'image111';
      const avatarBlob = new Blob(['avatar-bytes'], { type: 'image/png' });
      registerFile(imageId, avatarBlob);

      const newUser: CreateUserPayload = {
        userId: 'new-user-id',
        email: 'newuser@example.com',
        gender: Genders.Female,
        nationality: Nationalities.Korea,
        city: Cities.Melbourne,
        university: 'New University',
        major: 'Engineering',
        preferredLanguage: Languages.English,
        lastJoinDate: new Date('2023-02-01'),
        imageId,
      };

      mockedCreateUserAction.mockResolvedValue({
        success: true,
        data: { userId: 'server-id-123' },
        status: 201,
      });

      const result = await createUserApiWrapper(newUser);

      // Ensure server action was called with FormData
      expect(mockedCreateUserAction).toHaveBeenCalledWith(expect.any(FormData));
      const sent = mockedCreateUserAction.mock.calls[0][0] as FormData;

      // Verify mapped fields
      expect(sent.get('Email')).toBe('newuser@example.com');
      expect(sent.get('Gender')).toBe(Genders.Female);
      expect(sent.get('City')).toBe(Cities.Melbourne);
      expect(sent.get('Nationality')).toBe(Nationalities.Korea);
      expect(sent.get('PreferredLanguage')).toBe(Languages.English);
      expect(sent.get('University')).toBe('New University');
      expect(sent.get('Major')).toBe('Engineering');
      expect(sent.get('Username')).toBe('new-user-id');

      const sentFile = sent.get('File');
      expect(sentFile).toBeInstanceOf(Blob);

      expect(result).toEqual({
        status: 201,
        data: { userId: 'server-id-123' },
        ok: true,
      });
    });

    it('Maps server action rejection to {500, ok:false}', async () => {
      mockedCreateUserAction.mockRejectedValue(new Error('Creation error'));
      const result = await createUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- updateUserApiWrapper -------------------
  describe('UpdateUserApiWrapper', () => {
    it('Calls server action with FormData and maps 200 JSON', async () => {
      mockedUpdateUserAction.mockResolvedValue({
        success: true,
        status: 200,
        data: { ...mockUser, major: 'Math' },
      });

      const updated = { ...mockUser, major: 'Math' };
      const result = await updateUserApiWrapper(updated);

      expect(mockedUpdateUserAction).toHaveBeenCalledTimes(1);
      const arg = mockedUpdateUserAction.mock.calls[0][0];
      expect(arg).toBeInstanceOf(FormData);
      expect(result).toEqual({ status: 200, data: { ...mockUser, major: 'Math' }, ok: true });
    });

    it('Maps 204 to ok=true and data=null', async () => {
      mockedUpdateUserAction.mockResolvedValue({ success: true, status: 204, data: null });
      const result = await updateUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 204, data: null, ok: true });
    });

    it('On server action error: returns {500, ok:false}', async () => {
      mockedUpdateUserAction.mockRejectedValue(new Error('put failed'));
      const result = await updateUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- handleFetchUser -------------------
  describe('HandleFetchUser (generator)', () => {
    it('200 with non-empty profile -> setUser + setAuth(WithProfile)', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 200, ok: true, data: mockUser };
      expect(g.next(response as any).value).toEqual(put(setUser(mockUser)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('200 with empty profile -> setUser(null) + setAuth(ButNoProfile)', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 200, ok: true, data: {} };
      expect(g.next(response as any).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedButNoProfile)));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('204 (no content) -> setUser(null) + setAuth(ButNoProfile)', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 204, ok: true, data: null };
      expect(g.next(response as any).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedButNoProfile)));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('401 -> setUser(null) + setAuth(Unauthenticated)', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 401, ok: false, data: null };
      expect(g.next(response as any).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.Unauthenticated)));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('Throws -> setError only; no auth change', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const err = new Error('boom');
      expect(g.throw(err).value).toEqual(put(setError('boom')));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });
  });

  // ------------------- handleCreateUser -------------------
  describe('HandleCreateUser (generator)', () => {
    it('201/200 -> createUserSuccess + setAuth(WithProfile)', () => {
      const action: PayloadAction<User> = { type: createUser.type, payload: mockUser };
      const g = handleCreateUser(action);

      expect(g.next().value).toEqual(call(createUserApiWrapper, mockUser));

      const response = { status: 201, ok: true, data: mockUser };
      expect(g.next(response as any).value).toEqual(put(createUserSuccess(mockUser)));
      // In your latest saga, you also set AuthState.AuthenticatedWithProfile on success:
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(g.next().value).toEqual(put(fetchUser()));
      expect(g.next().done).toBe(true);
    });

    it('Non-2xx -> createUserFailure', () => {
      const action: PayloadAction<User> = { type: createUser.type, payload: mockUser };
      const g = handleCreateUser(action);

      expect(g.next().value).toEqual(call(createUserApiWrapper, mockUser));

      const response = { status: 500, ok: false, data: null };
      expect(g.next(response as any).value).toEqual(
        put(createUserFailure('create user failed: 500')),
      );
      expect(g.next().done).toBe(true);
    });
  });

  // ------------------- handleUpdateUser -------------------
  describe('HandleUpdateUser (generator)', () => {
    it('200/204 -> updateUserSuccess', () => {
      const updated: User = { ...mockUser, major: 'Math' };
      const action: PayloadAction<User> = { type: updateUser.type, payload: updated };
      const g = handleUpdateUser(action);

      expect(g.next().value).toEqual(call(updateUserApiWrapper, updated));

      const response = { status: 204, ok: true, data: null };
      expect(g.next(response as any).value).toEqual(put(updateUserSuccess(updated)));
      expect(g.next().done).toBe(true);
    });

    it('Non-2xx -> updateUserFailure', () => {
      const action: PayloadAction<User> = { type: updateUser.type, payload: mockUser };
      const g = handleUpdateUser(action);

      expect(g.next().value).toEqual(call(updateUserApiWrapper, mockUser));

      const response = { status: 500, ok: false, data: null };
      expect(g.next(response as any).value).toEqual(
        put(updateUserFailure('update user failed: 500')),
      );
      expect(g.next().done).toBe(true);
    });
  });

  // ------------------- watcher -------------------
  describe('UserSaga watcher', () => {
    it('Watches fetchUser, createUser, updateUser', () => {
      const g = userSaga();
      expect(g.next().value).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(g.next().value).toEqual(takeLatest(createUser.type, handleCreateUser));
      expect(g.next().value).toEqual(takeLatest(updateUser.type, handleUpdateUser));
      expect(g.next().done).toBe(true);
    });
  });
});
