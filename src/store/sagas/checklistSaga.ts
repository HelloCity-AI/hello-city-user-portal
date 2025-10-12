import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import {
  addChecklistItem,
  updateChecklistItem as updateItemAction,
  deleteChecklistItem as deleteItemAction,
  reorderChecklistItems as reorderItemsAction,
  restoreChecklistItems,
  setError,
} from '../slices/checklist';
import { fetchWithErrorHandling } from '@/utils/fetchHelpers';
import type { CreateItemRequest } from '@/api/checklistItemApi';
import type { ChecklistItem } from '@/types/checklist.types';
import type { RootState } from '..';
import type { ApiResponse } from '@/types/api.types';

// ========== API Response Types ==========

type CreateItemResponse = ApiResponse<ChecklistItem>;
type UpdateItemResponse = ApiResponse<ChecklistItem>;
type ToggleCompleteResponse = ApiResponse<ChecklistItem>;
type DeleteItemResponse = ApiResponse<null>;
type ReorderItemsResponse = ApiResponse<null>;

// ========== API Wrappers ==========

export async function createChecklistItemApiWrapper(
  conversationId: string,
  checklistId: string,
  data: CreateItemRequest,
): Promise<CreateItemResponse> {
  return fetchWithErrorHandling<ChecklistItem>(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
}

export async function updateChecklistItemApiWrapper(
  conversationId: string,
  checklistId: string,
  itemId: string,
  data: Partial<ChecklistItem>,
): Promise<UpdateItemResponse> {
  return fetchWithErrorHandling<ChecklistItem>(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
}

export async function toggleChecklistItemCompleteApiWrapper(
  conversationId: string,
  checklistId: string,
  itemId: string,
  isComplete: boolean,
): Promise<ToggleCompleteResponse> {
  return fetchWithErrorHandling<ChecklistItem>(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}/complete`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isComplete }),
    },
  );
}

export async function deleteChecklistItemApiWrapper(
  conversationId: string,
  checklistId: string,
  itemId: string,
): Promise<DeleteItemResponse> {
  return fetchWithErrorHandling<null>(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function reorderChecklistItemsApiWrapper(
  conversationId: string,
  checklistId: string,
  itemIds: string[],
): Promise<ReorderItemsResponse> {
  return fetchWithErrorHandling<null>(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/reorder`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemIds }),
    },
  );
}

// ========== Action Types ==========

interface CreateItemPayload {
  conversationId: string;
  checklistId: string;
  data: CreateItemRequest;
}

interface UpdateItemPayload {
  conversationId: string;
  checklistId: string;
  itemId: string;
  data: Partial<ChecklistItem>;
}

interface ToggleCompletePayload {
  conversationId: string;
  checklistId: string;
  itemId: string;
  isComplete: boolean;
}

interface DeleteItemPayload {
  conversationId: string;
  checklistId: string;
  itemId: string;
}

interface ReorderPayload {
  conversationId: string;
  checklistId: string;
  reorderedIds: string[];
}

// ========== Saga Action Creators ==========

export const createChecklistItemRequest = createAction<CreateItemPayload>(
  'checklistSaga/createItem',
);

export const updateChecklistItemRequest = createAction<UpdateItemPayload>(
  'checklistSaga/updateItem',
);

export const toggleChecklistItemRequest = createAction<ToggleCompletePayload>(
  'checklistSaga/toggleComplete',
);

export const deleteChecklistItemRequest = createAction<DeleteItemPayload>(
  'checklistSaga/deleteItem',
);

export const reorderChecklistItemsRequest = createAction<ReorderPayload>(
  'checklistSaga/reorderItems',
);

// ========== Saga Handlers ==========

/**
 * Handle create checklist item (no optimistic update)
 * Follows conversationSaga pattern: call API → dispatch action
 */
