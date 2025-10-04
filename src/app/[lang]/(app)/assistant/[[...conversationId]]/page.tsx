'use client';

import { useState } from 'react';
import ChatMainArea from '@/compoundComponents/ChatPage/ChatMainArea';
import ChecklistPanel from '@/compoundComponents/ChatPage/ChecklistPanel';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const [isChecklistPanelCollapsed, setChecklistPanelCollapsed] = useState(true);
  const params = useParams();
  const conversationId = params.conversationId?.[0];

  return (
    <div className="flex h-screen">
      <ChatMainArea conversationId={conversationId} />
      <ChecklistPanel
        isCollapsed={isChecklistPanelCollapsed}
        onToggle={() => setChecklistPanelCollapsed((prev) => !prev)}
      />
    </div>
  );
}
