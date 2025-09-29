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
import type { User } from '@/types/User.types';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * API wrapper for fetching current user with proper error handling
 * Now uses App Router endpoint instead of direct backend call
 */
export async function fetchUserApiWrapper() {
  try {
    // Call the App Router endpoint instead of direct backend API
    const response = await fetch('/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = response.ok ? await response.json() : null;

    return {
      status: response.status,
      data: data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);

    return {
      status: 500,
      data: null,
      ok: false,
    };
  }
}

/**
 * API wrapper for creating user with proper error handling
 * Now uses App Router endpoint instead of direct backend call
 */
export async function createUserApiWrapper(newUser: User) {
  try {
    // Call the App Router endpoint instead of direct backend API
    const response = await fetch('/api/user/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
      cache: 'no-store',
    });

    const data = response.ok ? await response.json() : null;

    return {
      status: response.status,
      data: data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Failed to create user:', error);

    return {
      status: 500,
      data: null,
      ok: false,
    };
  }
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
    } else {
      yield put(setError(`Failed to fetch user: ${res.status}`));
    }
  } catch (error: any) {
    console.error('Error in handleFetchUser:', error);
    yield put(setError(error.message || 'Unknown error occurred'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleCreateUser(action: PayloadAction<User>): Generator<unknown, void, any> {
  try {
    const res = yield call(createUserApiWrapper, action.payload);
    if (res.status === 201 || res.status === 200) {
      yield put(createUserSuccess(res.data));
    } else {
      yield put(createUserFailure(`Failed to create user: ${res.status}`));
    }
  } catch (error: any) {
    console.error('Error in handleCreateUser:', error);
    yield put(createUserFailure(error.message || 'Unknown error occurred'));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUser.type, handleFetchUser);
  yield takeLatest(createUser.type, handleCreateUser);
}
