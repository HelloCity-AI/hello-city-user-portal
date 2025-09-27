/**
 * Checklist API Module
 *
 * This module provides functions for interacting with the checklist API endpoints.
 * It handles CRUD operations for checklist items including creation, retrieval,
 * updating, and deletion of items.
 */
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import type { CreateChecklistItemRequest, ChecklistItem } from '@/types/checkList.types';
import dayjs from 'dayjs';

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
    data: CreateChecklistItemRequest,
  ): Promise<ChecklistItem> {
    // Format the due date to YYYY-MM-DD format if it exists
    const payload = {
      ...data,
      dueDate: data.dueDate ? dayjs(data.dueDate).format('YYYY-MM-DD') : '',
    };

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/checklist-item`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) throw new Error('Failed to create checklist item');
    return response.json();
  },

  /**
   * Retrieves all checklist items for a specific user
   *
   * @param userId - The ID of the user whose checklist items to fetch
   * @returns Promise resolving to an array of checklist items
   * @throws Error if the API request fails
   */
  async getChecklistItems(userId: string): Promise<ChecklistItem[]> {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/checklist-item`,
    );

    if (!response.ok) throw new Error('Failed to fetch checklist items');
    return response.json();
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
    data: Partial<CreateChecklistItemRequest>,
  ): Promise<ChecklistItem> {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) throw new Error('Failed to update checklist item');
    return response.json();
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`,
      { method: 'DELETE' },
    );

    if (!response.ok) throw new Error('Failed to delete checklist item');
  },
};
