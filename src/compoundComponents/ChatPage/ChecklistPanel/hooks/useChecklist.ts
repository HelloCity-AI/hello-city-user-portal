import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';
import type { ChecklistStats, FilterType, CityInfo, CityCode } from '../types';
import {
  filterChecklistItems,
  calculateChecklistStats,
  getVisibleItemIds,
  getItemsToRender,
} from '../utils/checklistHelpers';
import { getCityInfo } from '../data/cityData';

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
 * @param conversationId - Current conversation ID to validate checklist belongs to it
 * @returns Active checklist data with computed states
 */
export const useChecklist = (
  filter: FilterType = 'all',
  conversationId?: string,
): UseChecklistReturn => {
  const { checklists, activeChecklistId, isLoading, error } = useSelector(
    (state: RootState) => state.checklist,
  );

  // Get active checklist with conversation validation
  const activeChecklist = useMemo(() => {
    if (!activeChecklistId || !checklists[activeChecklistId]) {
      return null;
    }

    const checklist = checklists[activeChecklistId];

    // Validate checklist belongs to current conversation
    if (conversationId && checklist.conversationId !== conversationId) {
      return null;
    }

    return checklist;
  }, [checklists, activeChecklistId, conversationId]);

  // Get city info by looking up cityCode
  const cityInfo = useMemo(() => {
    if (!activeChecklist) {
      return null;
    }
    const result = getCityInfo(activeChecklist.cityCode as CityCode);
    return result;
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
