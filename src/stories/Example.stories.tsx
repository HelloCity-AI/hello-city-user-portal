import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Example from './ExamplePage'; // adjust path as needed

const meta: Meta<typeof Example> = {
  title: 'Components/ExamplePage',
  component: Example,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof Example>;

export const Primary: Story = {
  name: 'Typography + Buttons',
};
