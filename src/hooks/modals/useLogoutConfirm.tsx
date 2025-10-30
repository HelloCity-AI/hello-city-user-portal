'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trans } from '@lingui/react';
import { ConfirmModal } from '@/compoundComponents/Modals/ConfirmModal';

/**
 * useLogoutConfirm
 * - Provides a confirm modal before navigating to logout.
 * - Keep as a small, reusable hook for any menu/drawer.
 */
const useLogoutConfirm = () => {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  const handleConfirm = () => {
    hide();
    window.location.href = '/auth/logout';
  };

  const ModalNode = (
    <ConfirmModal
      open={open}
      onClose={hide}
      isWarning
      title={<Trans id="Logout" message="Logout" />}
      description={
        <Trans id="Are you sure you want to log out?" message="Are you sure you want to log out?" />
      }
      confirmText={<Trans id="Logout" message="Logout" />}
      cancelText={<Trans id="cancel.button" message="Cancel" />}
      onConfirm={handleConfirm}
    />
  );

  return { show, hide, ModalNode };
};

export default useLogoutConfirm;
