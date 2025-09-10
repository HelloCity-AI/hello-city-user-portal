import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';

export interface UserState {
  isLoading: boolean;
  userData: User | null | undefined;
  error: string | null;
}

const initialState: UserState = {
  isLoading: false,
  userData: undefined,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.userData = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    logOut: (state) => {
      state.userData = undefined;
      state.error = null;
      state.isLoading = false;
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

export const { setUser, logOut, setLoading, fetchUser, setError } = userSlice.actions;
export default userSlice.reducer;
