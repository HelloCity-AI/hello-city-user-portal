import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';

interface UserState {
  isLoading: boolean;
  userData: User | null;
  error?: string;
}

const initialState: UserState = {
  isLoading: false,
  userData: null,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    logOut: (state) => {
      state.userData = null;
    },
    fetchUserRequest(state) {
      state.isLoading = true;
      state.error = '';
    },
    fetchUserSuccess(state, action: PayloadAction<Omit<UserState, 'isLoading' | 'error'>>) {
      state.isLoading = false;
      Object.assign(state, action.payload);
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure, setUser, logOut } =
  userSlice.actions;
export default userSlice.reducer;
