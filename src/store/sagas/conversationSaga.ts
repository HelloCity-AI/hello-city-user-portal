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
  fetchConversationMessages,
  deleteConversation,
  updateConversation,
  type Conversation,
  type MessageDto,
  cacheConversationMessages,
} from '../slices/conversation';
import { fetchWithErrorHandling } from '@/utils/fetchHelpers';
import { type RootState } from '..';

interface ApiResponse<T> {
  status: number;
  data: T | null;
  ok: boolean;
}

type ConversationsResponse = ApiResponse<Conversation[]>;
type ConversationResponse = ApiResponse<MessageDto[]>;
type UpdateResponse = ApiResponse<Conversation>;
type DeleteResponse = ApiResponse<null>;

export async function fetchConversationsApiWrapper(): Promise<ConversationsResponse> {
  return fetchWithErrorHandling<Conversation[]>('/api/conversation/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchMessagesApiWrapper(
  conversationId: string,
): Promise<ConversationResponse> {
  return fetchWithErrorHandling<MessageDto[]>(`/api/conversation/${conversationId}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateConversationApiWrapper(
  conversationId: string,
  title: string,
): Promise<UpdateResponse> {
  return fetchWithErrorHandling<Conversation>(`/api/conversation/${conversationId}`, {
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

    if (res.ok && res.data) {
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

export function* handleFetchConversationMessages(action: PayloadAction<string>): SagaIterator {
  const conversationId = action.payload;
  try {
    // Step 1: Ensure conversation list is loaded first
    const hasFetched: boolean = yield select(
      (state: RootState) => state.conversation.hasFetched,
    );

    if (!hasFetched) {
      // Load conversation list first, then continue
      yield call(handleFetchConversations);
    }

    // Step 2: Check cache
    const state: RootState = yield select();
    const cached = state.conversation.messagesByConversation[conversationId];
    const timestamp = state.conversation.cacheTimestamps[conversationId];

    if (cached && timestamp && Date.now() - timestamp < 5 * 60 * 1000) {
      // Cache is valid, skip API call
      return;
    }

    // Step 3: Call API
    yield put(setConversationLoading({ conversationId, isLoading: true }));

    const res: ConversationResponse = yield call(fetchMessagesApiWrapper, conversationId);

    // Step 4: Handle 404 - silent redirect without error
    if (res.status === 404) {
      // Conversation not found, redirect to new conversation page
      if (typeof window !== 'undefined') {
        window.location.assign('/assistant');
      }
      return;
    }

    // Step 5: Handle other errors
    if (!res.ok) {
      let errorMessage = 'Failed to load conversation messages.';
      if (res.status === 400) {
        errorMessage = 'Invalid conversation request.';
      }
      if (res.status === 403) {
        errorMessage = 'You do not have permission to access this conversation.';
      }
      if (res.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      yield put(setError(errorMessage));
      return;
    }

    // Step 6: Cache messages
    if (res.data) {
      yield put(
        cacheConversationMessages({
          conversationId,
          messages: res.data,
        }),
      );

      // Step 7: If conversation is not in the list, refresh the list
      const conversations = state.conversation.conversations;
      const exists = conversations.some((c) => c.conversationId === conversationId);

      if (!exists) {
        // Newly created conversation, refresh list to include it
        yield call(handleFetchConversations);
      }
    }
  } catch (error: unknown) {
    console.error('Error in handleFetchConversationMessage:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setConversationLoading({ conversationId, isLoading: false }));
  }
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

    if (!res.ok) {
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

  // Get current conversation ID from URL (accounting for language prefix)
  const currentConversationId =
    typeof window !== 'undefined'
      ? (() => {
          const parts = window.location.pathname.split('/').filter(Boolean);
          // URL format: /[lang]/assistant/[conversationId]
          // parts = ['en', 'assistant', '123'] or ['zh', 'assistant', '123']
          return parts.length >= 3 && parts[1] === 'assistant' ? parts[2] : null;
        })()
      : null;

  try {
    const res: DeleteResponse = yield call(deleteConversationApiWrapper, conversationId);

    if (res.ok) {
      yield put(removeConversation(conversationId));

      // If deleted conversation is currently open, redirect to new conversation page
      if (currentConversationId === conversationId && typeof window !== 'undefined') {
        const language = window.location.pathname.split('/')[1] || 'en';
        window.location.assign(`/${language}/assistant`);
      }
    } else {
      yield put(setError(`Failed to delete conversation: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleDeleteConversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  }
}

export default function* conversationSaga() {
  yield takeLatest(fetchAllConversations.type, handleFetchConversations);
  yield takeLatest(fetchConversationMessages.type, handleFetchConversationMessages);
  yield takeLatest(updateConversation.type, handleUpdateConversation);
  yield takeLatest(deleteConversation.type, handleDeleteConversation);
}
