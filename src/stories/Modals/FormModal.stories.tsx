import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormModal } from '@/compoundComponents/Modals';
import { FullStoryWrapper } from '../utils/StoryWrapper';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface FormModalDisplayProps {
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  title?: string;
  description?: string;
  textAlignCenter?: boolean;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  submitText?: string;
  cancelText?: string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
}

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Box>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        value={formData.name}
        onChange={handleChange('name')}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange('message')}
        variant="outlined"
        placeholder="Enter your message here..."
      />
    </Box>
  );
};

const FormModalDisplay: React.FC<FormModalDisplayProps> = ({
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  description,
  textAlignCenter,
  actionAlignment = 'flex-end',
  submitText,
  cancelText,
  buttonDisabled,
  buttonLoading,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    console.log('Form cancelled');
    setOpen(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    alert('Form submitted successfully!');
    setOpen(false);
  };

  return (
    <FullStoryWrapper>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Button variant="contained" onClick={handleOpen}>
          Open Form Modal
        </Button>
        <FormModal
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          fullScreen={fullScreen}
          hideBackdrop={hideBackdrop}
          disableBackdropClick={disableBackdropClick}
          title={title}
          description={description}
          textAlignCenter={textAlignCenter}
          actionAlignment={actionAlignment}
          submitText={submitText}
          cancelText={cancelText}
          buttonDisabled={buttonDisabled}
          buttonLoading={buttonLoading}
        >
          <SimpleForm />
        </FormModal>
      </Box>
    </FullStoryWrapper>
  );
};

const meta: Meta<typeof FormModalDisplay> = {
  title: 'CompoundComponents/Modals/FormModal',
  component: FormModalDisplay,
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
      description: 'The alignment of action buttons',
    },
    submitText: {
      control: 'text',
      description: 'Text for the submit button',
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button',
    },
    buttonDisabled: {
      control: { type: 'boolean' },
      description: 'Whether to disable action buttons',
    },
    buttonLoading: {
      control: { type: 'boolean' },
      description: 'Whether to show loading state on submit button',
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
      description: 'Whether to disable closing on backdrop click (default: true for forms)',
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof FormModalDisplay> = {
  args: {
    title: 'Contact Form',
    description: 'Please fill out the form below to get in touch.',
  },
};

export const Loading: StoryObj<typeof FormModalDisplay> = {
  args: {
    title: 'Processing Form',
    description: 'Please wait while we process your submission.',
    buttonLoading: true,
    submitText: 'Submitting...',
  },
};

export const Disabled: StoryObj<typeof FormModalDisplay> = {
  args: {
    title: 'Form Disabled',
    description: 'This form is currently disabled.',
    buttonDisabled: true,
  },
};
