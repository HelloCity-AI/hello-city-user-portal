import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { InfoModal } from '@/compoundComponents/Modals';
import FullStoryWrapper from '../utils/StoryWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

const mockMessages = {
  en: {
    'info.button': 'Got it',
  },
};

interface InfoModalDisplayProps {
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
  buttonDisabled?: boolean;
}

const InfoModalDisplay: React.FC<InfoModalDisplayProps> = ({
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  description,
  textAlignCenter,
  actionAlignment = 'center',
  confirmText,
  buttonDisabled,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log('Info modal acknowledged');
    setOpen(false);
  };

  return (
    <FullStoryWrapper initialMessages={mockMessages}>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Open Info Modal
        </Button>
        <InfoModal
          open={open}
          onClose={handleClose}
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
          buttonDisabled={buttonDisabled}
        />
      </Box>
    </FullStoryWrapper>
  );
};

const meta: Meta<typeof InfoModalDisplay> = {
  title: 'CompoundComponents/Modals/InfoModal',
  component: InfoModalDisplay,
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
      control: { type: 'boolean' },
      description: 'Whether to center align the text',
    },
    actionAlignment: {
      control: { type: 'radio' },
      options: ['flex-start', 'center', 'flex-end'],
      description: 'The alignment of the action button',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirmation button',
    },
    buttonDisabled: {
      control: { type: 'boolean' },
      description: 'Whether to disable the action button',
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
      control: { type: 'boolean' },
      description: 'Whether to disable closing on backdrop click',
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof InfoModalDisplay> = {
  args: {
    description: 'Here is some important information for you to review.',
    textAlignCenter: true,
  },
};
