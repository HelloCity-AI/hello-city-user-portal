import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button, Stack, Box } from '@mui/material';

interface ButtonDisplayProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  background?: boolean;
}

const ButtonDisplay: React.FC<ButtonDisplayProps> = ({
  variant,
  disabled = false,
  background = false,
}) => {
  const content = (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: '20px' }}
    >
      <Button variant={variant} disabled={disabled}>
        {`${variant} button ${disabled ? 'disabled' : 'active'}`}
      </Button>
    </Stack>
  );

  return background ? (
    <Box sx={{ backgroundColor: '#292929', padding: 4 }}>{content}</Box>
  ) : (
    content
  );
};

const meta: Meta<typeof ButtonDisplay> = {
  title: 'Components/ButtonDisplay',
  component: ButtonDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
    },
    disabled: {
      control: 'boolean',
    },
    background: {
      control: 'boolean',
      description: 'Show background square (e.g., for tertiary)',
    },
  },
} satisfies Meta<typeof ButtonDisplay>;
export default meta;
type Story = StoryObj<typeof ButtonDisplay>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    disabled: false,
    background: false,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    disabled: false,
    background: false,
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    disabled: false,
    background: true,
  },
};
