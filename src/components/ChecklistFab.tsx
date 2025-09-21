'use client';

import React, { useState } from 'react';
import { Fab } from '@mui/material';
import { CheckBox as CheckBoxIcon } from '@mui/icons-material';
import { useUser } from '@auth0/nextjs-auth0';
import { ChecklistModal } from '../compoundComponents/Modals/ChecklistModal';

export const ChecklistFab: React.FC = () => {
  const { user } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 只在用户登录时显示
  if (!user) {
    return null;
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="open checklist"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <CheckBoxIcon />
      </Fab>

      <ChecklistModal open={drawerOpen} onClose={() => setDrawerOpen(false)} variant="drawer" />
    </>
  );
};
