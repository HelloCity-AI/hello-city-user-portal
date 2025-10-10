/**
 * Redux Checklist Helpers
 *
 * Pure helper functions for checklist slice reducers.
 * Each function has a single responsibility.
 *
 * @module checklistHelpers
 */

import type {
  ChecklistMetadata,
  ChecklistBanner,
} from '@/compoundComponents/ChatPage/ChecklistPanel/types';

// ========== Helper Functions ==========

/**
 * Create a banner representation from full checklist metadata
 *
 * @param checklist - Full checklist metadata
 * @returns Lightweight banner for UI display
 */
export const createBannerFromChecklist = (checklist: ChecklistMetadata): ChecklistBanner => ({
  checklistId: checklist.checklistId,
  version: checklist.version,
  title: checklist.title,
  destination: checklist.destination,
  cityCode: checklist.cityCode,
  itemCount: (checklist.items ?? []).length,
  completedCount: (checklist.items ?? []).filter((i) => i.isComplete).length,
  status: checklist.status,
  createdAt: checklist.createdAt,
  isActive: false,
});

/**
 * Merge new checklist data with existing checklist
 * Priority: new items > existing items
 *
 * @param existing - Existing checklist in state (may be undefined)
 * @param incoming - New checklist data
 * @returns Merged checklist
 */
export const mergeChecklists = (
  existing: ChecklistMetadata | undefined,
  incoming: ChecklistMetadata,
): ChecklistMetadata => {
  if (!existing) {
    return incoming;
  }

  return {
    ...existing,
    ...incoming,
    items:
      incoming.items && incoming.items.length > 0
        ? incoming.items
        : existing.items,
  };
};

/**
 * Update or insert a banner in the banners array
 *
 * @param banners - Existing banners array
 * @param newBanner - New banner to upsert
 * @returns Updated banners array (mutates in place for Redux)
 */
export const upsertBanner = (
  banners: ChecklistBanner[],
  newBanner: ChecklistBanner,
): void => {
  const existingIndex = banners.findIndex(
    (b) => b.checklistId === newBanner.checklistId,
  );

  if (existingIndex >= 0) {
    // Update existing banner
    banners[existingIndex] = {
      ...banners[existingIndex],
      ...newBanner,
    };
  } else {
    // Insert new banner
    banners.push(newBanner);
  }
};

/**
 * Calculate completed count for a checklist
 *
 * @param checklist - Checklist metadata
 * @returns Number of completed items
 */
export const calculateCompletedCount = (checklist: ChecklistMetadata): number => {
  return (checklist.items ?? []).filter((i) => i.isComplete).length;
};
