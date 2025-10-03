import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  setConversations,
  setConversationsLoading,
  setConversationLoading,
  setError,
  setConversationTitle,
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

// Backend returns conversation data directly
type ConversationFromBackend = Conversation;

type ConversationsResponse = ApiResponse<ConversationFromBackend[]>;
// type ConversationResponse = ApiResponse<Conversation>;
type UpdateResponse = ApiResponse<ConversationFromBackend>;
type DeleteResponse = ApiResponse<null>;

export async function fetchConversationsApiWrapper(): Promise<ConversationsResponse> {
  return fetchWithErrorHandling<ConversationFromBackend[]>('/api/conversation/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// export async function fetchConversationApiWrapper(
//   conversationId: string,
// ): Promise<ConversationResponse> {
//   return fetchWithErrorHandling<Conversation>(`/api/conversation/${conversationId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
// }

export async function updateConversationApiWrapper(
  conversationId: string,
  title: string,
): Promise<UpdateResponse> {
  return fetchWithErrorHandling<ConversationFromBackend>(`/api/conversation/${conversationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
}

export async function deleteConversationApiWrapper(
  conversationId: string,
): Promise<DeleteResponse> {
  return fetchWithErrorHandling<null>(`/api/conversation/${conversationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function* handleFetchConversations(): SagaIterator {
  try {
    yield put(setConversationsLoading(true));
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
    yield put(setConversationsLoading(false));
  }
}
// TODO: to be updated later
export function* handleFetchConversation(action: PayloadAction<string>): SagaIterator {
  // try {
  //   const conversationId = action.payload;
  //   const res: ConversationResponse = yield call(fetchConversationApiWrapper, conversationId);
  //   if (res.data) {
  //     yield put(addOrUpdateConversation(res.data));
  //   } else {
  //     yield put(setError(`Failed to fetch conversation: ${res.status}`));
  //   }
  // } catch (error: unknown) {
  //   console.error('Error in handleFetchConversation:', error);
  //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  //   yield put(setError(errorMessage));
  // }
}

export function* handleUpdateConversation(
  action: PayloadAction<{ id: string; title: string }>,
): SagaIterator {
  const { id, title } = action.payload;

  // Get current state to save old title for rollback
  const state: { conversation: { conversations: Conversation[] } } = yield select();
  const conversation = state.conversation.conversations.find((c) => c.conversationId === id);
  const oldTitle = conversation?.title;

  try {
    // Optimistic update: immediately update UI
    yield put(setConversationTitle({ conversationId: id, title }));
    yield put(setConversationLoading({ conversationId: id, isLoading: true }));

    const res: UpdateResponse = yield call(updateConversationApiWrapper, id, title);

    if (!res.data) {
      yield put(setError(`Failed to update conversation: ${res.status}`));
      if (oldTitle) {
        yield put(setConversationTitle({ conversationId: id, title: oldTitle }));
      }
    }
  } catch (error: unknown) {
    console.error('Error in handleUpdateConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
    if (oldTitle) {
      yield put(setConversationTitle({ conversationId: id, title: oldTitle }));
    }
  } finally {
    yield put(setConversationLoading({ conversationId: id, isLoading: false }));
  }
}

export function* handleDeleteConversation(action: PayloadAction<string>): SagaIterator {
  const conversationId = action.payload;
  try {
    yield put(setConversationLoading({ conversationId, isLoading: true }));
    const res: DeleteResponse = yield call(deleteConversationApiWrapper, conversationId);

    if (res.ok) {
      yield put(removeConversation(conversationId));
    } else {
      yield put(setError(`Failed to delete conversation: ${res.status}`));
      yield put(setConversationLoading({ conversationId, isLoading: false }));
    }
  } catch (error: unknown) {
    console.error('Error in handleDeleteConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
    yield put(setConversationLoading({ conversationId, isLoading: false }));
  }
}

export default function* conversationSaga() {
  yield takeLatest(fetchAllConversations.type, handleFetchConversations);
  yield takeLatest(fetchConversation.type, handleFetchConversation);
  yield takeLatest(updateConversation.type, handleUpdateConversation);
  yield takeLatest(deleteConversation.type, handleDeleteConversation);
}
