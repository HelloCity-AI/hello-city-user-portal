import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from '@/components/Modal';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  ModalProps,
  ConfirmModalProps,
  FormModalProps,
  CustomModalProps,
} from '@/types/Modal.types';
import { Typography } from '@mui/material';

interface ModalDisplayProps {
  mode: 'confirm' | 'form' | 'custom';
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  title?: string;
  textAlignCenter?: boolean;
  description?: string;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  confirmText?: string;
  cancelText?: string;
  submitText?: string;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
}

interface FormModalChildrenProps {
  formData: {
    name: string;
    email: string;
    message: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      message: string;
    }>
  >;
}

const FormModalChildren: React.FC<FormModalChildrenProps> = ({ formData, setFormData }) => {
  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange('name')}
        variant="outlined"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        placeholder="Enter your email"
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
        placeholder="Enter your message"
        value={formData.message}
        onChange={handleChange('message')}
        variant="outlined"
      />
    </Box>
  );
};

const CustomModalChildren = (
  <Box sx={{ mt: 2, p: 2 }}>
    <Typography variant="h4">This title is controlled by children</Typography>
    <Typography variant="body1">This subscription is controlled by children</Typography>
    <Box sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
      <h3>Custom Content Section 1</h3>
      <p>This is a custom modal with arbitrary content.</p>
    </Box>
    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <h3>Custom Content Section 2</h3>
      <p>You can put any React components here.</p>
      <Button variant="outlined" size="small" sx={{ mt: 1 }}>
        Custom Button
      </Button>
    </Box>
  </Box>
);

const ModalDisplay: React.FC<ModalDisplayProps> = ({
  mode = 'custom',
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  textAlignCenter,
  description,
  actionAlignment,
  confirmText,
  cancelText,
  submitText,
  buttonDisabled,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };
  const handleConfirm = () => {
    alert('Confirmed!');
    setOpen(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    const formDetails = `Form Data:
Name: ${formData.name || '(empty)'}
Email: ${formData.email || '(empty)'}
Message: ${formData.message || '(empty)'}`;
    alert(formDetails);
    setOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const renderModalByMode = (): ModalProps => {
    const baseProps = {
      open,
      onClose: handleClose,
      maxWidth,
      fullWidth,
      fullScreen,
      hideBackdrop,
      disableBackdropClick,
      title,
      textAlignCenter,
    };

    switch (mode) {
      case 'confirm':
        return {
          ...baseProps,
          mode: 'confirm',
          description,
          actionAlignment,
          onConfirm: handleConfirm,
          confirmText,
          cancelText,
          buttonDisabled,
        } as ConfirmModalProps;

      case 'form':
        return {
          ...baseProps,
          mode: 'form',
          description,
          onSubmit: handleSubmit,
          submitText,
          cancelText,
          buttonDisabled,
          children: <FormModalChildren formData={formData} setFormData={setFormData} />,
        } as FormModalProps;

      case 'custom':
        return {
          ...baseProps,
          mode: 'custom',
          description,
          children,
        } as CustomModalProps;

      default:
        return baseProps as ModalProps;
    }
  };

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
      <Button variant="contained" onClick={handleOpen}>
        Open {`${mode}`} Modal
      </Button>
      <Modal {...renderModalByMode()} />
      <Typography variant="subtitle2" textAlign={'center'}>
        Displayed when mode = {`${mode}`}
        {buttonDisabled && mode !== 'custom' && ' (buttons disabled)'}
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof ModalDisplay> = {
  title: 'Components/ModalDisplay',
  component: ModalDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: false,
      description: 'The mode of the modal (confirm/form/custom)',
    },
    title: {
      control: 'text',
      description: 'The title of the modal',
    },
    description: {
      control: 'text',
      description: 'The description text of the modal',
    },
    textAlignCenter: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether to center align the text of title and description',
    },
    actionAlignment: {
      control: { type: 'radio', inline: true },
      options: ['flex-start', 'center', 'flex-end'],
      description: 'The alignment of action buttons (confirm mode only)',
    },
    maxWidth: {
      control: { type: 'select' },
      options: [false, 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The maximum width of the modal',
    },
    fullWidth: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether the modal should take full width',
    },
    fullScreen: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether the modal should be full screen',
    },
    hideBackdrop: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether to hide the backdrop',
    },
    disableBackdropClick: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether to disable closing on backdrop click',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button',
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button',
    },
    submitText: {
      control: 'text',
      description: 'Text for the submit button (form mode only)',
    },
    buttonDisabled: {
      control: { type: 'radio', inline: true },
      options: [true, false],
      description: 'Whether to disable action buttons (confirm and form modes only)',
    },
    children: {
      control: false,
      description: 'Custom content for form and custom modes',
    },
  },
} satisfies Meta<typeof ModalDisplay>;

export default meta;

export const Primary: StoryObj<typeof ModalDisplay> = {
  args: {
    mode: 'custom',
    title: 'Custom Modal',
    description: 'This is a custom modal with arbitrary content.',
    children: CustomModalChildren,
  },
};

export const Confirm: StoryObj<typeof ModalDisplay> = {
  args: {
    mode: 'confirm',
    title: 'Confirm Action',
    description: 'Content and function are configured via props',
    actionAlignment: 'flex-end',
    confirmText: 'Yes, Confirm',
    cancelText: 'Cancel',
    buttonDisabled: false,
  },
};

export const Form: StoryObj<typeof ModalDisplay> = {
  args: {
    mode: 'form',
    title: 'Contact Form',
    description: 'Please fill out the form below to get in touch with us.',
    submitText: 'Send Message',
    cancelText: 'Cancel',
    buttonDisabled: false,
  },
};
