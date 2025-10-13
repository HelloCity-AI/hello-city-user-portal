import type { ChecklistItem } from '@/types/checklist.types';

// ========== Type Mappings (from conversationSaga.ts) ==========

/**
 * Backend ImportanceLevel enum (PascalCase) → Frontend (lowercase)
 * Reuses the same mapping logic as conversationSaga.ts
 */
const importanceMap: Record<string, 'high' | 'medium' | 'low'> = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
  urgent: 'high',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

/**
 * Frontend → Backend ImportanceLevel enum
 */
const toBackendImportance = (importance: 'high' | 'medium' | 'low'): string => {
  const reverseMap: Record<'high' | 'medium' | 'low', string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return reverseMap[importance];
};

// ========== Transformers ==========

/**
 * Backend API response → Frontend ChecklistItem
 * Follows the pattern from conversationSaga transformChecklistItemPayload
 * @param api - Backend API response
 * @param checklistId - Checklist ID from API call context
 * @param conversationId - Conversation ID from API call context
 */
export const apiToChecklistItem = (
  api: any,
  checklistId: string,
  conversationId: string,
): ChecklistItem => ({
  id: api.checklistItemId,
  checklistId,
  conversationId,
  source: api.source || 'manual',
  title: api.title ?? '',
  description: api.description ?? '',
  importance: importanceMap[api.importance] ?? 'medium',
  dueDate: api.dueDate,
  category: api.category,
  order: api.order ?? 0,
  isComplete: api.isComplete,
  createdAt: api.createdAt,
  updatedAt: api.updatedAt,
});

/**
 * Frontend ChecklistItem → Backend API request payload
 * Only includes fields that can be updated
 */
export const checklistItemToAPI = (item: Partial<ChecklistItem>): any => {
  const payload: any = {};

  if (item.title !== undefined) payload.title = item.title;
  if (item.description !== undefined) payload.description = item.description;
  if (item.importance !== undefined) payload.importance = toBackendImportance(item.importance);
  if (item.dueDate !== undefined) payload.dueDate = item.dueDate;
  if (item.category !== undefined) payload.category = item.category;

  return payload;
};

// ========== API Request Types ==========

export interface CreateItemRequest {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  dueDate?: string;
  category?: string;
}
