import { call, put, takeLatest } from 'redux-saga/effects';
import { setUser, setLoading, fetchUser, setError } from '../slices/user';
import axios, { type AxiosResponse } from 'axios';

export async function fetchUserApi() {
  const res = await axios.get(`/api/user/me`, {
    timeout: 10000,
    validateStatus: (status) => status === 200 || status === 404,
  });
  return res;
}

export function* handleFetchUser(): Generator<unknown, void, AxiosResponse> {
  try {
    yield put(setLoading(true));
    const res = yield call(fetchUserApi);
    if (res.status === 200) {
      yield put(setUser(res.data));
      return;
    }
    if (res.status === 404) {
      yield put(setUser(null));
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      yield put(setError(error.response.data.error));
    } else {
      yield put(setError((error as Error).message));
    }
  } finally {
    yield put(setLoading(false));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUser.type, handleFetchUser);
}
