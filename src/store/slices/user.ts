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
  isCreating: boolean;
  createError: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

const initialState: UserState = {
  isLoading: false,
  data: null,
  error: null,
  authStatus: AuthState.Unauthenticated,
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
    },
    logOut: (state) => {
      state.data = null;
      state.error = null;
      state.authStatus = AuthState.Unauthenticated;
      state.isLoading = false;
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
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    fetchUser: () => {},
    createUser: (state, action: PayloadAction<User>) => {
      state.isCreating = true;
      state.createError = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isCreating = false;
      state.createError = null;
      state.authStatus = AuthState.AuthenticatedWithProfile;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isCreating = false;
      state.createError = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.isUpdating = true;
      state.updateError = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isUpdating = false;
      state.updateError = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.updateError = action.payload;
    },
  },
});

export const {
  setUser,
  logOut,
  setLoading,
  fetchUser,
  setError,
  setAuth,
  createUser,
  createUserSuccess,
  createUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
