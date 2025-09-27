'use client';

import React, { useState } from 'react';
import { Button, Fab } from '@mui/material';
import type { ButtonProps, FabProps } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Trans } from '@lingui/react';
import { CreateChecklistItemModal } from '@/compoundComponents/Modals/CreateChecklistItemModal';
import { checklistApi } from '@/api/checklistApi';
import type { CreateChecklistItemRequest } from '@/types/checkList.types';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
interface CreateChecklistItemButtonProps {
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
  onItemCreated,
  variant = 'button',
  size = 'medium',
  color = 'primary',
  disabled = false,
  children,
  fullWidth = true,
  sx,
}) => {
  const userId = useSelector((state: RootState) => state.user.data?.userId);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CreateChecklistItemRequest>({
    ownerId: userId || '',
    title: '',
    description: '',
    isComplete: false,
    importance: 'Low',
    dueDate: null,
  });

  const handleSubmit = async (data: CreateChecklistItemRequest) => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    try {
      await checklistApi.createChecklistItem(userId, data);
      setModalOpen(false);
      setForm({ ...form, title: '', description: '', dueDate: dayjs() });
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

      {/* only show modal when open */}
      <CreateChecklistItemModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        userId={userId ?? ''}
      />
    </>
  );
};
