import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  setConversations,
  setLoading,
  setError,
  addOrUpdateConversation,
  removeConversation,
  fetchAllConversations,
  fetchConversation,
  deleteConversation,
  updateConversation,
  type Conversation,
} from '../slices/conversation';
import { fetchWithErrorHandling } from '@/utils/fetchHelpers';

interface ApiResponse<T> {
  status: number;
  data: T | null;
  ok: boolean;
}

type ConversationsResponse = ApiResponse<Conversation[]>;
type ConversationResponse = ApiResponse<Conversation>;
type DeleteResponse = ApiResponse<null>;

export async function fetchConversationsApiWrapper(): Promise<ConversationsResponse> {
  return fetchWithErrorHandling<Conversation[]>('/api/conversations/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchConversationApiWrapper(
  conversationId: string,
): Promise<ConversationResponse> {
  return fetchWithErrorHandling<Conversation>(`/api/conversations/${conversationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateConversationApiWrapper(
  conversationId: string,
  title: string,
): Promise<ConversationResponse> {
  return fetchWithErrorHandling<Conversation>(`/api/conversations/${conversationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
}

export async function deleteConversationApiWrapper(
  conversationId: string,
): Promise<DeleteResponse> {
  return fetchWithErrorHandling<null>(`/api/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* handleFetchConversations(): SagaIterator {
  try {
    yield put(setLoading(true));
    const res: ConversationsResponse = yield call(fetchConversationsApiWrapper);

    if (res.data) {
      yield put(setConversations(res.data));
    } else {
      yield put(setError(`Failed to fetch conversations: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleFetchConversations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleFetchConversation(action: PayloadAction<string>): SagaIterator {
  try {
    yield put(setLoading(true));
    const conversationId = action.payload;
    const res: ConversationResponse = yield call(fetchConversationApiWrapper, conversationId);

    if (res.data) {
      yield put(addOrUpdateConversation(res.data));
    } else {
      yield put(setError(`Failed to fetch conversation: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleFetchConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleUpdateConversation(
  action: PayloadAction<{ id: string; title: string }>,
): SagaIterator {
  try {
    yield put(setLoading(true));
    const { id, title } = action.payload;
    const res: ConversationResponse = yield call(updateConversationApiWrapper, id, title);

    if (res.data) {
      yield put(addOrUpdateConversation(res.data));
    } else {
      yield put(setError(`Failed to update conversation: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleUpdateConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export function* handleDeleteConversation(action: PayloadAction<string>): SagaIterator {
  try {
    yield put(setLoading(true));
    const conversationId = action.payload;
    const res: DeleteResponse = yield call(deleteConversationApiWrapper, conversationId);

    if (res.ok) {
      yield put(removeConversation(conversationId));
    } else {
      yield put(setError(`Failed to delete conversation: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleDeleteConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* conversationSaga() {
  yield takeLatest(fetchAllConversations.type, handleFetchConversations);
  yield takeLatest(fetchConversation.type, handleFetchConversation);
  yield takeLatest(updateConversation.type, handleUpdateConversation);
  yield takeLatest(deleteConversation.type, handleDeleteConversation);
}
