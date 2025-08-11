import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  UserName: string;
  PreferredName: string;
  Avatar: string;
  LastJoinDate: string;
  UserId: string;
  Email: string;
  Password: string;
  Gender: string;
  Nationality: string;
  City: string;
  University: string;
  Major: string;
  isloading: boolean;
  error: string;
}

const initialState: UserState = {
  UserName: '',
  PreferredName: '',
  Avatar: '',
  LastJoinDate: '',
  UserId: '',
  Email: '',
  Password: '',
  Gender: '',
  Nationality: '',
  City: '',
  University: '',
  Major: '',
  isloading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserRequest(state) {
      state.isloading = true;
      state.error = '';
    },
    fetchUserSuccess(state, action: PayloadAction<Omit<UserState, 'isloading' | 'error'>>) {
      state.isloading = false;
      Object.assign(state, action.payload);
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.isloading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure } = userSlice.actions;
export default userSlice.reducer;
