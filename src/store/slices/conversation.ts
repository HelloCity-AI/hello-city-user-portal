import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Conversation {
  conversationId: string;
  title: string;
  checklistGene?: boolean;
  checklistId?: string;
}

export interface MessageDto {
  id: string;
  messageType: string; // 'Questions' | 'Answer' | Summary'
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

interface ConversationState {
  isLoading: boolean;
  hasFetched: boolean;
  conversations: Conversation[];
  loadingConversationIds: string[];
  messagesByConversation: Record<string, MessageDto[]>;
  cacheTimestamps: Record<string, number>;
  pendingMessages: Record<string, string>;
  error?: string | null;
}

const initialState: ConversationState = {
  isLoading: false,
  hasFetched: false,
  conversations: [],
  loadingConversationIds: [],
  messagesByConversation: {},
  cacheTimestamps: {},
  pendingMessages: {},
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoading = false;
      state.hasFetched = true;
      state.error = null;
    },

    cacheConversationMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: MessageDto[];
      }>,
    ) => {
      const { conversationId, messages } = action.payload;
      state.messagesByConversation[conversationId] = messages;
      state.cacheTimestamps[conversationId] = Date.now();
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
      delete state.cacheTimestamps[action.payload];
      state.isLoading = false;
      state.error = null;
    },

    addConversationOptimistic: (state, action: PayloadAction<Conversation>) => {
      // 乐观更新：立即添加到列表顶部
      state.conversations.unshift(action.payload);
    },

    setPendingMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: string }>,
    ) => {
      const { conversationId, message } = action.payload;
      state.pendingMessages[conversationId] = message;
    },

    clearPendingMessage: (state, action: PayloadAction<string>) => {
      delete state.pendingMessages[action.payload];
    },

    invalidateConversationCache: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      delete state.messagesByConversation[conversationId];
      delete state.cacheTimestamps[conversationId];
    },

    fetchAllConversations: () => {},
    fetchConversationMessages: (_state, _action: PayloadAction<string>) => {},
    updateConversation: (_state, _action: PayloadAction<{ id: string; title: string }>) => {},
    deleteConversation: (_state, _action: PayloadAction<string>) => {},
  },
});

export const {
  setConversations,
  cacheConversationMessages,
  setConversationsLoading,
  setConversationLoading,
  setError,
  setConversationTitle,
  removeConversation,
  addConversationOptimistic,
  setPendingMessage,
  clearPendingMessage,
  invalidateConversationCache,
  fetchAllConversations,
  fetchConversationMessages,
  updateConversation,
  deleteConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
