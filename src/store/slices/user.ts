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
}

const initialState: UserState = {
  isLoading: false,
  data: null,
  error: null,
  authStatus: AuthState.Unauthenticated,
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
  },
});

export const { setUser, logOut, setLoading, fetchUser, setError, setAuth } = userSlice.actions;
export default userSlice.reducer;
