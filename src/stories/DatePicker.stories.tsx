import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
import { t } from '@lingui/macro';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs());
    return <DatePicker label={t`Pick a date`} value={value} onChange={setValue} />;
  },
};
