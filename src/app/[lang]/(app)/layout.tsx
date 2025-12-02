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
import { clearError as clearUserError } from '@/store/slices/user';
import RouteGate from '../../../components/RouteGate';
import { useSelectedLayoutSegments } from 'next/navigation';
import { AuthState, fetchUser } from '@/store/slices/user';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.data?.userId);
  const authStatus = useSelector((s: RootState) => s.user.authStatus);

  const userError = useSelector((state: RootState) => state.user.error);
  const conversationError = useSelector((state: RootState) => state.conversation.error);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const segments = useSelectedLayoutSegments();
  const isCreateProfilePage = segments[0] === 'create-user-profile';

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllConversations());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (authStatus === AuthState.AuthenticatedWithProfile && !userId) {
      dispatch(fetchUser());
    }
  }, [authStatus, userId, dispatch]);

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
      if (userError) dispatch(clearUserError());
      if (conversationError) dispatch(setConversationError(null));
      setSnackbarOpen(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [userError, conversationError, dispatch]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    if (userError) dispatch(clearUserError());
    if (conversationError) dispatch(setConversationError(null));
  };

  return (
    <RouteGate
      requireProfile={!isCreateProfilePage}
      redirectIfHasProfile
      suspendUntilReady
      loadingFallback={null}
      autoFetch
    >
      <>
        <Box
          className="flex h-screen w-screen overflow-hidden"
          sx={{ contain: 'layout size', isolation: 'isolate' }}
        >
          <SectionBackground />
          <Box className="relative z-10 flex h-full w-full">
            {!isCreateProfilePage && <ChatSidebar />}
            <Box className="flex-1">{children}</Box>
          </Box>
        </Box>

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
    </RouteGate>
  );
};

export default AppLayout;
