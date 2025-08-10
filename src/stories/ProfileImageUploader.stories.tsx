import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProfileImageUploader from '../components/ProfileImageUploader';

const meta: Meta<typeof ProfileImageUploader> = {
  title: 'Components/ProfileImageUploader',
  component: ProfileImageUploader,
};

export default meta;

type Story = StoryObj<typeof ProfileImageUploader>;

export const Default: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <ProfileImageUploader />
    </div>
  ),
};
