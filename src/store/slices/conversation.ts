import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SimpleMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
  metadata?: unknown;
}

interface Conversation {
  conversationId: string;
  title: string;
}

interface ConversationMessage {
  conversationId: string;
  messages: SimpleMessage[] | null;
}

interface ConversationState {
  isLoading: boolean;
  conversations: Conversation[] | null;
  conversationMessages: ConversationMessage[] | null;
  error?: string | null;
}

const initialState: ConversationState = {
  isLoading: false,
  conversations: [],
  conversationMessages: null,
  error: undefined,
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
    setConversationMessages: (state, action: PayloadAction<ConversationMessage[] | null>) => {
      state.conversationMessages = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    fetchAllConversation: () => {},
    fetchConversation: () => {},
    createNewConversation: () => {},
    editConversation: () => {},
    deleteConversation: () => {},
  },
});

export const {} = conversationSlice.actions;
export default conversationSlice.reducer;
