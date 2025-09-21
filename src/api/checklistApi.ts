import { fetchWithAuth } from '../utils/fetchWithAuth';
import type { ChecklistItem, CreateChecklistItemRequest } from '../types/checkList.types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const checklistApi = {
  async getChecklistItems(userId: string): Promise<ChecklistItem[]> {
    console.log('API: Getting checklist items for user:', userId);
    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item`);

    if (!response.ok) {
      throw new Error('Failed to fetch checklist items');
    }

    return response.json();
  },

  async createChecklistItem(userId: string, data: CreateChecklistItemRequest): Promise<ChecklistItem> {
    console.log('API: Creating checklist item', { userId, data });
    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Create failed', errorText);
      throw new Error('Failed to create checklist item');
    }

    return response.json();
  },

  async updateChecklistItem(
    userId: string,
    itemId: string,
    updates: Partial<ChecklistItem>
  ): Promise<ChecklistItem> {
    console.log('API: Updating checklist item', {
      userId,
      itemId,
      updates,
      url: `${BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`
    });

    // 首先获取当前项目的完整数据
    const currentItems = await this.getChecklistItems(userId);
    const currentItem = currentItems.find(item => item.checklistItemId === itemId);

    if (!currentItem) {
      throw new Error('Checklist item not found');
    }

    // 创建完整的更新数据，包含所有必需字段
    const editChecklistItemDto = {
      title: updates.title ?? currentItem.title,
      description: updates.description ?? currentItem.description,
      importance: updates.importance ?? currentItem.importance,
      isComplete: updates.isComplete ?? currentItem.isComplete,
    };

    console.log('API: Sending complete DTO:', editChecklistItemDto);

    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editChecklistItemDto),
    });

    console.log('API: Update response status', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Update failed', { status: response.status, error: errorText });
      throw new Error(`Failed to update checklist item: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('API: Update result', result);
    return result;
  },

  async deleteChecklistItem(userId: string, itemId: string): Promise<void> {
    console.log('API: Deleting checklist item', { userId, itemId });
    const response = await fetchWithAuth(`${BACKEND_URL}/api/user/${userId}/checklist-item?itemId=${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Delete failed', errorText);
      throw new Error('Failed to delete checklist item');
    }
  }
};