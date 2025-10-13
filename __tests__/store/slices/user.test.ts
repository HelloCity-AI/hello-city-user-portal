// __tests__/userSlice.new.test.ts
import userReducer, {
  setUser,
  logOut,
  setAuth,
  setLoading,
  setError,
  clearError,
  fetchUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  markFetched,
  resetFetched,
  AuthState,
  type UserState,
} from '@/store/slices/user';

import type { User } from '@/types/User.types';
import { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

describe('User slice (NEW)', () => {
  const initialState: UserState = {
    isLoading: false,
    data: null,
    error: null,
    authStatus: AuthState.Unauthenticated,
    hasFetched: false,
    isCreating: false,
    createError: null,
    isUpdating: false,
    updateError: null,
  };

  const mockUser: User = {
    userId: '1',
    email: 'test@example.com',
    avatar: 'avatar.jpg',
    gender: Genders.Male,
    nationality: Nationalities.China,
    city: Cities.Sydney,
    university: 'Test University',
    major: 'Computer Science',
    preferredLanguage: Languages.English,
    lastJoinDate: new Date('2023-01-01'),
  };

  // ---------- initial ----------
  it('Returns initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // ---------- setUser ----------
  describe('SetUser', () => {
    it('Sets user, clears error, marks fetched and stops loading', () => {
      const prev: UserState = { ...initialState, isLoading: true, error: 'oops' };
      const next = userReducer(prev, setUser(mockUser));
      expect(next.data).toEqual(mockUser);
      expect(next.error).toBeNull();
      expect(next.isLoading).toBe(false);
      expect(next.hasFetched).toBe(true);
    });

    it('Handles null user and still marks fetched', () => {
      const prev: UserState = { ...initialState, isLoading: true, error: 'oops' };
      const next = userReducer(prev, setUser(null));
      expect(next.data).toBeNull();
      expect(next.error).toBeNull();
      expect(next.isLoading).toBe(false);
      expect(next.hasFetched).toBe(true);
    });

    it('Preserves unrelated flags', () => {
      const prev: UserState = { ...initialState, isUpdating: true, updateError: 'X' };
      const next = userReducer(prev, setUser(mockUser));
      expect(next.isUpdating).toBe(true);
      expect(next.updateError).toBe('X');
    });
  });

  // ---------- logOut ----------
  describe('LogOut', () => {
    it('Resets to initialState (including hasFetched=false)', () => {
      const prev: UserState = {
        isLoading: true,
        data: mockUser,
        error: 'Previous error',
        authStatus: AuthState.AuthenticatedWithProfile,
        hasFetched: true,
        isCreating: true,
        createError: 'err',
        isUpdating: true,
        updateError: 'uerr',
      };
      expect(userReducer(prev, logOut())).toEqual(initialState);
    });
  });

  // ---------- setAuth ----------
  describe('SetAuth', () => {
    it('Sets Unauthenticated', () => {
      const next = userReducer(initialState, setAuth(AuthState.Unauthenticated));
      expect(next.authStatus).toBe(AuthState.Unauthenticated);
    });
    it('Sets AuthenticatedButNoProfile', () => {
      const next = userReducer(initialState, setAuth(AuthState.AuthenticatedButNoProfile));
      expect(next.authStatus).toBe(AuthState.AuthenticatedButNoProfile);
    });
    it('Sets AuthenticatedWithProfile', () => {
      const next = userReducer(initialState, setAuth(AuthState.AuthenticatedWithProfile));
      expect(next.authStatus).toBe(AuthState.AuthenticatedWithProfile);
    });
  });

  // ---------- setLoading ----------
  describe('SetLoading', () => {
    it('True → sets loading and clears error; does not touch hasFetched', () => {
      const prev: UserState = { ...initialState, error: 'bad', hasFetched: false };
      const next = userReducer(prev, setLoading(true));
      expect(next.isLoading).toBe(true);
      expect(next.error).toBeNull();
      expect(next.hasFetched).toBe(false);
    });

    it('False → stops loading; keeps error', () => {
      const prev: UserState = { ...initialState, isLoading: true, error: 'kept' };
      const next = userReducer(prev, setLoading(false));
      expect(next.isLoading).toBe(false);
      expect(next.error).toBe('kept');
      expect(next.hasFetched).toBe(false);
    });
  });

  // ---------- setError / clearError ----------
  describe('SetError / ClearError', () => {
    it('SetError sets error, stops loading, marks fetched', () => {
      const prev: UserState = { ...initialState, isLoading: true, hasFetched: false };
      const next = userReducer(prev, setError('Network error'));
      expect(next.error).toBe('Network error');
      expect(next.isLoading).toBe(false);
      expect(next.hasFetched).toBe(true);
    });

    it('ClearError clears error but keeps hasFetched as-is', () => {
      const prev: UserState = { ...initialState, error: 'old', hasFetched: true };
      const next = userReducer(prev, clearError());
      expect(next.error).toBeNull();
      expect(next.hasFetched).toBe(true);
    });
  });

  // ---------- fetchUser (noop) ----------
  it('FetchUser is a no-op reducer-wise', () => {
    const prev: UserState = {
      ...initialState,
      isLoading: true,
      data: mockUser,
      error: 'e',
      hasFetched: true,
    };
    expect(userReducer(prev, fetchUser())).toEqual(prev);
  });

  // ---------- createUser* ----------
  describe('CreateUser*', () => {
    it('CreateUserSuccess populates data, sets WithProfile, marks fetched', () => {
      const next = userReducer(initialState, createUserSuccess(mockUser));
      expect(next.data).toEqual(mockUser);
      expect(next.isCreating).toBe(false);
      expect(next.createError).toBeNull();
      expect(next.authStatus).toBe(AuthState.AuthenticatedWithProfile);
      expect(next.hasFetched).toBe(true);
    });

    it('CreateUserFailure marks fetched and stores error', () => {
      const next = userReducer(initialState, createUserFailure('failed'));
      expect(next.isCreating).toBe(false);
      expect(next.createError).toBe('failed');
      expect(next.hasFetched).toBe(true);
    });
  });

  // ---------- updateUser* ----------
  describe('UpdateUser*', () => {
    it('UpdateUserSuccess writes data and clears updating flags', () => {
      const prev: UserState = { ...initialState, isUpdating: true, updateError: 'x' };
      const next = userReducer(prev, updateUserSuccess({ ...mockUser, major: 'Math' }));
      expect(next.data).toEqual({ ...mockUser, major: 'Math' });
      expect(next.isUpdating).toBe(false);
      expect(next.updateError).toBeNull();
    });

    it('UpdateUserFailure stops updating and stores error', () => {
      const prev: UserState = { ...initialState, isUpdating: true, updateError: null };
      const next = userReducer(prev, updateUserFailure('bad'));
      expect(next.isUpdating).toBe(false);
      expect(next.updateError).toBe('bad');
    });
  });

  // ---------- markFetched / resetFetched ----------
  describe('MarkFetched & ResetFetched', () => {
    it('MarkFetched: sets hasFetched=true and stops loading', () => {
      const prev: UserState = { ...initialState, isLoading: true, hasFetched: false };
      const next = userReducer(prev, markFetched());
      expect(next.hasFetched).toBe(true);
      expect(next.isLoading).toBe(false);
    });

    it('ResetFetched: sets hasFetched=false (does not touch other fields)', () => {
      const prev: UserState = { ...initialState, hasFetched: true, isLoading: true, error: 'e' };
      const next = userReducer(prev, resetFetched());
      expect(next.hasFetched).toBe(false);
      expect(next.isLoading).toBe(true); // unchanged
      expect(next.error).toBe('e'); // unchanged
    });
  });
});
