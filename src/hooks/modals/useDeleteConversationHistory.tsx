'use client';

import React, { useState } from 'react';
import { Trans } from '@lingui/react';
import { ConfirmModal } from '@/compoundComponents/Modals/ConfirmModal';

/**
 * useDeleteConfirmation
 * - Generic confirm modal hook for delete operations
 * - Supports custom title and description
 * - Includes warning styling and confirmation flow
 * - Reusable across conversation, checklist items, etc.
 */

export interface UseDeleteConfirmationProps {
  /** Callback function when delete is confirmed */
  onDelete: () => void;
  /** Modal title (i18n Trans component or string) */
  title?: React.ReactElement<typeof Trans> | string;
  /** Modal description (i18n Trans component or string) - required */
  description: React.ReactElement<typeof Trans> | string;
  /** Confirm button text (i18n Trans component or string) */
  confirmText?: React.ReactElement<typeof Trans> | string;
  /** Cancel button text (i18n Trans component or string) */
  cancelText?: React.ReactElement<typeof Trans> | string;
}

export const useDeleteConfirmation = ({
  onDelete,
  title,
  description,
  confirmText,
  cancelText,
}: UseDeleteConfirmationProps) => {
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
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleDelete}
    />
  );

  return { show, ModalNode };
};

/**
 * useDeleteConversation (backward compatibility)
 * Wrapper around useDeleteConfirmation with conversation-specific defaults
 */
const useDeleteConversation = (onDelete: () => void) => {
  return useDeleteConfirmation({
    onDelete,
    title: <Trans id="conversation.delete.title" message="Delete Conversation" />,
    description: (
      <Trans
        id="conversation.delete.description"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    ),
    confirmText: <Trans id="conversation.delete.confirm" message="Delete" />,
    cancelText: <Trans id="common.cancel" message="Cancel" />,
  });
};

export default useDeleteConversation;
