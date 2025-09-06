import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../slices/user';
import { auth0 } from '@/lib/auth0';
import Router from 'next/Router';
import axios from 'axios';

async function fetchUserApi(token: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await axios.get(`${apiUrl}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'no-store',
      },
    });
    return res;
  } catch (error) {
    console.error(error);
  }
}

async function getAuthSession() {
  const user = await auth0.getSession();
  return user;
}

function* handleFetchUser(): Generator {
  const session = yield call(getAuthSession);
  if (session) {
    try {
      const data = yield call(() => fetchUserApi(session.accessToken));
      yield put(fetchUserSuccess(data));
    } catch (error) {
      yield put(fetchUserFailure('Failed to fetch user'));
    }
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUserRequest.type, handleFetchUser);
}
