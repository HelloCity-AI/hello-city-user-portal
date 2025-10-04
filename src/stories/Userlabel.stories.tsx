import '../app/globals.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import UserProfileCard from '../components/UserLabel';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

type UserSliceState = {
  data: any;
  isLoading: boolean;
  error: any;
};

const makeStore = (preloadedUser?: Partial<UserSliceState>) => {
  const base: UserSliceState = {
    data: null,
    isLoading: false,
    error: null,
    ...(preloadedUser ?? {}),
  };
  const userReducer = (state = base) => state;
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: base },
  });
};

const withStore = (preloadedUser?: Partial<UserSliceState>) => (Story: React.ComponentType) => {
  const store = makeStore(preloadedUser);
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

const meta: Meta<typeof UserProfileCard> = {
  title: 'Components/UserProfileCard',
  component: UserProfileCard,
  decorators: [withStore()],
  argTypes: {
    UserName: { control: 'text' },
    EmailAddress: { control: 'text' },
    AvatarImg: { control: 'text' },
    LastJoinDate: { control: 'text' },
    wrap: { control: 'boolean' },
    showTooltip: { control: 'boolean' },
    autoFetch: { control: 'boolean' },
    className: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof UserProfileCard>;

export const Primary: Story = {
  args: {
    UserName: 'John Doe',
    EmailAddress: 'jdoe@example.com',
    AvatarImg: '',
    LastJoinDate: '2025-08-04T09:30:00Z',
    showTooltip: true,
    wrap: false,
    autoFetch: false,
  },
};

export const WithAvatar: Story = {
  args: {
    UserName: 'Jane Smith',
    EmailAddress: 'jsmith@example.com',
    AvatarImg: 'https://i.pravatar.cc/150?img=3',
    LastJoinDate: '2025-08-01T14:05:00Z',
    showTooltip: true,
    wrap: false,
    autoFetch: false,
  },
};

export const MissingInfo: Story = {
  args: {
    autoFetch: false,
  },
};

export const FromStore: Story = {
  decorators: [
    withStore({
      data: {
        username: 'Leon',
        email: 'leon@example.com',
        avatarUrl: '/images/banner-image.jpeg',
        lastJoinDate: '2025-10-02T15:39:57.299403Z',
      },
      isLoading: false,
      error: null,
    }),
  ],
  args: {
    autoFetch: false,
  },
};
