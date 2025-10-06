import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
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
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} from '../slices/user';
import type { User } from '@/types/User.types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createUserAction, updateUserAction } from '@/actions/user';

// API response type that matches the actual return type of API wrapper functions
interface ApiWrapperResponse {
  status: number;
  data: User | null | undefined;
  ok: boolean;
}

// Union type for all possible Redux actions in user saga
type UserAction =
  | ReturnType<typeof setUser>
  | ReturnType<typeof setLoading>
  | ReturnType<typeof setError>
  | ReturnType<typeof setAuth>
  | ReturnType<typeof createUserSuccess>
  | ReturnType<typeof createUserFailure>
  | ReturnType<typeof updateUserSuccess>
  | ReturnType<typeof updateUserFailure>;

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
 * Now uses Server Action instead of route handler
 */
export async function createUserApiWrapper(newUser: User) {
  try {
    // Convert User object to FormData for Server Action
    const formData = new FormData();

    // Add user fields to FormData
    if (newUser.email) formData.append('Email', newUser.email);
    if (newUser.gender) formData.append('Gender', newUser.gender);
    if (newUser.city) formData.append('City', newUser.city);
    if (newUser.nationality) formData.append('Nationality', newUser.nationality);
    if (newUser.preferredLanguage) formData.append('PreferredLanguage', newUser.preferredLanguage);
    if (newUser.avatar) formData.append('Avatar', newUser.avatar);
    if (newUser.university) formData.append('University', newUser.university);
    if (newUser.major) formData.append('Major', newUser.major);
    // Ensure backend-required Username: prefer newUser.username then fallback to userId
    const username = newUser.username ?? newUser.userId;
    if (username) formData.append('Username', username);

    // Call the Server Action
    const result = await createUserAction(formData);

    return {
      status: result.status || (result.success ? 200 : 500),
      data: result.data,
      ok: result.success,
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

/**
 * API wrapper for updating user with proper error handling
 * Uses PUT endpoint for programmatic updates
 */
export async function updateUserApiWrapper(updatedUser: User) {
  try {
    // Call the PUT endpoint for programmatic updates
    const response = await fetch('/api/user/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
      cache: 'no-store',
    });

    const data = response.ok ? await response.json() : null;

    return {
      status: response.status,
      data: data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Failed to update user:', error);

    return {
      status: 500,
      data: null,
      ok: false,
    };
  }
}

export function* handleFetchUser(): SagaIterator {
  try {
    yield put(setLoading(true));
    const res: ApiWrapperResponse = yield call(fetchUserApiWrapper);

    if (res.status === 401) {
      yield put(setAuth(AuthState.Unauthenticated));
      yield put(setUser(null));
      return;
    }
    if (res.status === 200) {
      yield put(setUser(res.data as User));
      yield put(setAuth(AuthState.AuthenticatedWithProfile));
    } else {
      yield put(setError(`Failed to fetch user: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleFetchUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleCreateUser(action: PayloadAction<User>): SagaIterator {
  try {
    const res: ApiWrapperResponse = yield call(createUserApiWrapper, action.payload);
    if (res.status === 201 || res.status === 200) {
      yield put(createUserSuccess(res.data as User));
    } else {
      yield put(createUserFailure(`Failed to create user: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleCreateUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(createUserFailure(errorMessage));
  }
}

export function* handleUpdateUser(action: PayloadAction<User>): SagaIterator {
  try {
    const res: ApiWrapperResponse = yield call(updateUserApiWrapper, action.payload);
    if (res.status === 200) {
      yield put(updateUserSuccess(res.data as User));
    } else {
      yield put(updateUserFailure(`Failed to update user: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleUpdateUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(updateUserFailure(errorMessage));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUser.type, handleFetchUser);
  yield takeLatest(createUser.type, handleCreateUser);
  yield takeLatest(updateUser.type, handleUpdateUser);
}
