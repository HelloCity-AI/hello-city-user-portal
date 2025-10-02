'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import ChatSidebar from '@/compoundComponents/ChatPage/ChatSidebar';
import SectionBackground from '@/components/AppPageSections/SectionBackground';
import type { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { fetchAllConversations } from '@/store/slices/conversation';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.data?.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllConversations());
    }
  }, [dispatch, userId]);

  return (
    <Box
      className="flex h-screen w-screen overflow-hidden"
      sx={{ contain: 'layout size', isolation: 'isolate' }}
    >
      <SectionBackground />
      {/* Main layout */}
      <Box className="relative z-10 flex h-full w-full">
        <ChatSidebar />

        {/* Main content area - children will be rendered here */}
        <Box className="flex-1">{children}</Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
