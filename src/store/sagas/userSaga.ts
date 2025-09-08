import { call, put, takeLatest } from 'redux-saga/effects';
import { setUser, setLoading, fetchUser, setError } from '../slices/user';
import axios from 'axios';
import type { auth0Token } from '../slices/user';
import type { PayloadAction } from '@reduxjs/toolkit';

export async function fetchUserApi(token: auth0Token) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await axios.get(`${apiUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      cache: 'no-store',
    },
    validateStatus: (status) => status < 400 || status === 404,
  });

  return res;
}

export function* handleFetchUser(action: PayloadAction<auth0Token>): Generator {
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
