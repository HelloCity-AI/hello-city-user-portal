import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputBox from '../src/components/InputBox/InputBox';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { messages as enMessages } from '../src/locales/en/messages';

beforeAll(() => {
  i18n.load('en', enMessages);
  i18n.activate('en');
});

const renderWithI18n = (ui: React.ReactNode) => {
  return render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>);
};

describe('InputBox component', () => {
  test('Renders with label and placeholder', () => {
    renderWithI18n(
      <InputBox
        label="Name"
        value=""
        onChange={() => {}}
        placeholder="Enter your name"
        fieldType="name"
      />,
    );
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  test('Displays error message when errorMessage is provided', () => {
    renderWithI18n(
      <InputBox
        label="Email"
        value="invalid"
        onChange={() => {}}
        errorMessage="Invalid email"
        fieldType="email"
      />,
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  test('Calls onChange when input value changes', () => {
    const handleChange = jest.fn();

    renderWithI18n(
      <InputBox label="Name" value="" onChange={handleChange} fieldType="name" />,
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('InputBox validation', () => {
  test('Shows required error when phone input is empty', () => {
    const Wrapper = () => {
      const [val, setVal] = React.useState('123');
      return (
        <InputBox
          label="Phone"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          required
          fieldType="phone"
        />
      );
    };

    renderWithI18n(<Wrapper />);
    const input = screen.getByLabelText(/phone/i);
    fireEvent.change(input, { target: { value: '' } });

  
    expect(screen.getByText(i18n._('validation.required', { label: 'Phone' }))).toBeInTheDocument();
  });

  test('Shows required error when email input is empty', () => {
    const Wrapper = () => {
      const [val, setVal] = React.useState('abc');
      return (
        <InputBox
          label="Email"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          required
          fieldType="email"
        />
      );
    };

    renderWithI18n(<Wrapper />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText(i18n._('validation.required', { label: 'Email' }))).toBeInTheDocument();
  });

  test('Shows rule error for invalid format (custom rule)', () => {
    renderWithI18n(
      <InputBox
        label="Email"
        value="invalid"
        onChange={() => {}}
        errorMessage="Invalid email"
        fieldType="email"
      />,
    );

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  test('Shows required error when message input is empty', () => {
    const Wrapper = () => {
      const [val, setVal] = React.useState('Hello');
      return (
        <InputBox
          label="Message"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          required
          fieldType="message"
        />
      );
    };

    renderWithI18n(<Wrapper />);
    const input = screen.getByLabelText(/message/i);
    fireEvent.change(input, { target: { value: '' } });

   
    expect(screen.getByText(i18n._('validation.required', { label: 'Message' }))).toBeInTheDocument();
  });
});
