import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  ChecklistMetadata,
  ChecklistBanner,
  ChecklistItem,
} from '@/compoundComponents/ChatPage/ChecklistPanel/types';

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

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    setActiveChecklist(state, action: PayloadAction<string>) {
      state.activeChecklistId = action.payload;
    },

    addChecklist(state, action: PayloadAction<ChecklistMetadata>) {
      const checklist = action.payload;

      // Store full checklist
      state.checklists[checklist.checklistId] = checklist;

      // Create banner
      const conversationId = checklist.conversationId;
      if (!state.bannersByConversation[conversationId]) {
        state.bannersByConversation[conversationId] = [];
      }

      const banner: ChecklistBanner = {
        checklistId: checklist.checklistId,
        version: checklist.version,
        title: checklist.title,
        destination: checklist.destination,
        cityCode: checklist.cityCode,
        itemCount: checklist.items.length,
        completedCount: checklist.items.filter((i) => i.isComplete).length,
        createdAt: checklist.createdAt,
        isActive: false,
      };

      state.bannersByConversation[conversationId].push(banner);

      // Auto-activate latest version
      state.activeChecklistId = checklist.checklistId;
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
          // Toggle isComplete
          item.isComplete = !item.isComplete;

          // Update banner completed count
          const conversationId = checklist.conversationId;
          const banner = state.bannersByConversation[conversationId]?.find(
            (b) => b.checklistId === checklistId,
          );
          if (banner) {
            banner.completedCount = checklist.items.filter((i) => i.isComplete).length;
          }
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
            const conversationId = checklist.conversationId;
            const banner = state.bannersByConversation[conversationId]?.find(
              (b) => b.checklistId === checklistId,
            );
            if (banner) {
              banner.completedCount = checklist.items.filter((i) => i.isComplete).length;
            }
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
} = checklistSlice.actions;

export default checklistSlice.reducer;
