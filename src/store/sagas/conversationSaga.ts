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
import { upsertChecklistMetadata, setActiveChecklist } from '../slices/checklist';
import type {
  ChecklistMetadata,
  ChecklistItem as ChecklistItemModel,
  ChecklistImportance,
  StayType,
  ChecklistStatus,
  CityCode,
} from '@/compoundComponents/ChatPage/ChecklistPanel/types';

interface ApiResponse<T> {
  status: number;
  data: T | null;
  ok: boolean;
}

type ConversationsResponse = ApiResponse<Conversation[]>;
type ConversationResponse = ApiResponse<MessageDto[]>;
type UpdateResponse = ApiResponse<Conversation>;
type DeleteResponse = ApiResponse<null>;
type ChecklistResponse = ApiResponse<ChecklistApiDto[]>;

interface ChecklistItemApiDto {
  checklistItemId: string;
  title?: string | null;
  description?: string | null;
  isComplete: boolean;
  importance?: string | null;
  category?: string | null;
  dueDate?: string | null;
  order?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface ChecklistApiDto {
  checklistId: string;
  conversationId: string;
  parentChecklistId?: string | null;
  versionNumber: number;
  title?: string | null;
  summary?: string | null;
  destination?: string | null;
  duration?: string | null;
  stayType?: string | null;
  cityCode?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  items: ChecklistItemApiDto[];
}

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

export async function fetchChecklistsApiWrapper(
  conversationId: string,
): Promise<ChecklistResponse> {
  return fetchWithErrorHandling<ChecklistApiDto[]>(
    `/api/conversation/${conversationId}/checklists`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

const stayTypeMap: Record<string, StayType> = {
  shortterm: 'shortTerm',
  'short-term': 'shortTerm',
  short: 'shortTerm',
  mediumterm: 'mediumTerm',
  'medium-term': 'mediumTerm',
  medium: 'mediumTerm',
  longterm: 'longTerm',
  'long-term': 'longTerm',
  long: 'longTerm',
};

const statusMap: Record<string, ChecklistStatus> = {
  pending: 'pending',
  generating: 'generating',
  started: 'generating',
  completed: 'completed',
  success: 'completed',
  failed: 'failed',
  failure: 'failed',
};

const importanceMap: Record<string, ChecklistImportance> = {
  urgent: 'high',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

function normalizeStayType(value?: string | null): StayType {
  if (!value) return 'mediumTerm';
  const key = value.trim().toLowerCase();
  return stayTypeMap[key] ?? 'mediumTerm';
}

function normalizeStatus(value?: string | null): ChecklistStatus {
  if (!value) return 'generating';
  const key = value.trim().toLowerCase();
  return statusMap[key] ?? 'generating';
}

function normalizeImportance(value?: string | null): ChecklistImportance {
  if (!value) return 'medium';
  const key = value.trim().toLowerCase();
  return importanceMap[key] ?? 'medium';
}

function normalizeCityCode(value?: string | null): CityCode {
  if (!value) return 'default';
  const normalized = value.trim().toLowerCase();
  return (normalized || 'default') as CityCode;
}

function toIsoStringOrNull(value?: string | null): string {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString();
}

function transformChecklistItemPayload(
  item: ChecklistItemApiDto,
  checklistId: string,
  conversationId: string,
  normalizedOrder: number,
): ChecklistItemModel {
  return {
    id: item.checklistItemId,
    checklistId,
    conversationId,
    source: 'ai-generated', // Items from API are AI-generated
    title: item.title?.trim() ?? '',
    description: item.description?.trim() ?? '',
    importance: normalizeImportance(item.importance),
    dueDate: item.dueDate ?? undefined,
    category: item.category?.trim() || 'General',
    order: normalizedOrder,
    isComplete: item.isComplete,
    createdAt: toIsoStringOrNull(item.createdAt),
    updatedAt: item.updatedAt
      ? toIsoStringOrNull(item.updatedAt)
      : toIsoStringOrNull(item.createdAt),
  };
}

function transformChecklistPayload(payload: ChecklistApiDto): ChecklistMetadata {
  const items = (payload.items ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item, index) =>
      transformChecklistItemPayload(item, payload.checklistId, payload.conversationId, index),
    );

  const transformed = {
    checklistId: payload.checklistId,
    conversationId: payload.conversationId,
    version: payload.versionNumber,
    previousVersionId: payload.parentChecklistId ?? undefined,
    title: payload.title?.trim() ?? 'Checklist',
    summary: payload.summary?.trim() ?? '',
    destination: payload.destination?.trim() ?? 'TBD',
    duration: payload.duration?.trim() ?? 'TBD',
    stayType: normalizeStayType(payload.stayType),
    cityCode: normalizeCityCode(payload.cityCode) as any,
    status: normalizeStatus(payload.status),
    items,
    createdAt: toIsoStringOrNull(payload.createdAt),
    updatedAt: toIsoStringOrNull(payload.updatedAt),
  };

  return transformed;
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
    // Step 1: Check cache validity (5-minute TTL)
    const state: RootState = yield select();
    const cached = state.conversation.messagesByConversation[conversationId];
    const timestamp = state.conversation.cacheTimestamps[conversationId];

    if (cached && timestamp && Date.now() - timestamp < 5 * 60 * 1000) {
      return;
    }

    // Step 2: Set loading state for skeleton display
    yield put(setConversationLoading({ conversationId, isLoading: true }));

    // Step 3: Fetch messages from backend API
    const res: ConversationResponse = yield call(fetchMessagesApiWrapper, conversationId);

    // Step 4: Handle 404/400 - redirect with friendly error message
    if (res.status === 404 || res.status === 400) {
      yield put(setError('Conversation not found or has been deleted.'));
      if (typeof window !== 'undefined') {
        const language = window.location.pathname.split('/')[1] || 'en';
        window.location.assign(`/${language}/assistant`);
      }
      return;
    }

    // Step 5: Handle other error responses
    if (!res.ok) {
      let errorMessage = 'Failed to load conversation messages.';
      if (res.status === 403) {
        errorMessage = 'You do not have permission to access this conversation.';
      }
      if (res.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      yield put(setError(errorMessage));
      return;
    }

    // Step 6: Cache messages with current timestamp
    if (res.data) {
      yield put(
        cacheConversationMessages({
          conversationId,
          messages: res.data,
        }),
      );

      // Step 7: Refresh conversation list if this is a newly created conversation
      const conversations = state.conversation.conversations;
      const exists = conversations.some((c) => c.conversationId === conversationId);

      if (!exists) {
        yield call(handleFetchConversations);
      }
    }

    // Step 8: Fetch persisted checklists for this conversation
    const checklistRes: ChecklistResponse = yield call(fetchChecklistsApiWrapper, conversationId);

    if (checklistRes.ok && checklistRes.data) {
      const transformed = checklistRes.data.map(transformChecklistPayload);
      for (const checklist of transformed) {
        yield put(upsertChecklistMetadata(checklist));
      }

      const checklistState: RootState = yield select();
      const activeId = checklistState.checklist.activeChecklistId;
      const hasActiveInConversation = activeId
        ? transformed.some((cl) => cl.checklistId === activeId)
        : false;

      if (!hasActiveInConversation) {
        const sortedByVersion = [...transformed].sort((a, b) => b.version - a.version);
        const latestCompleted = sortedByVersion.find((cl) => cl.status === 'completed');
        const nextActive = latestCompleted ?? sortedByVersion[0];

        if (nextActive) {
          yield put(setActiveChecklist(nextActive.checklistId));
        }
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