function* handleCreateChecklistItem(action: PayloadAction<CreateItemPayload>): SagaIterator {
  const { conversationId, checklistId, data } = action.payload;

  try {
    const res: CreateItemResponse = yield call(
      createChecklistItemApiWrapper,
      conversationId,
      checklistId,
      data,
    );

    if (res.ok && res.data) {
      yield put(addChecklistItem({ checklistId, item: res.data }));
    } else {
      const errorMessage = `Failed to create item: ${res.status}`;
      yield put(setError(errorMessage));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
    yield put(setError(errorMessage));
    throw error;
  }
}

/**
 * Handle update checklist item (optimistic update + rollback)
 * Follows handleUpdateConversation pattern from conversationSaga
 */
function* handleUpdateChecklistItem(action: PayloadAction<UpdateItemPayload>): SagaIterator {
  const { conversationId, checklistId, itemId, data } = action.payload;

  // Get current state for rollback (like conversationSaga line 354)
  const state: RootState = yield select();
  const checklist = state.checklist.checklists[checklistId];
  const originalItem = checklist?.items.find((i) => i.id === itemId);

  try {
    // Optimistic update (like conversationSaga line 360)
    yield put(updateItemAction({ checklistId, itemId, updates: data }));

    const res: UpdateItemResponse = yield call(
      updateChecklistItemApiWrapper,
      conversationId,
      checklistId,
      itemId,
      data,
    );

    // Sync with server response if successful
    if (res.ok && res.data) {
      yield put(updateItemAction({ checklistId, itemId, updates: res.data }));
    } else {
      // Rollback on API error
      if (originalItem) {
        yield put(updateItemAction({ checklistId, itemId, updates: originalItem }));
      }
      yield put(setError(`Failed to update item: ${res.status}`));
    }
  } catch (error: unknown) {
    // Rollback (like conversationSaga line 367)
    if (originalItem) {
      yield put(updateItemAction({ checklistId, itemId, updates: originalItem }));
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
    yield put(setError(errorMessage));
    throw error;
  }
}

/**
 * Handle toggle complete (checkbox on card)
 * Optimistic update for instant UI feedback
 */
function* handleToggleComplete(action: PayloadAction<ToggleCompletePayload>): SagaIterator {
  const { conversationId, checklistId, itemId, isComplete } = action.payload;

  const state: RootState = yield select();
  const checklist = state.checklist.checklists[checklistId];
  const originalItem = checklist?.items.find((i) => i.id === itemId);

  try {
    // Optimistic update
    yield put(updateItemAction({ checklistId, itemId, updates: { isComplete } }));

    const res: ToggleCompleteResponse = yield call(
      toggleChecklistItemCompleteApiWrapper,
      conversationId,
      checklistId,
      itemId,
      isComplete,
    );

    if (!res.ok) {
      // Rollback on API error
      if (originalItem) {
        yield put(
          updateItemAction({
            checklistId,
            itemId,
            updates: { isComplete: originalItem.isComplete },
          }),
        );
      }
      yield put(setError(`Failed to toggle complete: ${res.status}`));
    }
  } catch (error: unknown) {
    // Rollback to original isComplete state
    if (originalItem) {
      yield put(
        updateItemAction({
          checklistId,
          itemId,
          updates: { isComplete: originalItem.isComplete },
        }),
      );
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to toggle complete';
    yield put(setError(errorMessage));
  }
}

/**
 * Handle delete checklist item (optimistic delete + rollback)
 */
function* handleDeleteChecklistItem(action: PayloadAction<DeleteItemPayload>): SagaIterator {
  const { conversationId, checklistId, itemId } = action.payload;

  const state: RootState = yield select();
  const checklist = state.checklist.checklists[checklistId];
  const originalItems = checklist?.items || [];

  try {
    // Optimistic delete
    yield put(deleteItemAction({ checklistId, itemId }));

    const res: DeleteItemResponse = yield call(
      deleteChecklistItemApiWrapper,
      conversationId,
      checklistId,
      itemId,
    );

    if (!res.ok) {
      // Rollback - restore full items array
      yield put(restoreChecklistItems({ checklistId, items: originalItems }));
      yield put(setError(`Failed to delete item: ${res.status}`));
    }
  } catch (error: unknown) {
    // Rollback - restore full items array
    yield put(restoreChecklistItems({ checklistId, items: originalItems }));
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
    yield put(setError(errorMessage));
    throw error;
  }
}

/**
 * Handle reorder checklist items (optimistic reorder + rollback)
 */
function* handleReorderChecklistItems(action: PayloadAction<ReorderPayload>): SagaIterator {
  const { conversationId, checklistId, reorderedIds } = action.payload;

  const state: RootState = yield select();
  const checklist = state.checklist.checklists[checklistId];
  const originalItems = checklist?.items || [];

  try {
    // Optimistic reorder
    yield put(reorderItemsAction({ checklistId, reorderedIds }));

    const res: ReorderItemsResponse = yield call(
      reorderChecklistItemsApiWrapper,
      conversationId,
      checklistId,
      reorderedIds,
    );

    if (!res.ok) {
      // Rollback - restore original order
      yield put(restoreChecklistItems({ checklistId, items: originalItems }));
      yield put(setError(`Failed to reorder items: ${res.status}`));
    }
  } catch (error: unknown) {
    // Rollback - restore original order
    yield put(restoreChecklistItems({ checklistId, items: originalItems }));
    const errorMessage = error instanceof Error ? error.message : 'Failed to reorder items';
    yield put(setError(errorMessage));
  }
}

// ========== Root Saga ==========

export default function* checklistSaga() {
  yield takeLatest(createChecklistItemRequest.type, handleCreateChecklistItem);
  yield takeLatest(updateChecklistItemRequest.type, handleUpdateChecklistItem);
  yield takeLatest(toggleChecklistItemRequest.type, handleToggleComplete);
  yield takeLatest(deleteChecklistItemRequest.type, handleDeleteChecklistItem);
  yield takeLatest(reorderChecklistItemsRequest.type, handleReorderChecklistItems);
}
