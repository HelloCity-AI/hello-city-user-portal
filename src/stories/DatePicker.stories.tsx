// File: src/components/DatePicker.stories.tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
import { Trans } from '@lingui/react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { messages as enMessages } from '@/locales/en/messages.js';
import { messages as zhMessages } from '@/locales/zh/messages';

// 初始化 i18n
i18n.load({
  en: enMessages,
  zh: zhMessages,
});
i18n.activate('en');

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<dayjs.Dayjs | null>(dayjs());
    return (
      <I18nProvider i18n={i18n}>
        <DatePicker label={<Trans>Pick a date</Trans>} value={value} onChange={setValue} />
      </I18nProvider>
    );
  },
};
