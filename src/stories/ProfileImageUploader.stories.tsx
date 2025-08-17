import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FullStoryWrapper from './utils/StoryWrapper';
import ProfileImageUploader from '../components/ProfileImageUploader';

const mockMessages = {
  en: {
    'file.upload.error': 'Invalid File size or type. Please upload an image file under 5MB',
    'file.upload.progress': 'The image is uploading ...',
    'file.upload.success': 'The image is uploaded',
  },
};

const meta: Meta<typeof ProfileImageUploader> = {
  title: 'Components/ProfileImageUploader',
  component: ProfileImageUploader,
};

export default meta;

type Story = StoryObj<typeof ProfileImageUploader>;

export const Primary: Story = {
  render: () => (
    <FullStoryWrapper initialMessages={mockMessages}>
      <div className="flex h-screen items-center justify-center">
        <ProfileImageUploader />
      </div>
    </FullStoryWrapper>
  ),
};
