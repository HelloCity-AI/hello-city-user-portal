/**
 * Unified Checklist Panel Hook
 *
 * Combines functionality from:
 * - useChecklist: Redux state access and data filtering
 * - useChecklistHandlersRedux: Action handlers
 * - useCityDisplay: Display data and image error handling
 *
 * This is the ONLY hook ChecklistPanel needs to import.
 *
 * @module useChecklistPanel
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '@/store';
import {
  toggleChecklistItem,
  updateChecklistItem,
  reorderChecklistItems,
} from '@/store/slices/checklist';
import { reorderChecklistItemsRequest } from '@/store/sagas/checklistSaga';
import type {
  ChecklistItem,
  ChecklistStats,
  ChecklistHandlers,
  FilterType,
  CityInfo,
  CityDisplayData,
  CityCode,
} from '../types';
import {
  filterChecklistItems,
  calculateChecklistStats,
  getVisibleItemIds,
  getItemsToRender,
} from '../utils/checklistHelpers';
import { getCityInfo } from '../data/cityData';
import { getCityDisplayData } from '../utils/cityDataHelpers';

// ========== Props and Return Types ==========

interface UseChecklistPanelProps {
  /** Current filter for checklist items */
  filter: FilterType;
  /** Current conversation ID to validate checklist belongs to it */
  conversationId?: string;
  /** Active checklist ID (optional override, normally from Redux) */
  activeChecklistId?: string | null;
  /** City info override (optional, normally from Redux via cityCode) */
  cityInfo?: CityInfo;
  /** Hero image URL override */
  heroImage?: string;
  /** Title override */
  title?: string;
  /** Subtitle override */
  subtitle?: string;
  /** Callback when checklist item is toggled */
  onChecklistToggle?: (itemId: string) => void;
  /** Callback when checklist item is edited */
  onChecklistEdit?: (item: ChecklistItem) => void;
  /** Callback when checklist item is deleted */
  onChecklistDelete?: (itemId: string) => void;
  /** Callback when add button is clicked */
  onChecklistAdd?: () => void;
}

interface UseChecklistPanelReturn {
  // Checklist data
  activeChecklistId: string | null;
  checklistItems: ChecklistItem[];
  stats: ChecklistStats;
  itemsToRender: ChecklistItem[];
  isLoading: boolean;
  error: string | null;

  // Display data
  displayData: CityDisplayData;
  imageError: boolean;
  setImageError: (error: boolean) => void;

  // Action handlers
  handlers: ChecklistHandlers;
}

// ========== Main Hook ==========

/**
 * Unified hook for ChecklistPanel
 * Provides all state, data, and handlers needed by the panel
 *
 * @param props - Configuration and callbacks
 * @returns All data and handlers for ChecklistPanel
 */
export const useChecklistPanel = ({
  filter,
  conversationId,
  activeChecklistId: activeChecklistIdOverride,
  cityInfo: cityInfoOverride,
  heroImage,
  title,
  subtitle,
  onChecklistToggle,
  onChecklistEdit,
  onChecklistDelete,
  onChecklistAdd,
}: UseChecklistPanelProps): UseChecklistPanelReturn => {
  const dispatch = useDispatch();

  // ========== Redux State ==========

  const {
    checklists,
    activeChecklistId: activeChecklistIdFromRedux,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.checklist);

  const activeChecklistId = activeChecklistIdOverride ?? activeChecklistIdFromRedux;

  // ========== Checklist Data ==========

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
  const cityInfoFromRedux = useMemo(() => {
    if (!activeChecklist) {
      return null;
    }
    return getCityInfo(activeChecklist.cityCode as CityCode);
  }, [activeChecklist]);

  // Get all items from active checklist, sorted by order field
  const allItems = useMemo(() => {
    const items = activeChecklist?.items || [];
    // Sort by order field to ensure correct initial ordering after page refresh
    return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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

  // ========== City Display ==========

  const [imageError, setImageError] = useState(false);

  // Reset image error when city changes
  useEffect(() => {
    setImageError(false);
  }, [cityInfoFromRedux]);

  // Calculate display data with default fallback
  const displayData = useMemo(
    () =>
      getCityDisplayData(
        cityInfoFromRedux || cityInfoOverride,
        heroImage,
        title,
        subtitle,
        imageError,
      ),
    [cityInfoFromRedux, cityInfoOverride, heroImage, title, subtitle, imageError],
  );

  // ========== Action Handlers ==========

  const handleToggle = useCallback(
    (itemId: string) => {
      if (!activeChecklistId) return;

      dispatch(
        toggleChecklistItem({
          checklistId: activeChecklistId,
          itemId,
        }),
      );
      onChecklistToggle?.(itemId);
    },
    [activeChecklistId, dispatch, onChecklistToggle],
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

  // Custom debounce implementation (500ms delay)
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedReorderSaga = useCallback(
    (conversationId: string, checklistId: string, reorderedIds: string[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        dispatch(
          reorderChecklistItemsRequest({
            conversationId,
            checklistId,
            reorderedIds,
          }),
        );
      }, 500);
    },
    [dispatch],
  );

  const handleReorder = useCallback(
    (reorderedIds: string[]) => {
      if (!activeChecklistId || !conversationId) return;

      // Immediate UI update
      dispatch(
        reorderChecklistItems({
          checklistId: activeChecklistId,
          reorderedIds,
        }),
      );

      // Debounced API call (500ms)
      debouncedReorderSaga(conversationId, activeChecklistId, reorderedIds);
    },
    [activeChecklistId, conversationId, dispatch, debouncedReorderSaga],
  );

  const handleAdd = useCallback(() => {
    onChecklistAdd?.();
  }, [onChecklistAdd]);

  const handleUpdate = useCallback(
    (items: ChecklistItem[]) => {
      if (!activeChecklistId) return;

      // Batch update: update all items in sequence
      items.forEach((item) => {
        dispatch(
          updateChecklistItem({
            checklistId: activeChecklistId,
            itemId: item.id,
            updates: item,
          }),
        );
      });
    },
    [activeChecklistId, dispatch],
  );

  const handlers: ChecklistHandlers = useMemo(
    () => ({
      onToggle: handleToggle,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onReorder: handleReorder,
      onAdd: handleAdd,
      onUpdate: handleUpdate,
    }),
    [handleToggle, handleEdit, handleDelete, handleReorder, handleAdd, handleUpdate],
  );

  // ========== Return ==========

  return {
    // Checklist data
    activeChecklistId,
    checklistItems,
    stats,
    itemsToRender,
    isLoading,
    error,

    // Display data
    displayData,
    imageError,
    setImageError,

    // Action handlers
    handlers,
  };
};
