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
import { createUserAction } from '@/actions/user';

// ---- Types ----
interface ApiWrapperResponse {
  status: number;
  data: User | Record<string, unknown> | null | undefined;
  ok: boolean;
}

interface ServerActionResult<T> {
  success: boolean;
  status?: number;
  data?: T | null;
}

// ---- Type guards ----
const hasProfile = (d: unknown): boolean =>
  Boolean(d && typeof d === 'object' && Object.keys(d as Record<string, unknown>).length > 0);

function isServerActionResult<T>(v: unknown): v is ServerActionResult<T> {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return typeof o.success === 'boolean' && ('status' in o || 'data' in o || true);
}

// ---- API wrappers ----
export async function fetchUserApiWrapper(): Promise<ApiWrapperResponse> {
  try {
    const response = await fetch('/api/user/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });

    let parsed: unknown = null;
    try {
      parsed = await response.json();
    } catch {
      parsed = null;
    }

    return { status: response.status, data: parsed as ApiWrapperResponse['data'], ok: response.ok };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return { status: 500, data: null, ok: false };
  }
}

export async function createUserApiWrapper(newUser: User): Promise<ApiWrapperResponse> {
  try {
    const formData = new FormData();
    if (newUser.Email) formData.append('Email', newUser.Email);
    if (newUser.Gender) formData.append('Gender', newUser.Gender);
    if (newUser.city) formData.append('City', newUser.city);
    if (newUser.nationality) formData.append('Nationality', newUser.nationality);
    if (newUser.preferredLanguage) formData.append('Languages', newUser.preferredLanguage);
    if (newUser.Avatar) formData.append('Avatar', newUser.Avatar);
    if (newUser.university) formData.append('University', newUser.university);
    if (newUser.major) formData.append('Major', newUser.major);
    if (newUser.userId) formData.append('Username', newUser.userId);

    const raw = await createUserAction(formData);
    const result: ServerActionResult<User> = isServerActionResult<User>(raw)
      ? raw
      : { success: false, status: 500, data: null };

    return {
      status: result.status ?? (result.success ? 200 : 500),
      data: (result.data ?? null) as ApiWrapperResponse['data'],
      ok: result.success,
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    return { status: 500, data: null, ok: false };
  }
}

export async function updateUserApiWrapper(updatedUser: User): Promise<ApiWrapperResponse> {
  try {
    const response = await fetch('/api/user/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedUser),
      cache: 'no-store',
    });

    let parsed: unknown = null;
    try {
      parsed = await response.json();
    } catch {
      parsed = null;
    }

    return { status: response.status, data: parsed as ApiWrapperResponse['data'], ok: response.ok };
  } catch (error) {
    console.error('Failed to update user:', error);
    return { status: 500, data: null, ok: false };
  }
}

// ---- Workers ----
export function* handleFetchUser(): SagaIterator {
  try {
    yield put(setLoading(true));
    const res: ApiWrapperResponse = yield call(fetchUserApiWrapper);

    if (res.status === 200) {
      if (hasProfile(res.data)) {
        yield put(setUser(res.data as User));
        yield put(setAuth(AuthState.AuthenticatedWithProfile));
      } else {
        yield put(setUser(null));
        yield put(setAuth(AuthState.AuthenticatedButNoProfile));
      }
      return;
    }

    if (res.status === 204 || res.status === 404) {
      yield put(setUser(null));
      yield put(setAuth(AuthState.AuthenticatedButNoProfile));
      return;
    }

    if (res.status === 401) {
      yield put(setUser(null));
      yield put(setAuth(AuthState.Unauthenticated));
      return;
    }

    yield put(setError(`fetch user failed: ${res.status}`));
    yield put(setAuth(AuthState.Unauthenticated));
  } catch (error: unknown) {
    const msg: string = error instanceof Error ? error.message : 'Unknown error';
    yield put(setError(msg));
    yield put(setAuth(AuthState.Unauthenticated));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleCreateUser(action: PayloadAction<User>): SagaIterator {
  try {
    const res: ApiWrapperResponse = yield call(createUserApiWrapper, action.payload);
    if (res.status === 201 || res.status === 200) {
      yield put(createUserSuccess((res.data as User) ?? action.payload));
      yield put(setAuth(AuthState.AuthenticatedWithProfile));
    } else {
      yield put(createUserFailure(`create user failed: ${res.status}`));
    }
  } catch (error: unknown) {
    const msg: string = error instanceof Error ? error.message : 'Unknown error';
    yield put(createUserFailure(msg));
  }
}

export function* handleUpdateUser(action: PayloadAction<User>): SagaIterator {
  try {
    const res: ApiWrapperResponse = yield call(updateUserApiWrapper, action.payload);
    if (res.status === 200 || res.status === 204) {
      yield put(updateUserSuccess((res.data as User) ?? action.payload));
    } else {
      yield put(updateUserFailure(`update user failed: ${res.status}`));
    }
  } catch (error: unknown) {
    const msg: string = error instanceof Error ? error.message : 'Unknown error';
    yield put(updateUserFailure(msg));
  }
}

// ---- Root ----
export default function* userSaga(): SagaIterator {
  yield takeLatest(fetchUser.type, handleFetchUser);
  yield takeLatest(createUser.type, handleCreateUser);
  yield takeLatest(updateUser.type, handleUpdateUser);
}
