import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  toggleChecklistItem,
  updateChecklistItem,
  reorderChecklistItems,
} from '@/store/slices/checklist';
import type { ChecklistItem } from '../types';

interface UseChecklistActionsReturn {
  toggleItem: (checklistId: string, itemId: string) => void;
  updateItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  reorderItems: (checklistId: string, reorderedIds: string[]) => void;
}

/**
 * Custom hook for dispatching checklist actions to Redux store
 *
 * @returns Action dispatchers for checklist operations
 */
export const useChecklistActions = (): UseChecklistActionsReturn => {
  const dispatch = useDispatch();

  const toggleItem = useCallback(
    (checklistId: string, itemId: string) => {
      dispatch(
        toggleChecklistItem({
          checklistId,
          itemId,
        }),
      );
    },
    [dispatch],
  );

  const updateItem = useCallback(
    (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
      dispatch(
        updateChecklistItem({
          checklistId,
          itemId,
          updates,
        }),
      );
    },
    [dispatch],
  );

  const reorderItems = useCallback(
    (checklistId: string, reorderedIds: string[]) => {
      dispatch(
        reorderChecklistItems({
          checklistId,
          reorderedIds,
        }),
      );
    },
    [dispatch],
  );

  return {
    toggleItem,
    updateItem,
    reorderItems,
  };
};
