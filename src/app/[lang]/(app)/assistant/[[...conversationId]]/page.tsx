'use client';

import { useState } from 'react';
import ChatMainArea from '@/compoundComponents/ChatPage/ChatMainArea';
import ChecklistPanel from '@/compoundComponents/ChatPage/ChecklistPanel';

export default function ChatPage() {
  const [isChecklistPanelCollapsed, setChecklistPanelCollapsed] = useState(true);

  return (
    <div className="flex h-screen">
      <ChatMainArea />
      <ChecklistPanel
        isCollapsed={isChecklistPanelCollapsed}
        onToggle={() => setChecklistPanelCollapsed((prev) => !prev)}
      />
    </div>
  );
}
