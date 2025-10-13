global.fetch = jest.fn();

// Mock the Server Actions
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
  markFetched,
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

// ---- Narrowed mocks
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockedCreateUserAction = createUserAction as jest.MockedFunction<typeof createUserAction>;
const mockedUpdateUserAction = updateUserAction as jest.MockedFunction<typeof updateUserAction>;

// ---- Test data
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

// Minimal Response-like builder
const res = (status: number, ok: boolean, body?: unknown) =>
  ({
    ok,
    status,
    json:
      body !== undefined
        ? jest.fn().mockResolvedValue(body)
        : jest.fn().mockRejectedValue(new Error('no body')),
  }) as any;

describe('UserSaga – API Wrappers & Handlers (NEW)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------- fetchUserApiWrapper -------------------
  describe('FetchUserApiWrapper', () => {
    it('200 → Returns parsed JSON', async () => {
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

    it('204 → Ok with null data', async () => {
      mockedFetch.mockResolvedValue(res(204, true));
      const result = await fetchUserApiWrapper();
      expect(result).toEqual({ status: 204, data: null, ok: true });
    });

    it('Fetch throws → 500', async () => {
      mockedFetch.mockRejectedValue(new Error('boom'));
      const result = await fetchUserApiWrapper();
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- createUserApiWrapper -------------------
  describe('CreateUserApiWrapper', () => {
    it('Sends FormData to server action and maps fields', async () => {
      const imageId = 'img-1';
      const blob = new Blob(['x'], { type: 'image/png' });
      registerFile(imageId, blob);

      const newUser: CreateUserPayload = {
        userId: 'new-id',
        email: 'new@example.com',
        gender: Genders.Female,
        nationality: Nationalities.Korea,
        city: Cities.Melbourne,
        university: 'Uni',
        major: 'Eng',
        preferredLanguage: Languages.English,
        lastJoinDate: new Date('2023-02-01'),
        imageId,
      };

      mockedCreateUserAction.mockResolvedValue({
        success: true,
        status: 201,
        data: { userId: 'server-uid' },
      });

      const result = await createUserApiWrapper(newUser);
      expect(mockedCreateUserAction).toHaveBeenCalledWith(expect.any(FormData));
      const fd = mockedCreateUserAction.mock.calls[0][0] as FormData;
      expect(fd.get('Email')).toBe('new@example.com');
      expect(fd.get('Gender')).toBe(Genders.Female);
      expect(fd.get('City')).toBe(Cities.Melbourne);
      expect(fd.get('Nationality')).toBe(Nationalities.Korea);
      expect(fd.get('PreferredLanguage')).toBe(Languages.English);
      expect(fd.get('University')).toBe('Uni');
      expect(fd.get('Major')).toBe('Eng');
      expect(fd.get('Username')).toBe('new-id');
      expect(fd.get('File')).toBeInstanceOf(Blob);
      expect(result).toEqual({ status: 201, data: { userId: 'server-uid' }, ok: true });
    });

    it('Server action throws → 500', async () => {
      mockedCreateUserAction.mockRejectedValue(new Error('x'));
      const result = await createUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- updateUserApiWrapper -------------------
  describe('UpdateUserApiWrapper', () => {
    it('200 → Ok with returned data', async () => {
      mockedUpdateUserAction.mockResolvedValue({
        success: true,
        status: 200,
        data: { ...mockUser, major: 'Math' },
      });
      const result = await updateUserApiWrapper({ ...mockUser, major: 'Math' });
      expect(mockedUpdateUserAction).toHaveBeenCalledWith(expect.any(FormData));
      expect(result).toEqual({ status: 200, data: { ...mockUser, major: 'Math' }, ok: true });
    });

    it('204 → Ok true with null data', async () => {
      mockedUpdateUserAction.mockResolvedValue({ success: true, status: 204, data: null });
      const result = await updateUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 204, data: null, ok: true });
    });

    it('Throws → 500', async () => {
      mockedUpdateUserAction.mockRejectedValue(new Error('bad'));
      const result = await updateUserApiWrapper(mockUser);
      expect(result).toEqual({ status: 500, data: null, ok: false });
    });
  });

  // ------------------- handleFetchUser (generator) -------------------
  describe('HandleFetchUser', () => {
    it('200 + Non-empty → setUser + setAuth(WithProfile) + finally markFetched & stop loading', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 200, ok: true, data: mockUser };
      expect(g.next(response as any).value).toEqual(put(setUser(mockUser)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));

      // Return → finally
      expect(g.next().value).toEqual(put(markFetched()));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('200 + Empty → setUser(null) + setAuth(ButNoProfile) + finally', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 200, ok: true, data: {} };
      expect(g.next(response as any).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedButNoProfile)));

      expect(g.next().value).toEqual(put(markFetched()));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('204 → setUser(null) + setAuth(ButNoProfile) + finally', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 204, ok: true, data: null };
      expect(g.next(response as any).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedButNoProfile)));

      expect(g.next().value).toEqual(put(markFetched()));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('401 + Already WithProfile (Soft Refresh) → No Downgrade; Optional Retry; Finally Runs', () => {
      const g = handleFetchUser();

      // Enter and fetch
      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      // First 401
      const response = { status: 401, ok: false, data: null };
      // The next yield is select(...). Skip strict equality; just advance.
      g.next(response as any);

      // Feed select result: currently WithProfile
      const curAuth = AuthState.AuthenticatedWithProfile;
      let eff = g.next(curAuth).value as any;

      // Implementation may:
      // - Jump directly to finally (PUT markFetched/setLoading)
      // - Yield delay(350) (CALL), then call(fetchUserApiWrapper) retry
      // - Or call(fetchUserApiWrapper) retry immediately
      // All are fine, but it must NOT downgrade to Unauthenticated here.
      expect(eff).not.toEqual(put(setAuth(AuthState.Unauthenticated)));

      // If CALL, it could be delay or retry
      const isCall = eff && typeof eff === 'object' && eff.type === 'CALL';

      if (isCall) {
        const isRetry = eff.payload && eff.payload.fn === fetchUserApiWrapper;

        if (!isRetry) {
          // Treat as delay; advance once more to reach retry or finally
          eff = g.next().value as any;
        }

        // If this is the retry, feed a failing retry result and advance
        if (eff && eff.type === 'CALL' && eff.payload?.fn === fetchUserApiWrapper) {
          eff = g.next({ status: 401, ok: false, data: null } as any).value as any;
        }
      }

      // At this point, we should be in finally. There should be at least one PUT effect; then the generator ends.
      expect(eff && eff.type).toBe('PUT');

      // Advance until done, ensuring no downgrade occurs
      while (true) {
        const step = g.next();
        if (step.done) break;
        expect(step.value).not.toEqual(put(setAuth(AuthState.Unauthenticated)));
      }
    });

    it('401 + Not WithProfile → Downgrades To Unauthenticated; Finally Runs', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const response = { status: 401, ok: false, data: null };
      // The next yield is select(...). Skip strict equality; just advance.
      g.next(response as any);

      // Select returns: Unauthenticated
      const curAuth = AuthState.Unauthenticated;
      expect(g.next(curAuth).value).toEqual(put(setUser(null)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.Unauthenticated)));

      expect(g.next().value).toEqual(put(markFetched()));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });

    it('Throws → setError + finally', () => {
      const g = handleFetchUser();

      expect(g.next().value).toEqual(put(setLoading(true)));
      expect(g.next().value).toEqual(call(fetchUserApiWrapper));

      const err = new Error('boom');
      expect(g.throw(err).value).toEqual(put(setError('boom')));
      expect(g.next().value).toEqual(put(markFetched()));
      expect(g.next().value).toEqual(put(setLoading(false)));
      expect(g.next().done).toBe(true);
    });
  });

  describe('HandleCreateUser', () => {
    it('201/200 → setUser(optimistic) + setAuth(WithProfile) + createUserSuccess + fetchUser()', () => {
      const action: PayloadAction<User> = { type: createUser.type, payload: mockUser };
      const g = handleCreateUser(action);

      // Call create
      expect(g.next().value).toEqual(call(createUserApiWrapper, mockUser));

      // Success
      const response = { status: 201, ok: true, data: mockUser };
      expect(g.next(response as any).value).toEqual(put(setUser(mockUser)));
      expect(g.next().value).toEqual(put(setAuth(AuthState.AuthenticatedWithProfile)));
      expect(g.next().value).toEqual(put(createUserSuccess(mockUser)));
      expect(g.next().value).toEqual(put(fetchUser()));
      expect(g.next().done).toBe(true);
    });

    it('Non-2xx → createUserFailure', () => {
      const action: PayloadAction<User> = { type: createUser.type, payload: mockUser };
      const g = handleCreateUser(action);

      expect(g.next().value).toEqual(call(createUserApiWrapper, mockUser));
      const response = { status: 500, ok: false, data: null };
      expect(g.next(response as any).value).toEqual(
        put(createUserFailure('create user failed: 500')),
      );
      expect(g.next().done).toBe(true);
    });

    it('Throws → createUserFailure(error.message)', () => {
      const action: PayloadAction<User> = { type: createUser.type, payload: mockUser };
      const g = handleCreateUser(action);

      expect(g.next().value).toEqual(call(createUserApiWrapper, mockUser));
      const err = new Error('x');
      expect(g.throw(err).value).toEqual(put(createUserFailure('x')));
      expect(g.next().done).toBe(true);
    });
  });

  describe('HandleUpdateUser', () => {
    it('200/204 → updateUserSuccess', () => {
      const updated: User = { ...mockUser, major: 'Math' };
      const action: PayloadAction<User> = { type: updateUser.type, payload: updated };
      const g = handleUpdateUser(action);

      expect(g.next().value).toEqual(call(updateUserApiWrapper, updated));
      const response = { status: 204, ok: true, data: null };
      expect(g.next(response as any).value).toEqual(put(updateUserSuccess(updated)));
      expect(g.next().done).toBe(true);
    });

    it('Non-2xx → updateUserFailure', () => {
      const action: PayloadAction<User> = { type: updateUser.type, payload: mockUser };
      const g = handleUpdateUser(action);

      expect(g.next().value).toEqual(call(updateUserApiWrapper, mockUser));
      const response = { status: 500, ok: false, data: null };
      expect(g.next(response as any).value).toEqual(
        put(updateUserFailure('update user failed: 500')),
      );
      expect(g.next().done).toBe(true);
    });

    it('Throws → updateUserFailure(error.message)', () => {
      const action: PayloadAction<User> = { type: updateUser.type, payload: mockUser };
      const g = handleUpdateUser(action);

      expect(g.next().value).toEqual(call(updateUserApiWrapper, mockUser));
      const err = new Error('bad');
      expect(g.throw(err).value).toEqual(put(updateUserFailure('bad')));
      expect(g.next().done).toBe(true);
    });
  });

  describe('Watcher', () => {
    it('TakeLatest for fetchUser/createUser/updateUser', () => {
      const g = userSaga();
      expect(g.next().value).toEqual(takeLatest(fetchUser.type, handleFetchUser));
      expect(g.next().value).toEqual(takeLatest(createUser.type, handleCreateUser));
      expect(g.next().value).toEqual(takeLatest(updateUser.type, handleUpdateUser));
      expect(g.next().done).toBe(true);
    });
  });
});
