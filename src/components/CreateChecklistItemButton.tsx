'use client';

import React, { useState } from 'react';
import { Button, Fab } from '@mui/material';
import type { ButtonProps, FabProps } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Trans } from '@lingui/react';
import { CreateChecklistItemModal } from '@/compoundComponents/Modals/CreateChecklistItemModal';
import { checklistApi } from '@/api/checklistApi';
import type { ChecklistItem } from '@/types/checklist.types';
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
  const [form, setForm] = useState<Partial<ChecklistItem>>({
    id: '',
    title: '',
    description: '',
    isComplete: false,
    importance: 'low',
    dueDate: undefined,
    order: 0,
    createdAt: '',
  });

  const handleSubmit = async (data: Partial<ChecklistItem>) => {
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    try {
      await checklistApi.createChecklistItem(userId, data);
      setModalOpen(false);
      setForm({ ...form, title: '', description: '', dueDate: undefined });
      onItemCreated?.();
    } catch (error) {
      console.error('Failed to create checklist item:', error);
      throw error;
    }
  };

  return (
    <>
      {variant === 'fab' ? (
        <Fab
          color={color as FabProps['color']}
          size={size as FabProps['size']}
          disabled={disabled}
          onClick={() => setModalOpen(true)}
          sx={sx}
          aria-label="add checklist item"
        ></Fab>
      ) : (
        <Button
          variant="contained"
          color={color}
          size={size}
          disabled={disabled}
          onClick={() => setModalOpen(true)}
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
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        userId={userId ?? ''}
      />
    </>
  );
};
