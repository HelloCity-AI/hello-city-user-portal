'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ChatSidebar from '@/compoundComponents/ChatPage/ChatSidebar';
import SectionBackground from '@/components/AppPageSections/SectionBackground';
import type { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import {
  fetchAllConversations,
  setError as setConversationError,
} from '@/store/slices/conversation';
import { setError as setUserError } from '@/store/slices/user';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.data?.userId);

  // Only handle fetchUser and conversation errors in AppLayout
  const userError = useSelector((state: RootState) => state.user.error);
  const conversationError = useSelector((state: RootState) => state.conversation.error);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllConversations());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const error = userError || conversationError;

    if (!error) {
      setSnackbarOpen(false);
      setErrorMessage(null);
      return;
    }

    setErrorMessage(error);
    setSnackbarOpen(true);

    const timer = setTimeout(() => {
      if (userError) dispatch(setUserError(null));
      if (conversationError) dispatch(setConversationError(null));
      setSnackbarOpen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [userError, conversationError, dispatch]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (userError) dispatch(setUserError(null));
    if (conversationError) dispatch(setConversationError(null));
  };

  return (
    <>
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

      {/* Global error notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppLayout;
