import type { Meta, StoryObj } from '@storybook/react-vite';
import ContactUs from '@/app/contact-us/page';

const meta: Meta<typeof ContactUs> = {
  title: 'Pages/ContactUs',
  component: ContactUs,
};

export default meta;
type Story = StoryObj<typeof ContactUs>;

export const Default: Story = {
  render: () => <ContactUs />,
};
