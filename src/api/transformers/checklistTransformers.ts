/**
 * Checklist API Transformers
 *
 * This module handles transformation between backend API format and frontend domain models.
 * This is the ONLY place where API-to-domain conversion should happen.
 *
 * @module checklistTransformers
 */

import type { ChecklistItem, ChecklistImportance } from '@/types/checklist.types';

// ========== Backend API Types ==========

/**
 * Backend API response format for checklist items
 * Uses PascalCase for importance and different field names
 */
export interface APIChecklistItem {
  checklistItemId: string;
  ownerId: string;
  title: string;
  description: string;
  isComplete: boolean;
  importance: 'Low' | 'Medium' | 'High'; // Backend uses PascalCase
  dueDate: string | null;
  userOwner?: {
    userId: string;
    username: string;
    email: string;
    subId: string;
    avatarKey: string;
    gender: string;
    nationality: string;
    city: string;
    university: string;
    major: string;
    preferredLanguage: string;
    lastJoinDate: string;
    createdAt: string;
    updatedAt: string;
    checklistItems: string[];
  };
}

/**
 * Backend API request format for creating checklist items
 */
export interface CreateChecklistItemRequest {
  ownerId: string;
  title: string;
  description: string;
  isComplete: boolean;
  importance: 'Low' | 'Medium' | 'High';
  dueDate: string | null;
}

// ========== Helper Functions ==========

/**
 * Normalize importance from backend PascalCase to frontend lowercase
 *
 * @param importance - Backend importance value ('Low' | 'Medium' | 'High')
 * @returns Frontend importance value ('low' | 'medium' | 'high')
 */
function normalizeImportance(importance: 'Low' | 'Medium' | 'High'): ChecklistImportance {
  return importance.toLowerCase() as ChecklistImportance;
}

/**
 * Denormalize importance from frontend lowercase to backend PascalCase
 *
 * @param importance - Frontend importance value ('low' | 'medium' | 'high')
 * @returns Backend importance value ('Low' | 'Medium' | 'High')
 */
function denormalizeImportance(importance: ChecklistImportance): 'Low' | 'Medium' | 'High' {
  return (importance.charAt(0).toUpperCase() + importance.slice(1)) as 'Low' | 'Medium' | 'High';
}

// ========== Main Transformers ==========

/**
 * Transform backend checklist item to frontend format
 *
 * This is the ONLY place where API-to-domain conversion happens
 *
 * @param apiItem - Backend API checklist item
 * @returns Frontend checklist item
 */
export function apiToChecklistItem(apiItem: APIChecklistItem): ChecklistItem {
  return {
    id: apiItem.checklistItemId, // Unified ID field
    title: apiItem.title,
    description: apiItem.description,
    importance: normalizeImportance(apiItem.importance), // Lowercase enum
    dueDate: apiItem.dueDate ?? undefined,
    category: undefined, // Not provided by API yet
    order: 0, // Will be set by client
    isComplete: apiItem.isComplete,
    createdAt: new Date().toISOString(), // API doesn't provide this yet
    updatedAt: undefined,
  };
}

/**
 * Transform frontend checklist item to backend format
 *
 * @param item - Frontend checklist item (partial for updates)
 * @returns Backend API checklist item format
 */
export function checklistItemToAPI(
  item: Partial<ChecklistItem> & { id?: string },
): Partial<CreateChecklistItemRequest> {
  const payload: Partial<CreateChecklistItemRequest> = {};

  if (item.id) {
    // ID field is not sent in create/update requests
    // Backend uses checklistItemId in responses only
  }

  if (item.title !== undefined) {
    payload.title = item.title;
  }

  if (item.description !== undefined) {
    payload.description = item.description;
  }

  if (item.isComplete !== undefined) {
    payload.isComplete = item.isComplete;
  }

  if (item.importance !== undefined) {
    payload.importance = denormalizeImportance(item.importance); // PascalCase enum
  }

  if (item.dueDate !== undefined) {
    payload.dueDate = item.dueDate || null;
  }

  return payload;
}
