import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import InputBox from '@/components/InputBox';
import { Trans, I18nProvider } from '@lingui/react';
import { i18n } from '@/i18n';
import enMessages from '@/locales/en/messages.js';
import zhMessages from '@/locales/zh/messages.js';

i18n.load({
  en: enMessages,
  zh: zhMessages,
});
i18n.activate('zh');

const meta: Meta<typeof InputBox> = {
  title: 'InputBox',
  component: InputBox,
  decorators: [
    (Story) => (
      <I18nProvider i18n={i18n}>
        <Story />
      </I18nProvider>
    ),
  ],
};

export default meta;

export const Name: React.FC = () => {
  const [name, setName] = useState('');
  return (
    <InputBox
      label={<Trans id="Name">Name</Trans>}
      fieldType="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  );
};

export const Phone: React.FC = () => {
  const [phone, setPhone] = useState('');
  return (
    <InputBox
      label={<Trans id="Phone">Phone</Trans>}
      fieldType="phone"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required
    />
  );
};

export const Email: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<React.ReactNode>('');

  const validateEmail = (value: string) => {
    if (!value) {
      setError('');
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setError(
        <Trans id="Please enter a valid email address.">Please enter a valid email address.</Trans>,
      );
    } else {
      setError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    validateEmail(val);
  };

  return (
    <InputBox
      label={<Trans id="Email">Email</Trans>}
      fieldType="email"
      value={email}
      onChange={handleChange}
      required
      errorMessage={error}
    />
  );
};

export const Passwords: React.FC = () => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <>
      <InputBox
        label={<Trans id="Password">Password</Trans>}
        fieldType="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <InputBox
        label={<Trans id="Repeat Password">Repeat Password</Trans>}
        fieldType="repeatPassword"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        originalPassword={password}
        required
      />
    </>
  );
};
