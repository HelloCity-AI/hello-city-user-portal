import userReducer, {
  setUser,
  logOut,
  setAuth,
  setLoading,
  setError,
  fetchUser,
  createUser,
  createUserSuccess,
  createUserFailure,
  AuthState,
  type UserState,
} from '@/store/slices/user';
import type { User } from '@/types/User.types';
import { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

describe('user slice', () => {
  const initialState: UserState = {
    isLoading: false,
    data: null,
    error: null,
    authStatus: AuthState.Unauthenticated,
    isCreating: false,
    createError: null,
  };

  const mockUser: User = {
    userId: '1',
    Email: 'test@example.com',
    Avatar: 'avatar.jpg',
    Gender: Genders.Male,
    nationality: Nationalities.China,
    city: Cities.Sydney,
    university: 'Test University',
    major: 'Computer Science',
    preferredLanguage: Languages.English,
    lastJoinDate: new Date('2023-01-01'),
  };

  describe('initial state', () => {
    it('Should return the initial state', () => {
      const expectedInitialState = {
        ...initialState,
        isCreating: false,
        createError: null,
      };
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(expectedInitialState);
    });
  });

  describe('setUser', () => {
    it('Should set user data and clear error', () => {
      const previousState: UserState = {
        ...initialState,
        error: 'Previous error',
      };

      const actual = userReducer(previousState, setUser(mockUser));

      expect(actual.data).toEqual(mockUser);
      expect(actual.error).toBeNull();
    });

    it('Should set user to null and clear error', () => {
      const previousState: UserState = {
        ...initialState,
        data: mockUser,
        error: 'Previous error',
      };

      const actual = userReducer(previousState, setUser(null));

      expect(actual.data).toBeNull();
      expect(actual.error).toBeNull();
    });

    it('Should preserve other state properties', () => {
      const previousState: UserState = {
        ...initialState,
        isLoading: true,
        authStatus: AuthState.AuthenticatedWithProfile,
      };

      const actual = userReducer(previousState, setUser(mockUser));

      expect(actual.isLoading).toBe(true);
      expect(actual.authStatus).toBe(AuthState.AuthenticatedWithProfile);
    });
  });

  describe('logOut', () => {
    it('Should reset all state to initial values', () => {
      const previousState: UserState = {
        isLoading: true,
        data: mockUser,
        error: 'Previous error',
        authStatus: AuthState.AuthenticatedWithProfile,
        isCreating: false,
        createError: null,
      };

      const actual = userReducer(previousState, logOut());

      expect(actual).toEqual(initialState);
    });

    it('Should reset creation flags to avoid stale UI state', () => {
      const previousState: UserState = {
        isLoading: true,
        data: mockUser,
        error: 'Previous error',
        authStatus: AuthState.AuthenticatedWithProfile,
        isCreating: true,
        createError: 'Creation failed',
      };

      const actual = userReducer(previousState, logOut());

      expect(actual).toEqual(initialState);
      expect(actual.isCreating).toBe(false);
      expect(actual.createError).toBeNull();
    });

    it('Should work when state is already initial', () => {
      const actual = userReducer(initialState, logOut());

      expect(actual).toEqual(initialState);
    });
  });

  describe('setAuth', () => {
    it('Should set auth status to Unauthenticated', () => {
      const previousState: UserState = {
        ...initialState,
        authStatus: AuthState.AuthenticatedWithProfile,
      };

      const actual = userReducer(previousState, setAuth(AuthState.Unauthenticated));

      expect(actual.authStatus).toBe(AuthState.Unauthenticated);
    });

    it('Should set auth status to AuthenticatedButNoProfile', () => {
      const actual = userReducer(initialState, setAuth(AuthState.AuthenticatedButNoProfile));

      expect(actual.authStatus).toBe(AuthState.AuthenticatedButNoProfile);
    });

    it('Should set auth status to AuthenticatedWithProfile', () => {
      const actual = userReducer(initialState, setAuth(AuthState.AuthenticatedWithProfile));

      expect(actual.authStatus).toBe(AuthState.AuthenticatedWithProfile);
    });

    it('Should preserve other state properties', () => {
      const previousState: UserState = {
        ...initialState,
        data: mockUser,
        error: 'Some error',
        isLoading: true,
      };

      const actual = userReducer(previousState, setAuth(AuthState.AuthenticatedWithProfile));

      expect(actual.data).toEqual(mockUser);
      expect(actual.error).toBe('Some error');
      expect(actual.isLoading).toBe(true);
    });
  });

  describe('setLoading', () => {
    it('Should set loading to true and clear error', () => {
      const previousState: UserState = {
        ...initialState,
        error: 'Previous error',
      };

      const actual = userReducer(previousState, setLoading(true));

      expect(actual.isLoading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('Should set loading to false and preserve error', () => {
      const previousState: UserState = {
        ...initialState,
        isLoading: true,
        error: 'Previous error',
      };

      const actual = userReducer(previousState, setLoading(false));

      expect(actual.isLoading).toBe(false);
      expect(actual.error).toBe('Previous error');
    });

    it('Should preserve other state properties', () => {
      const previousState: UserState = {
        ...initialState,
        data: mockUser,
        authStatus: AuthState.AuthenticatedWithProfile,
      };

      const actual = userReducer(previousState, setLoading(true));

      expect(actual.data).toEqual(mockUser);
      expect(actual.authStatus).toBe(AuthState.AuthenticatedWithProfile);
    });
  });

  describe('setError', () => {
    it('Should set error message and stop loading', () => {
      const previousState: UserState = {
        ...initialState,
        isLoading: true,
      };

      const errorMessage = 'Network error';
      const actual = userReducer(previousState, setError(errorMessage));

      expect(actual.error).toBe(errorMessage);
      expect(actual.isLoading).toBe(false);
    });

    it('Should set error to null and stop loading', () => {
      const previousState: UserState = {
        ...initialState,
        isLoading: true,
        error: 'Previous error',
      };

      const actual = userReducer(previousState, setError(null));

      expect(actual.error).toBeNull();
      expect(actual.isLoading).toBe(false);
    });

    it('Should preserve other state properties', () => {
      const previousState: UserState = {
        ...initialState,
        data: mockUser,
        authStatus: AuthState.AuthenticatedWithProfile,
      };

      const actual = userReducer(previousState, setError('Some error'));

      expect(actual.data).toEqual(mockUser);
      expect(actual.authStatus).toBe(AuthState.AuthenticatedWithProfile);
    });
  });

  describe('fetchUser', () => {
    it('Should be a no-op action creator', () => {
      const actual = userReducer(initialState, fetchUser());

      expect(actual).toEqual(initialState);
    });

    it('Should preserve state when other properties are set', () => {
      const previousState: UserState = {
        isLoading: true,
        data: mockUser,
        error: 'Previous error',
        authStatus: AuthState.AuthenticatedWithProfile,
        isCreating: false,
        createError: null,
      };

      const actual = userReducer(previousState, fetchUser());

      expect(actual).toEqual(previousState);
    });
  });
});
