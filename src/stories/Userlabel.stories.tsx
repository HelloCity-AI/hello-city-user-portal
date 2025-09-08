import '../app/globals.css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import UserProfileCard from '../components/UserLabel';

const meta: Meta<typeof UserProfileCard> = {
  title: 'Components/UserProfileCard',
  component: UserProfileCard,
};

export default meta;

type Story = StoryObj<typeof UserProfileCard>;

export const Primary: Story = {
  args: {
    UserName: 'John Doe',
    EmailAdress: 'jdoe',
    AvatarImg: '',
    LastJoinDate: '2025-08-04',
  },
};

export const WithAvatar: Story = {
  args: {
    UserName: 'Jane Smith',
    EmailAdress: 'jsmith',
    AvatarImg: 'https://i.pravatar.cc/150?img=3',
    LastJoinDate: '2025-08-01',
  },
};

export const MissingInfo: Story = {
  args: {},
};
