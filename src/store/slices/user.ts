import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';

export interface UserState {
  isLoading: boolean;
  userData: User | null | undefined;
  error?: string;
}

export type auth0Token = string;

const initialState: UserState = {
  isLoading: false,
  userData: undefined,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.userData = action.payload;
      state.error = '';
    },
    logOut: (state) => {
      state.userData = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    fetchUser: (_state, _action: PayloadAction<auth0Token>) => {},
  },
});

export const { setUser, logOut, setLoading, fetchUser, setError } = userSlice.actions;
export default userSlice.reducer;
