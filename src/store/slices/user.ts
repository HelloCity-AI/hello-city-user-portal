import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';

export enum AuthState {
  Unauthenticated = 0,
  AuthenticatedButNoProfile = 1,
  AuthenticatedWithProfile = 2,
}

export interface UserState {
  isLoading: boolean;
  data: User | null;
  error: string | null;
  authStatus: AuthState;
  hasFetched: boolean;
  isCreating: boolean;
  createError: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

export interface CreateUserPayload extends User {
  imageId?: string;
}

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = false;
      state.hasFetched = true;
    },
    logOut: (state) => {
      state.data = null;
      state.error = null;
      state.authStatus = AuthState.Unauthenticated;
      state.isLoading = false;
      state.hasFetched = false;
      state.isCreating = false;
      state.createError = null;
      state.isUpdating = false;
      state.updateError = null;
    },
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.authStatus = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.hasFetched = true;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Mark that a fetch attempt has occurred (used by saga finally blocks)
    markFetched: (state) => {
      state.hasFetched = true;
      state.isLoading = false;
    },

    // Reset hasFetched flag without touching other fields
    resetFetched: (state) => {
      state.hasFetched = false;
    },

    fetchUser: () => {},

    // Use prepare to serialize the payload and avoid Redux warnings for Date/File
    createUser: {
      reducer: (state, _action: PayloadAction<CreateUserPayload>) => {
        state.isCreating = true;
        state.createError = null;
      },
      prepare: (payload: CreateUserPayload) => {
        const v = payload.lastJoinDate;
        const lastJoinDateStr =
          typeof v === 'string' ? v : v instanceof Date ? v.toISOString() : '';
        return {
          payload: {
            ...payload,
            lastJoinDate: lastJoinDateStr,
          },
        };
      },
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isCreating = false;
      state.createError = null;
      state.authStatus = AuthState.AuthenticatedWithProfile;
      state.hasFetched = true;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isCreating = false;
      state.createError = action.payload;
      state.hasFetched = true;
    },

    updateUser: {
      reducer: (state, _action: PayloadAction<User>) => {
        state.isUpdating = true;
        state.updateError = null;
      },
      prepare: (payload: User) => {
        const v = payload.lastJoinDate;
        const lastJoinDateStr =
          typeof v === 'string' ? v : v instanceof Date ? v.toISOString() : '';
        const prepared: any = {
          ...payload,
          lastJoinDate: lastJoinDateStr,
        };
        delete prepared.avatarFile;
        return { payload: prepared };
      },
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.data = {
        ...(state.data ?? ({} as User)),
        ...action.payload,
      };
      state.isUpdating = false;
      state.updateError = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.updateError = action.payload;
    },
    // Duplicate updateUser* definitions have been replaced by the prepare version above
  },
});

export const {
  setUser,
  logOut,
  setLoading,
  fetchUser,
  setError,
  clearError,
  setAuth,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
  markFetched,
  resetFetched,
} = userSlice.actions;

export default userSlice.reducer;
