import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import InputBox from '@/components/InputBox/InputBox';

const meta: Meta<typeof InputBox> = {
  title: 'Components/InputBox',
  component: InputBox,
};
export default meta;

export const Primary = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  return (
    <div className="mx-auto flex flex-col gap-4">
      <InputBox
        label="Name"
        fieldType="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <InputBox
        label="Phone"
        fieldType="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <InputBox
        label="Email"
        fieldType="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputBox
        label="Password"
        fieldType="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <InputBox
        label="Repeat Password"
        fieldType="repeatPassword"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        originalPassword={password}
        required
      />
    </div>
  );
};

export const EmailError: StoryObj<typeof InputBox> = {
  args: {
    label: 'Email',
    fieldType: 'email',
    value: 'invalid-email',
    errorMessage: 'Please enter a valid email address.',
  },
};
