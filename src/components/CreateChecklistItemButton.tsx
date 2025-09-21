'use client';

import React, { useState } from 'react';
import { Button, Fab } from '@mui/material';
import type { ButtonProps, FabProps } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Trans } from '@lingui/react';
import { CreateChecklistItemModal } from '../compoundComponents/Modals/CreateChecklistItemModal';
import { checklistApi } from '../api/checklistApi';
import type { CreateChecklistItemRequest } from '../types/checkList.types';

interface CreateChecklistItemButtonProps {
  userId: string;
  onItemCreated?: () => void;
  variant?: 'button' | 'fab';
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  disabled?: boolean;
  children?: React.ReactNode;
  fullWidth?: boolean;
  sx?: ButtonProps['sx'] | FabProps['sx'];
}

export const CreateChecklistItemButton: React.FC<CreateChecklistItemButtonProps> = ({
  userId,
  onItemCreated,
  variant = 'button',
  size = 'medium',
  color = 'primary',
  disabled = false,
  children,
  fullWidth = true,
  sx,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (data: CreateChecklistItemRequest) => {
    try {
      await checklistApi.createChecklistItem(userId, data);
      setModalOpen(false);
      onItemCreated?.();
    } catch (error) {
      console.error('Failed to create checklist item:', error);
      throw error;
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {variant === 'fab' ? (
        <Fab
          color={color as FabProps['color']}
          size={size as FabProps['size']}
          disabled={disabled}
          onClick={handleOpenModal}
          sx={sx}
          aria-label="add checklist item"
        >
          <AddIcon />
        </Fab>
      ) : (
        <Button
          variant="contained"
          color={color}
          size={size}
          disabled={disabled}
          onClick={handleOpenModal}
          startIcon={<AddIcon />}
          fullWidth={fullWidth}
          sx={sx}
        >
          {children || <Trans id="create-checklist-button.add-item" message="Add Checklist Item" />}
        </Button>
      )}

      <CreateChecklistItemModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        userId={userId}
      />
    </>
  );
};
