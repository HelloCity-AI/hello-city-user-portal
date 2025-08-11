import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputBox from '../src/components/InputBox/InputBox';

describe('InputBox component', () => {
  it('Renders with label and placeholder', () => {
    render(
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

  it('Displays error message when errorMessage is provided', () => {
    render(
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

  it('Calls onChange when input value changes', () => {
    const handleChange = jest.fn();

    render(<InputBox label="Name" value="" onChange={handleChange} fieldType="name" />);

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

    render(<Wrapper />);
    const input = screen.getByLabelText(/phone/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText('Phone is required.')).toBeInTheDocument();
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

    render(<Wrapper />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  test('Shows rule error for invalid format (custom rule)', () => {
    render(
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
});
