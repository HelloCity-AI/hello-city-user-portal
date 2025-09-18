import { call, put, takeLatest } from 'redux-saga/effects';
import {
  setUser,
  setLoading,
  fetchUser,
  setError,
  setAuth,
  AuthState,
  createUser,
  createUserSuccess,
  createUserFailure,
} from '../slices/user';
import { fetchCurrentUser, createUser as createUserApi } from '@/api/userApi';
import type { User } from '@/types/User.types';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * API wrapper for fetching current user with proper error handling
 */
export async function fetchUserApiWrapper() {
  const response = await fetchCurrentUser();

  // Convert Response to axios-like format for backward compatibility
  const data = response.ok ? await response.json() : null;
  return {
    status: response.status,
    data,
    ok: response.ok,
  };
}

/**
 * API wrapper for creating user with proper error handling
 */
export async function createUserApiWrapper(userData: User) {
  const response = await createUserApi(userData);

  // Convert Response to axios-like format for backward compatibility
  const data = response.ok ? await response.json() : null;
  return {
    status: response.status,
    data,
    ok: response.ok,
  };
}

export function* handleFetchUser(): Generator<unknown, void, any> {
  try {
    yield put(setLoading(true));
    const res = yield call(fetchUserApiWrapper);

    if (res.status === 401) {
      yield put(setAuth(AuthState.Unauthenticated));
      yield put(setUser(null));
      return;
    }
    if (res.status === 200) {
      yield put(setUser(res.data));
      yield put(setAuth(AuthState.AuthenticatedWithProfile));
      return;
    }
    if (res.status === 404) {
      yield put(setUser(null));
      yield put(setAuth(AuthState.AuthenticatedButNoProfile));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

/**
 * Saga handler for creating a new user
 */
export function* handleCreateUser(action: PayloadAction<User>): Generator<unknown, void, any> {
  try {
    const userData = action.payload;
    const res = yield call(createUserApiWrapper, userData);

    if (res.ok && res.status === 200) {
      yield put(createUserSuccess(res.data));
    } else {
      const errorMessage = res.data?.error || `Failed to create user (Status: ${res.status})`;
      yield put(createUserFailure(errorMessage));
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred while creating user';
    yield put(createUserFailure(errorMessage));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUser.type, handleFetchUser);
  yield takeLatest(createUser.type, handleCreateUser);
}
