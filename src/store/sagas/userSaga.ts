import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from '../slices/user';

async function fetchUserApi() {
  const res = await fetch('/api/user/profile');
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
}

function* handleFetchUser(): Generator {
  try {
    const data = yield call(fetchUserApi);
    yield put(fetchUserSuccess(data));
  } catch (error) {
    yield put(fetchUserFailure('Failed to fetch user'));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUserRequest.type, handleFetchUser);
}
