import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  ChecklistMetadata,
  ChecklistBanner,
  ChecklistItem,
} from '@/compoundComponents/ChatPage/ChecklistPanel/types';
import {
  createBannerFromChecklist,
  mergeChecklists,
  upsertBanner,
  calculateCompletedCount,
} from '../helpers/checklistHelpers';

interface ChecklistState {
  // Key: checklistId
  checklists: Record<string, ChecklistMetadata>;

  // Key: conversationId, Value: array of banners
  bannersByConversation: Record<string, ChecklistBanner[]>;

  // Currently active checklist ID
  activeChecklistId: string | null;

  isLoading: boolean;
  error: string | null;
}

const initialState: ChecklistState = {
  checklists: {},
  bannersByConversation: {},
  activeChecklistId: null,
  isLoading: false,
  error: null,
};

// ========== Helper Functions (Local) ==========

/**
 * Update banner completed count for a checklist
 */
const updateBannerCompletedCount = (state: ChecklistState, checklist: ChecklistMetadata): void => {
  const { conversationId, checklistId } = checklist;
  const banner = state.bannersByConversation[conversationId]?.find(
    (b) => b.checklistId === checklistId,
  );
  if (banner) {
    banner.completedCount = calculateCompletedCount(checklist);
  }
};

/**
 * Add or update a checklist in state
 * Handles merging, banner updates, and optional activation
 */
const addOrUpdateChecklist = (
  state: ChecklistState,
  checklist: ChecklistMetadata,
  shouldActivate: boolean,
): void => {
  const { conversationId, checklistId } = checklist;

  // 1. Merge with existing checklist
  const mergedChecklist = mergeChecklists(state.checklists[checklistId], checklist);

  // 2. Update checklists dictionary
  state.checklists[checklistId] = mergedChecklist;

  // 3. Ensure banners array exists for this conversation
  if (!state.bannersByConversation[conversationId]) {
    state.bannersByConversation[conversationId] = [];
  }

  // 4. Update banner
  const banner = createBannerFromChecklist(mergedChecklist);
  upsertBanner(state.bannersByConversation[conversationId], banner);

  // 5. Optionally activate this checklist
  if (shouldActivate) {
    state.activeChecklistId = checklistId;
  }
};

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    setActiveChecklist(state, action: PayloadAction<string>) {
      state.activeChecklistId = action.payload;
    },

    addChecklist(state, action: PayloadAction<ChecklistMetadata>) {
      addOrUpdateChecklist(state, action.payload, true);
    },

    toggleChecklistItem(
      state,
      action: PayloadAction<{
        checklistId: string;
        itemId: string;
      }>,
    ) {
      const { checklistId, itemId } = action.payload;
      const checklist = state.checklists[checklistId];

      if (checklist) {
        const item = checklist.items.find((i) => i.id === itemId);
        if (item) {
          item.isComplete = !item.isComplete;
          updateBannerCompletedCount(state, checklist);
        }
      }
    },

    updateChecklistItem(
      state,
      action: PayloadAction<{
        checklistId: string;
        itemId: string;
        updates: Partial<ChecklistItem>;
      }>,
    ) {
      const { checklistId, itemId, updates } = action.payload;
      const checklist = state.checklists[checklistId];

      if (checklist) {
        const item = checklist.items.find((i) => i.id === itemId);
        if (item) {
          Object.assign(item, updates);

          // Update banner completed count if isComplete was updated
          if ('isComplete' in updates) {
            updateBannerCompletedCount(state, checklist);
          }
        }
      }
    },

    reorderChecklistItems(
      state,
      action: PayloadAction<{
        checklistId: string;
        reorderedIds: string[];
      }>,
    ) {
      const { checklistId, reorderedIds } = action.payload;
      const checklist = state.checklists[checklistId];

      if (checklist) {
        // Create a map of id -> item for quick lookup
        const itemMap = new Map(checklist.items.map((item) => [item.id, item]));

        // Reorder items based on reorderedIds array
        const reorderedItems = reorderedIds
          .map((id) => itemMap.get(id))
          .filter((item): item is ChecklistItem => item !== undefined);

        // Update order field for each item
        reorderedItems.forEach((item, index) => {
          item.order = index;
        });

        // Update checklist items array
        checklist.items = reorderedItems;
      }
    },

    clearChecklist(state, action: PayloadAction<string>) {
      const conversationId = action.payload;
      // Remove all checklists for this conversation
      const banners = state.bannersByConversation[conversationId] || [];
      banners.forEach((banner) => {
        delete state.checklists[banner.checklistId];
      });
      delete state.bannersByConversation[conversationId];
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    upsertChecklistMetadata(state, action: PayloadAction<ChecklistMetadata>) {
      addOrUpdateChecklist(state, action.payload, false);
    },
  },
});

export const {
  setActiveChecklist,
  addChecklist,
  toggleChecklistItem,
  updateChecklistItem,
  reorderChecklistItems,
  clearChecklist,
  setLoading,
  setError,
  upsertChecklistMetadata,
} = checklistSlice.actions;

export default checklistSlice.reducer;
