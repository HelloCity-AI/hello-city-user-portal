'use client';

import { useState, useEffect } from 'react';
import ChatMainArea from '@/compoundComponents/ChatPage/ChatMainArea';
import ChatMainContentContainer from '@/components/AppPageSections/ChatMainContentContainer';
import ChecklistPanel from '@/compoundComponents/ChatPage/ChecklistPanel';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationMessages } from '@/store/slices/conversation';
import { addChecklist } from '@/store/slices/checklist';
import { type RootState } from '@/store';
import type { UIMessage } from 'ai';
import type { ChecklistMetadata } from '@/types/checklist.types';
import MessageSkeleton from '@/compoundComponents/ChatPage/ChatMainArea/components/ui/MessageSkeleton';

export default function ChatPage() {
  // Start with panel expanded for testing
  const [isChecklistPanelCollapsed, setChecklistPanelCollapsed] = useState(false);
  const params = useParams();
  const conversationId = params.conversationId?.[0] || 'test-conversation-id';
  const dispatch = useDispatch();

  const cachedMessages = useSelector((state: RootState) =>
    conversationId ? state.conversation.messagesByConversation[conversationId] : undefined,
  );
  const loadingMessageConversationIds = useSelector(
    (state: RootState) => state.conversation.loadingMessageConversationIds,
  );

  // Load mock checklist data for testing
  useEffect(() => {
    const mockChecklist: ChecklistMetadata = {
      checklistId: 'test-checklist-1',
      conversationId: conversationId,
      version: 1,
      title: 'Moving to Sydney Checklist',
      summary: 'Complete guide for relocating to Sydney, Australia',
      destination: 'Sydney',
      duration: '6 months',
      stayType: 'longTerm',
      cityCode: 'sydney',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          title: 'Apply for Australian Visa',
          description: 'Research visa requirements and submit application',
          importance: 'high',
          dueDate: '2025-11-01',
          category: 'Immigration',
          order: 0,
          isComplete: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-2',
          title: 'Book Flight Tickets',
          description: 'Compare prices and book flights to Sydney',
          importance: 'high',
          dueDate: '2025-11-15',
          category: 'Travel',
          order: 1,
          isComplete: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-3',
          title: 'Find Temporary Accommodation',
          description: 'Book Airbnb or hotel for first 2 weeks',
          importance: 'high',
          dueDate: '2025-11-20',
          category: 'Housing',
          order: 2,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-4',
          title: 'Open Bank Account',
          description: 'Set up Australian bank account (Commonwealth, ANZ, or NAB)',
          importance: 'high',
          dueDate: '2025-12-01',
          category: 'Finance',
          order: 3,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-5',
          title: 'Get Australian SIM Card',
          description: 'Purchase Telstra, Optus, or Vodafone SIM',
          importance: 'medium',
          dueDate: '2025-12-01',
          category: 'Communication',
          order: 4,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-6',
          title: 'Apply for Tax File Number (TFN)',
          description: 'Register with Australian Taxation Office',
          importance: 'high',
          dueDate: '2025-12-05',
          category: 'Legal',
          order: 5,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-7',
          title: 'Search for Long-term Housing',
          description: 'View apartments in CBD, Surry Hills, or Bondi',
          importance: 'high',
          dueDate: '2025-12-10',
          category: 'Housing',
          order: 6,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-8',
          title: 'Get Opal Card',
          description: 'Purchase transport card for trains, buses, and ferries',
          importance: 'medium',
          dueDate: '2025-12-01',
          category: 'Transport',
          order: 7,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-9',
          title: 'Register with Medicare',
          description: 'Apply for health insurance coverage',
          importance: 'high',
          dueDate: '2025-12-15',
          category: 'Health',
          order: 8,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-10',
          title: 'Connect Utilities',
          description: 'Set up electricity, gas, and internet',
          importance: 'medium',
          dueDate: '2025-12-20',
          category: 'Housing',
          order: 9,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-11',
          title: 'Explore Neighborhood',
          description: 'Visit local supermarkets, cafes, and parks',
          importance: 'low',
          dueDate: '2025-12-25',
          category: 'Lifestyle',
          order: 10,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-12',
          title: 'Join Community Groups',
          description: 'Find expat meetups and local communities',
          importance: 'low',
          dueDate: '2026-01-01',
          category: 'Social',
          order: 11,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-13',
          title: 'Update Address Records',
          description: 'Notify banks, employers, and family of new address',
          importance: 'medium',
          dueDate: '2025-12-30',
          category: 'Administration',
          order: 12,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-14',
          title: 'Get Australian Drivers License',
          description: 'Convert overseas license or take driving test',
          importance: 'medium',
          dueDate: '2026-01-15',
          category: 'Transport',
          order: 13,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'item-15',
          title: 'Visit Bondi Beach',
          description: 'Experience iconic Sydney beach and coastal walk',
          importance: 'low',
          dueDate: '2026-01-05',
          category: 'Lifestyle',
          order: 14,
          isComplete: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    dispatch(addChecklist(mockChecklist));
  }, [conversationId, dispatch]);

  // Fetch messages (saga handles caching with 5-minute TTL)
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  const initialMessages: UIMessage[] | undefined = cachedMessages?.map((msg) => ({
    id: msg.id,
    role: msg.role,
    // Use msg.parts if available, fallback to content-only for backward compatibility
    parts: (msg.parts && msg.parts.length > 0
      ? msg.parts
      : [{ type: 'text' as const, text: msg.content }]) as UIMessage['parts'],
  }));

  // Only show skeleton when actively loading this conversation's messages
  const isLoadingMessages = conversationId
    ? loadingMessageConversationIds.includes(conversationId)
    : false;
  const shouldRenderChat = !isLoadingMessages;

  const handleOpenChecklist = () => {
    setChecklistPanelCollapsed(false);
  };

  return (
    <div className="flex h-screen">
      {shouldRenderChat ? (
        <ChatMainArea
          conversationId={conversationId}
          initialMessages={initialMessages}
          onBannerClick={handleOpenChecklist}
        />
      ) : (
        <ChatMainContentContainer>
          <div className="flex-1 overflow-y-auto">
            <MessageSkeleton />
          </div>
        </ChatMainContentContainer>
      )}
      <ChecklistPanel
        isCollapsed={isChecklistPanelCollapsed}
        onToggle={() => setChecklistPanelCollapsed((prev) => !prev)}
        conversationId={conversationId}
      />
    </div>
  );
}
