import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ConfirmModal } from '@/compoundComponents/Modals';
import FullStoryWrapper from '../utils/StoryWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockMessages = {
  en: {
    'confirm.button': 'Confirm',
    'cancel.button': 'Cancel',
  },
};

interface ConfirmModalDisplayProps {
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  title?: string;
  description: string;
  textAlignCenter?: boolean;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  confirmText?: string;
  cancelText?: string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  isWarning?: boolean;
}

const ConfirmModalDisplay: React.FC<ConfirmModalDisplayProps> = ({
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  description,
  textAlignCenter,
  actionAlignment = 'flex-end',
  confirmText,
  cancelText,
  buttonDisabled,
  buttonLoading,
  isWarning,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log('Modal closed');
    setOpen(false);
  };
  const handleConfirm = () => {
    console.log('Action confirmed');
    alert(isWarning ? 'Warning action confirmed!' : 'Action confirmed!');
    setOpen(false);
  };

  return (
    <FullStoryWrapper initialMessages={mockMessages}>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Open Confirm Modal
        </Button>
        <ConfirmModal
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          fullScreen={fullScreen}
          hideBackdrop={hideBackdrop}
          disableBackdropClick={disableBackdropClick}
          title={title}
          description={description}
          textAlignCenter={textAlignCenter}
          actionAlignment={actionAlignment}
          confirmText={confirmText}
          cancelText={cancelText}
          buttonDisabled={buttonDisabled}
          buttonLoading={buttonLoading}
          isWarning={isWarning}
        />
      </Box>
    </FullStoryWrapper>
  );
};

const meta: Meta<typeof ConfirmModalDisplay> = {
  title: 'CompoundComponents/Modals/ConfirmModal',
  component: ConfirmModalDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the modal',
    },
    description: {
      control: 'text',
      description: 'The description text of the modal',
    },
    textAlignCenter: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether to center align the text',
    },
    actionAlignment: {
      control: { type: 'radio' },
      options: ['flex-start', 'center', 'flex-end'],
      description: 'The alignment of action buttons',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button',
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button',
    },
    buttonDisabled: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether to disable action buttons',
    },
    buttonLoading: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether to show loading state on confirm button',
    },
    isWarning: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether this is a warning confirmation (disables backdrop click)',
    },
    maxWidth: {
      control: { type: 'select' },
      options: [false, 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The maximum width of the modal',
    },
    fullWidth: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether the modal should take full width',
    },
    fullScreen: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether the modal should be full screen',
    },
    hideBackdrop: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether to hide the backdrop',
    },
    disableBackdropClick: {
      control: { type: 'radio' },
      options: [true, false],
      description: 'Whether to disable closing on backdrop click',
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof ConfirmModalDisplay> = {
  args: {
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
  },
};

export const Warning: StoryObj<typeof ConfirmModalDisplay> = {
  args: {
    title: 'Delete Item',
    description: 'This action cannot be undone. Are you sure you want to delete this item?',
    isWarning: true,
    confirmText: 'Delete',
  },
};

export const LoadingState: StoryObj<typeof ConfirmModalDisplay> = {
  args: {
    title: 'Processing Action',
    description: 'Please wait while we process your request.',
    buttonLoading: true,
    confirmText: 'Processing...',
  },
};
