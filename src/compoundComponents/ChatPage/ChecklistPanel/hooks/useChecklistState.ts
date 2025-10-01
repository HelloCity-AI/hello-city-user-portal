import { useEffect, useMemo, useState } from 'react';
import type { ChecklistItem, FilterType, ChecklistStats } from '../types';
import {
  filterChecklistItems,
  calculateChecklistStats,
  getVisibleItemIds,
  getItemsToRender,
} from '../utils/checklistHelpers';

interface UseChecklistStateProps {
  initialItems: ChecklistItem[];
}

interface UseChecklistStateReturn {
  checklistItems: ChecklistItem[];
  setChecklistItems: (items: ChecklistItem[]) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredItems: ChecklistItem[];
  stats: ChecklistStats;
  visibleIds: string[];
  setVisibleIds: (ids: string[]) => void;
  itemsToRender: ChecklistItem[];
}

/**
 * Manages checklist state with filtering, statistics, and drag-and-drop ordering
 *
 * TODO: Add persistence layer for checklist state
 * TODO: Implement real-time collaboration features
 * PLACEHOLDER: Add undo/redo state management
 */
export const useChecklistState = ({
  initialItems,
}: UseChecklistStateProps): UseChecklistStateReturn => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initialItems);
  const [filter, setFilter] = useState<FilterType>('all');
  const [visibleIds, setVisibleIds] = useState<string[]>(() => getVisibleItemIds(initialItems));

  // Calculate filtered items
  const filteredItems = useMemo(
    () => filterChecklistItems(checklistItems, filter),
    [checklistItems, filter],
  );

  // Calculate stats
  const stats = useMemo(() => {
    // PLACEHOLDER: Add advanced analytics (time tracking, completion trends)
    return calculateChecklistStats(checklistItems);
  }, [checklistItems]);

  // Calculate items to render based on visible IDs
  const itemsToRender = useMemo(
    () => getItemsToRender(checklistItems, visibleIds),
    [checklistItems, visibleIds],
  );

  // Keep visible IDs in sync with filtered items
  useEffect(() => {
    // TODO: Add debounce for rapid filter changes
    const nextVisibleIds = getVisibleItemIds(filteredItems);
    setVisibleIds((current) => {
      if (
        current.length === nextVisibleIds.length &&
        current.every((id, index) => id === nextVisibleIds[index])
      ) {
        return current;
      }
      return nextVisibleIds;
    });
    // PLACEHOLDER: Emit filter change events for analytics
  }, [filteredItems]);

  // Update internal state when initial items change
  useEffect(() => {
    setChecklistItems(initialItems);
  }, [initialItems]);

  return {
    checklistItems,
    setChecklistItems,
    filter,
    setFilter,
    filteredItems,
    stats,
    visibleIds,
    setVisibleIds,
    itemsToRender,
  };
};
