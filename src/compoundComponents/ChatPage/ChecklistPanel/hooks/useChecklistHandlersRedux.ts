import { useCallback } from 'react';

import { useChecklistActions } from './useChecklistActions';

import type { ChecklistItem, ChecklistHandlers } from '../types';

interface UseChecklistHandlersReduxProps {
  activeChecklistId: string | null;
  onChecklistToggle?: (itemId: string) => void;
  onChecklistEdit?: (item: ChecklistItem) => void;
  onChecklistDelete?: (itemId: string) => void;
  onChecklistAdd?: () => void;
}

/**
 * Redux version of checklist handlers
 * Dispatches actions to Redux store instead of managing local state
 */
export const useChecklistHandlersRedux = ({
  activeChecklistId,
  onChecklistToggle,
  onChecklistEdit,
  onChecklistDelete,
  onChecklistAdd,
}: UseChecklistHandlersReduxProps): ChecklistHandlers => {
  const { toggleItem, reorderItems } = useChecklistActions();

  const handleToggle = useCallback(
    (itemId: string) => {
      if (!activeChecklistId) return;

      toggleItem(activeChecklistId, itemId);
      onChecklistToggle?.(itemId);
    },
    [activeChecklistId, toggleItem, onChecklistToggle],
  );

  const handleEdit = useCallback(
    (item: ChecklistItem) => {
      onChecklistEdit?.(item);
    },
    [onChecklistEdit],
  );

  const handleDelete = useCallback(
    (itemId: string) => {
      // TODO: Implement delete action in Redux slice
      onChecklistDelete?.(itemId);
    },
    [onChecklistDelete],
  );

  const handleReorder = useCallback(
    (reorderedIds: string[]) => {
      if (!activeChecklistId) return;

      reorderItems(activeChecklistId, reorderedIds);
    },
    [activeChecklistId, reorderItems],
  );

  const handleAdd = useCallback(() => {
    onChecklistAdd?.();
  }, [onChecklistAdd]);

  const handleUpdate = useCallback((items: ChecklistItem[]) => {
    // TODO: Implement batch update action in Redux slice
    console.log('Batch update not yet implemented:', items);
  }, []);

  return {
    onToggle: handleToggle,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReorder: handleReorder,
    onAdd: handleAdd,
    onUpdate: handleUpdate,
  };
};
