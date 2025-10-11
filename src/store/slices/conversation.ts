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
  parts?: Array<{
    type: string;
    text?: string;
    id?: string;
    data?: unknown; // For data-checklist parts
  }>;
  createdAt?: string;
}

export interface TaskInfo {
  taskId: string;
  conversationId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  startedAt: number;
}

interface ConversationState {
  /** Whether the conversation list is currently being fetched */
  isLoading: boolean;
  /** Whether the conversation list has been fetched at least once */
  hasFetched: boolean;
  /** Array of all user conversations */
  conversations: Conversation[];
  /** Array of conversation IDs currently loading messages (used for skeleton display) */
  loadingConversationIds: string[];
  /** Cached messages by conversation ID (5-minute TTL) */
  messagesByConversation: Record<string, MessageDto[]>;
  /** Cache timestamps for TTL validation (5-minute expiry) */
  cacheTimestamps: Record<string, number>;
  /** Pending messages to be sent after conversation creation (conversationId -> message) */
  pendingMessages: Record<string, string>;
  /** Active tasks being polled (taskId -> TaskInfo) */
  activeTasks: Record<string, TaskInfo>;
  /** Error message from failed operations */
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
  activeTasks: {},
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

    addActiveTask: (
      state,
      action: PayloadAction<{ taskId: string; conversationId: string; status: string }>,
    ) => {
      const { taskId, conversationId, status } = action.payload;
      state.activeTasks[taskId] = {
        taskId,
        conversationId,
        status: status as TaskInfo['status'],
        startedAt: Date.now(),
      };
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: TaskInfo['status'] }>,
    ) => {
      const { taskId, status } = action.payload;
      if (state.activeTasks[taskId]) {
        state.activeTasks[taskId].status = status;
      }
    },

    removeTask: (state, action: PayloadAction<string>) => {
      delete state.activeTasks[action.payload];
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
  addActiveTask,
  updateTaskStatus,
  removeTask,
  fetchAllConversations,
  fetchConversationMessages,
  updateConversation,
  deleteConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
