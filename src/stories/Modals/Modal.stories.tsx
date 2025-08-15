import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@/components/Modal';
import { ThemeStoryWrapper } from '../utils/StoryWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface ModalDisplayProps {
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  children?: React.ReactNode;
}

const ModalDisplay: React.FC<ModalDisplayProps> = ({
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeStoryWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Open Modal
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          fullScreen={fullScreen}
          hideBackdrop={hideBackdrop}
          disableBackdropClick={disableBackdropClick}
        >
          {children}
        </Modal>
      </Box>
    </ThemeStoryWrapper>
  );
};

const meta: Meta<typeof ModalDisplay> = {
  title: 'Components/ModalDisplay',
  component: ModalDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
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
    children: {
      control: false,
      description: 'The content to display inside the modal',
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof ModalDisplay> = {
  args: {
    maxWidth: 'sm',
    fullWidth: true,
    fullScreen: false,
    hideBackdrop: false,
    disableBackdropClick: false,
    children: (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Modal Content
        </Typography>
        <Typography>
          This is the fundamental Modal component. All content inside the Modal is passed through
          the children prop. Use the controls below to explore different configurations.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" size="small">
            Custom Action
          </Button>
          <Button variant="contained" size="small">
            Primary Action
          </Button>
        </Box>
      </Box>
    ),
  },
};
