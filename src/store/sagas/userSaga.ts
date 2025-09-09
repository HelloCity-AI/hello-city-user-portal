import { call, put, takeLatest } from 'redux-saga/effects';
import { setUser, setLoading, fetchUser, setError } from '../slices/user';
import axios, { type AxiosResponse } from 'axios';
import type { Auth0Token } from '../slices/user';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/User.types';

export async function fetchUserApi(token: Auth0Token) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await axios.get(`${apiUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
    },
    timeout: 10000,
    validateStatus: (status) => status === 200 || status === 404,
  });

  return res;
}

export function* handleFetchUser(
  action: PayloadAction<Auth0Token>,
): Generator<unknown, void, AxiosResponse<User | null>> {
  try {
    const accessToken = action.payload;
    yield put(setLoading(true));
    const res = yield call(fetchUserApi, accessToken);
    if (res.status === 200) {
      yield put(setUser(res.data));
      return;
    }
    if (res.status === 404) {
      yield put(setUser(null));
      return;
    }
    throw new Error(`Unexpected status ${res.status}`);
  } catch (error) {
    console.error(error);
    yield put(setError((error as Error).message));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUser.type, handleFetchUser);
}
