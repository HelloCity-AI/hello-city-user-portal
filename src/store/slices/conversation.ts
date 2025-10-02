import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Conversation {
  conversationId: string;
  title: string;
  checklistGene?: boolean;
  checklistId?: string;
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
  loadingConversationIds: string[];
  messagesByConversation: Record<string, ChatMessage[]>;
  error: string | null;
}

const initialState: ConversationState = {
  isLoading: false,
  conversations: [],
  loadingConversationIds: [],
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

    setConversationsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },

    setConversationLoading: (
      state,
      action: PayloadAction<{ conversationId: string; isLoading: boolean }>,
    ) => {
      const { conversationId, isLoading } = action.payload;
      if (isLoading) {
        if (!state.loadingConversationIds.includes(conversationId)) {
          state.loadingConversationIds.push(conversationId);
        }
      } else {
        state.loadingConversationIds = state.loadingConversationIds.filter(
          (id) => id !== conversationId,
        );
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setConversationTitle: (
      state,
      action: PayloadAction<{ conversationId: string; title: string }>,
    ) => {
      const { conversationId, title } = action.payload;
      const conversation = state.conversations.find((con) => con.conversationId === conversationId);
      if (conversation) conversation.title = title;
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((c) => c.conversationId !== action.payload);
      delete state.messagesByConversation[action.payload];
      state.isLoading = false;
      state.error = null;
    },

    fetchAllConversations: () => {},
    fetchConversation: (_state, _action: PayloadAction<string>) => {},
    updateConversation: (_state, _action: PayloadAction<{ id: string; title: string }>) => {},
    deleteConversation: (_state, _action: PayloadAction<string>) => {},
  },
});

export const {
  setConversations,
  cacheConversationMessages,
  clearConversationCache,
  setConversationsLoading,
  setConversationLoading,
  setError,
  setConversationTitle,
  removeConversation,
  fetchAllConversations,
  fetchConversation,
  updateConversation,
  deleteConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
