import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '@/components/DatePicker';
import dayjs, { isDayjs } from 'dayjs';
import { jest } from '@jest/globals';

const renderDatePicker = (props: {
  value: dayjs.Dayjs | null;
  onChange: (value: dayjs.Dayjs | null) => void;
  label?: string;
  disabled?: boolean;
}) => {
  render(<DatePicker {...props} />);
};

describe('DatePicker component', () => {
  describe('UI Style', () => {
    it('Renders with label', () => {
      renderDatePicker({
        value: dayjs(),
        onChange: jest.fn(),
        label: 'Pick a date',
      });
      expect(screen.getByLabelText('Pick a date')).toBeInTheDocument();
    });

    it('Disables the input when disabled is true', () => {
      renderDatePicker({
        value: dayjs(),
        onChange: jest.fn(),
        label: 'Disabled Date',
        disabled: true,
      });
      const input = screen.getByLabelText('Disabled Date');
      expect(input).toBeDisabled();
    });
  });
});

it('Calls onChange when date is changed manually', () => {
  const handleChange = jest.fn();
  renderDatePicker({
    value: dayjs('2025-08-01'),
    onChange: handleChange,
    label: 'Change Date',
  });

  const input = screen.getByLabelText('Change Date');
  fireEvent.change(input, { target: { value: '08/03/2025' } });
  fireEvent.blur(input);
  expect(handleChange).toHaveBeenCalled();

  const calledValue = handleChange.mock.calls[0][0];
  expect(isDayjs(calledValue)).toBe(true);
  expect(calledValue.format('YYYY-MM-DD')).toBe('2025-08-03');
});
