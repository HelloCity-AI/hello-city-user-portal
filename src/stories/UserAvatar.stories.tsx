import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Stack, Box, Typography } from '@mui/material';
import UserAvatar from '@/compoundComponents/UserAvatar';
import type { UserAvatarProps } from '@/compoundComponents/UserAvatar';
import type { User } from '@/types/User.types';
import type { UserState } from '@/store/slices/user';
import { AuthState } from '@/store/slices/user';

// Mock user data
const mockUserWithAvatar: User = {
  userId: '123',
  email: 'john.doe@example.com',
  avatar: '/images/default-avatar.jpg',
  gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};

const mockUserWithoutAvatar: User = {
  userId: '456',
  email: 'jane.smith@example.com',
  avatar: '',
  gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};

// Mock store creator
const createMockStore = (userData: User | null) => {
  const userState: UserState = {
    isLoading: false,
    data: userData,
    error: null,
    authStatus: userData ? AuthState.AuthenticatedWithProfile : AuthState.Unauthenticated,
  };

  return configureStore({
    reducer: {
      user: () => userState,
    },
  });
};

// Story wrapper component
interface UserAvatarStoryProps extends UserAvatarProps {
  userType: 'withAvatar' | 'withoutAvatar' | 'noUser';
}

const UserAvatarStory: React.FC<UserAvatarStoryProps> = ({ userType, ...avatarProps }) => {
  const userData =
    userType === 'withAvatar'
      ? mockUserWithAvatar
      : userType === 'withoutAvatar'
        ? mockUserWithoutAvatar
        : null;

  const store = createMockStore(userData);

  return (
    <Provider store={store}>
      <UserAvatar {...avatarProps} />
    </Provider>
  );
};

const meta: Meta<typeof UserAvatarStory> = {
  title: 'compoundComponents/UserAvatar',
  component: UserAvatarStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'number', min: 16, max: 200, step: 4 },
      description: 'Size of the avatar in pixels',
    },
    userType: {
      control: { type: 'radio' },
      options: ['withAvatar', 'withoutAvatar', 'noUser'],
      description: 'Type of user data to display',
    },
  },
} satisfies Meta<typeof UserAvatarStory>;

export default meta;
type Story = StoryObj<typeof UserAvatarStory>;

export const Primary: Story = {
  args: {
    userType: 'withAvatar',
    size: 40,
  },
};

export const UserStates: Story = {
  render: () => (
    <Stack spacing={3} sx={{ padding: '20px' }}>
      <Typography variant="h6">Different User States</Typography>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Provider store={createMockStore(mockUserWithAvatar)}>
            <UserAvatar size="2.5rem" />
          </Provider>
          <Typography>User with avatar image</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Provider store={createMockStore(mockUserWithoutAvatar)}>
            <UserAvatar size="2.5rem" />
          </Provider>
          <Typography>User without avatar (shows email initial)</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Provider store={createMockStore(null)}>
            <UserAvatar size="2.5rem" />
          </Provider>
          <Typography>No user data</Typography>
        </Box>
      </Stack>
    </Stack>
  ),
};
