import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProfileImageUploader from '../components/ProfileImageUploader';
import { I18nTestWrapper } from '__tests__/utils/TestWrapper';

const meta: Meta<typeof ProfileImageUploader> = {
  title: 'Components/ProfileImageUploader',
  component: ProfileImageUploader,
};

export default meta;

type Story = StoryObj<typeof ProfileImageUploader>;

export const Default: Story = {
  render: () => (
    <I18nTestWrapper>
      <div className="flex h-screen items-center justify-center">
        <ProfileImageUploader />
      </div>
    </I18nTestWrapper>
  ),
};
