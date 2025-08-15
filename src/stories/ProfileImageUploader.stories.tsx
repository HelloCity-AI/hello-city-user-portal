import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { I18nProvider } from '../contexts/I18nProvider';

import ProfileImageUploader from '../components/ProfileImageUploader';

// Simple wrapper without LanguageProvider to avoid useRouter issues
const StorybookI18nWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockMessages = {
    en: {
      'file.upload.error': 'Invalid File size or type. Please upload an image file under 5MB',
      'file.upload.progress': 'The image is uploading ...',
      'file.upload.success': 'The image is uploaded',
    },
  };

  return (
    <I18nProvider initialLocale="en" initialMessages={mockMessages}>
      {children}
    </I18nProvider>
  );
};

const meta: Meta<typeof ProfileImageUploader> = {
  title: 'Components/ProfileImageUploader',
  component: ProfileImageUploader,
};

export default meta;

type Story = StoryObj<typeof ProfileImageUploader>;

export const Default: Story = {
  render: () => (
    <StorybookI18nWrapper>
      <div className="flex h-screen items-center justify-center">
        <ProfileImageUploader />
      </div>
    </StorybookI18nWrapper>
  ),
};
