import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomModal } from '@/compoundComponents/Modals';
import { FullStoryWrapper } from '../utils/StoryWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface CustomModalDisplayProps {
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  title?: string;
  description?: string;
  textAlignCenter?: boolean;
}

const SimpleContent = (
  <Box sx={{ p: 2 }}>
    <Typography variant="body1" sx={{ mb: 2 }}>
      This content is controlled by the children prop. For best practices, wrap your custom content
      in DialogContent component.
    </Typography>
    <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
      <Button variant="outlined" size="small">
        Custom Action 1
      </Button>
      <Button variant="contained" size="small">
        Custom Action 2
      </Button>
    </Box>
  </Box>
);

const CustomModalDisplay: React.FC<CustomModalDisplayProps> = ({
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  description,
  textAlignCenter,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log('Custom modal closed');
    setOpen(false);
  };

  return (
    <FullStoryWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Open Custom Modal
        </Button>
        <CustomModal
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
        >
          {SimpleContent}
        </CustomModal>
      </Box>
    </FullStoryWrapper>
  );
};

const meta: Meta<typeof CustomModalDisplay> = {
  title: 'CompoundComponents/Modals/CustomModal',
  component: CustomModalDisplay,
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

export const Primary: StoryObj<typeof CustomModalDisplay> = {
  args: {
    title: 'Custom Modal',
    description:
      'Title and description are controlled by props. All content below is controlled by children prop. For best practices, wrap custom content in DialogContent component.',
  },
};
