'use client';

import { useState } from 'react';
import { Trans } from '@lingui/react';
import { ConfirmModal } from '@/compoundComponents/Modals/ConfirmModal';

/**
 * useDeleteConversation
 * - Provides a confirm modal for deleting conversations.
 * - Includes warning styling and confirmation flow.
 * - Reusable hook for conversation management features.
 */

const useDeleteConversation = (onDelete: () => void) => {
  const [open, setOpen] = useState(false);

  const show = () => setOpen(true);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  const ModalNode = (
    <ConfirmModal
      open={open}
      onClose={() => setOpen(false)}
      isWarning
      title={<Trans id="conversation.delete.title" message="Delete Conversation" />}
      description={
        <Trans
          id="conversation.delete.description"
          message="Are you sure you want to delete this conversation? This action cannot be undone."
        />
      }
      confirmText={<Trans id="conversation.delete.confirm" message="Delete" />}
      cancelText={<Trans id="common.cancel" message="Cancel" />}
      onConfirm={handleDelete}
    />
  );

  return { show, ModalNode };
};

export default useDeleteConversation;
