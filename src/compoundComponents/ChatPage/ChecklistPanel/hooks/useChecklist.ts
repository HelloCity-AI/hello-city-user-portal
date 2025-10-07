import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { ChecklistStats, FilterType, CityInfo } from '../types';
import {
  filterChecklistItems,
  calculateChecklistStats,
  getVisibleItemIds,
  getItemsToRender,
} from '../utils/checklistHelpers';
import { getCityInfo } from '../utils/getCityInfo';

interface UseChecklistReturn {
  activeChecklistId: string | null;
  cityInfo: CityInfo | null;
  checklistItems: ReturnType<typeof filterChecklistItems>;
  stats: ChecklistStats;
  visibleIds: string[];
  itemsToRender: ReturnType<typeof getItemsToRender>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for accessing active checklist from Redux store
 *
 * @param filter - Filter type for checklist items (all, completed, incomplete)
 * @returns Active checklist data with computed states
 */
export const useChecklist = (filter: FilterType = 'all'): UseChecklistReturn => {
  const { checklists, activeChecklistId, isLoading, error } = useSelector(
    (state: RootState) => state.checklist,
  );

  // Get active checklist
  const activeChecklist = useMemo(() => {
    if (!activeChecklistId || !checklists[activeChecklistId]) {
      return null;
    }
    return checklists[activeChecklistId];
  }, [checklists, activeChecklistId]);

  // Get city info by looking up cityCode
  const cityInfo = useMemo(() => {
    if (!activeChecklist) return null;
    return getCityInfo(activeChecklist.cityCode);
  }, [activeChecklist]);

  // Get all items from active checklist
  const allItems = useMemo(() => {
    return activeChecklist?.items || [];
  }, [activeChecklist]);

  // Calculate filtered items
  const checklistItems = useMemo(() => filterChecklistItems(allItems, filter), [allItems, filter]);

  // Calculate stats
  const stats = useMemo(() => {
    return calculateChecklistStats(allItems);
  }, [allItems]);

  // Calculate visible IDs
  const visibleIds = useMemo(() => {
    return getVisibleItemIds(checklistItems);
  }, [checklistItems]);

  // Calculate items to render
  const itemsToRender = useMemo(
    () => getItemsToRender(allItems, visibleIds),
    [allItems, visibleIds],
  );

  return {
    activeChecklistId,
    cityInfo,
    checklistItems,
    stats,
    visibleIds,
    itemsToRender,
    isLoading,
    error,
  };
};
