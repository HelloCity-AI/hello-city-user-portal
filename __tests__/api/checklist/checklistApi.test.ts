jest.mock('@/utils/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

import { checklistApi } from '@/api/checklistApi';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

// Mock API response (backend format with PascalCase)
const mockAPIChecklistItem = {
  checklistItemId: 'item-id',
  ownerId: 'user-id',
  title: 'Test',
  description: 'Desc',
  isComplete: false,
  importance: 'Low', // Backend uses PascalCase
  dueDate: '2025-09-26',
};

// Expected frontend format (after transformation)
const mockChecklistItem = {
  id: 'item-id',
  title: 'Test',
  description: 'Desc',
  isComplete: false,
  importance: 'low', // Frontend uses lowercase
  dueDate: '2025-09-26',
  category: undefined,
  order: 0,
  createdAt: expect.any(String),
  updatedAt: undefined,
};

describe('checklistApi', () => {
  const userId = 'user-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createChecklistItem should POST and format dueDate', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAPIChecklistItem,
    });

    const data = {
      title: 'Test',
      description: 'Desc',
      isComplete: false,
      importance: 'low' as const,
      dueDate: '2025-09-26',
    };

    const result = await checklistApi.createChecklistItem(userId, data);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}/checklist-item`),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"dueDate":"2025-09-26"'),
      }),
    );
    expect(result).toEqual(mockChecklistItem);
  });

  it('createChecklistItem should handle undefined dueDate', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAPIChecklistItem,
    });

    const data = {
      title: 'Test',
      description: 'Desc',
      isComplete: false,
      importance: 'low' as const,
      dueDate: undefined,
    };

    await checklistApi.createChecklistItem(userId, data);
    // check that dueDate is NOT included when undefined (omitted from payload)
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.not.stringContaining('"dueDate"'),
      }),
    );
  });

  it('getChecklistItems should GET', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockAPIChecklistItem],
    });

    const result = await checklistApi.getChecklistItems(userId);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}/checklist-item`),
    );
    expect(result).toEqual([mockChecklistItem]);
  });

  it('getChecklistItems should throw error on failed response', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: false });

    await expect(checklistApi.getChecklistItems(userId)).rejects.toThrow(
      'Failed to fetch checklist items',
    );
  });

  it('updateChecklistItem should PUT', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAPIChecklistItem,
    });

    const itemId = 'item-id';
    const updateData = { title: 'Updated' };

    const result = await checklistApi.updateChecklistItem(userId, itemId, updateData);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}/checklist-item?itemId=${itemId}`),
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(result).toEqual(mockChecklistItem);
  });

  it('updateChecklistItem should throw error on failed response', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: false });

    await expect(
      checklistApi.updateChecklistItem(userId, 'item-id', { title: 'Updated' }),
    ).rejects.toThrow('Failed to update checklist item');
  });

  it('deleteChecklistItem should DELETE', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: true });

    const itemId = 'item-id';
    await checklistApi.deleteChecklistItem(userId, itemId);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}/checklist-item?itemId=${itemId}`),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('deleteChecklistItem should throw error on failed response', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: false });

    await expect(checklistApi.deleteChecklistItem(userId, 'item-id')).rejects.toThrow(
      'Failed to delete checklist item',
    );
  });

  it('should throw error on failed response', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: false });

    await expect(
      checklistApi.createChecklistItem(userId, {
        title: 'Test',
        description: 'Desc',
        isComplete: false,
        importance: 'low' as const,
        dueDate: '2025-09-26',
      }),
    ).rejects.toThrow('Failed to create checklist item');
  });
});
