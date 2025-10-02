import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Conversation {
  conversationId: string;
  title: string;
  checklistGene: boolean;
  checklistId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

interface ConversationState {
  isLoading: boolean;
  conversations: Conversation[];
  messagesByConversation: Record<string, ChatMessage[]>;
  error: string | null;
}

const initialState: ConversationState = {
  isLoading: false,
  conversations: [],
  messagesByConversation: {},
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    cacheConversationMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: ChatMessage[];
      }>,
    ) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = messages;
    },

    clearConversationCache: (state, action: PayloadAction<string>) => {
      delete state.messagesByConversation[action.payload];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    addOrUpdateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(
        (c) => c.conversationId === action.payload.conversationId,
      );
      if (index >= 0) {
        state.conversations[index] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
      state.isLoading = false;
      state.error = null;
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((c) => c.conversationId !== action.payload);
      delete state.messagesByConversation[action.payload];
      state.isLoading = false;
      state.error = null;
    },

    fetchAllConversations: () => {},
    fetchConversation: () => {},
    updateConversation: () => {},
    deleteConversation: () => {},
  },
});

export const {
  setConversations,
  cacheConversationMessages,
  clearConversationCache,
  setLoading,
  setError,
  addOrUpdateConversation,
  removeConversation,
  fetchAllConversations,
  fetchConversation,
  updateConversation,
  deleteConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
