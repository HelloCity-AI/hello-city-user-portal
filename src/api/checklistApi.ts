/**
 * Checklist API Module
 *
 * This module provides functions for interacting with the checklist API endpoints.
 * It handles CRUD operations for checklist items including creation, retrieval,
 * updating, and deletion of items.
 */
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import type { ChecklistItem } from '@/types/checklist.types';
import {
  apiToChecklistItem,
  checklistItemToAPI,
  type APIChecklistItem,
} from './transformers/checklistTransformers';
import dayjs from 'dayjs';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const checklistApi = {
  /**
   * Creates a new checklist item for a specific user
   *
   * @param userId - The ID of the user who owns the checklist item
   * @param data - The checklist item data to be created
   * @returns Promise resolving to the created checklist item
   * @throws Error if the API request fails
   */
  async createChecklistItem(
    userId: string,
    data: Partial<ChecklistItem>,
  ): Promise<ChecklistItem> {
    // Transform frontend format to backend format
    const apiPayload = checklistItemToAPI(data);

    // Format the due date to YYYY-MM-DD format if it exists
    if (data.dueDate) {
      apiPayload.dueDate = dayjs(data.dueDate).format('YYYY-MM-DD');
    }

    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) throw new Error('Failed to create checklist item');

    // Transform backend response to frontend format
    const apiResponse: APIChecklistItem = await response.json();
    return apiToChecklistItem(apiResponse);
  },

  /**
   * Retrieves all checklist items for a specific user
   *
   * @param userId - The ID of the user whose checklist items to fetch
   * @returns Promise resolving to an array of checklist items
   * @throws Error if the API request fails
   */
  async getChecklistItems(userId: string): Promise<ChecklistItem[]> {
    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item`);

    if (!response.ok) throw new Error('Failed to fetch checklist items');

    // Transform backend response array to frontend format
    const apiItems: APIChecklistItem[] = await response.json();
    return apiItems.map(apiToChecklistItem);
  },

  /**
   * Updates an existing checklist item
   *
   * @param userId - The ID of the user who owns the checklist item
   * @param itemId - The ID of the checklist item to update
   * @param data - Partial data containing fields to update
   * @returns Promise resolving to the updated checklist item
   * @throws Error if the API request fails
   */
  async updateChecklistItem(
    userId: string,
    itemId: string,
    data: Partial<ChecklistItem>,
  ): Promise<ChecklistItem> {
    // Transform frontend format to backend format
    const apiPayload = checklistItemToAPI(data);

    const response = await fetchWithAuth(
      `${BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      },
    );

    if (!response.ok) throw new Error('Failed to update checklist item');

    // Transform backend response to frontend format
    const apiResponse: APIChecklistItem = await response.json();
    return apiToChecklistItem(apiResponse);
  },

  /**
   * Deletes a checklist item
   *
   * @param userId - The ID of the user who owns the checklist item
   * @param itemId - The ID of the checklist item to delete
   * @returns Promise resolving when the delete operation completes
   * @throws Error if the API request fails
   */
  async deleteChecklistItem(userId: string, itemId: string): Promise<void> {
    const response = await fetchWithAuth(
      `${BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`,
      { method: 'DELETE' },
    );

    if (!response.ok) throw new Error('Failed to delete checklist item');
  },
};
