import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
import { jest } from '@jest/globals';

const renderDatePicker = (props = {}) => {
  const onChange = jest.fn();
  const utils = render(
    <DatePicker value={dayjs()} onChange={onChange} label="Pick a date" {...props} />,
  );
  return {
    onChange,
    ...utils,
  };
};

describe('DatePicker component', () => {
  test('Renders with label', () => {
    renderDatePicker();

    const labels = screen.getAllByText('Pick a date');
    expect(labels.length).toBeGreaterThan(0);
  });

  test('Disables the input when disabled is true', () => {
    renderDatePicker({ label: 'Disabled Date', disabled: true });

    const group = screen.getByRole('group', { name: /Disabled Date/i });
    expect(group).toHaveClass('Mui-disabled');
  });

  test('Calls onChange with expected value', () => {
    const { onChange, container } = renderDatePicker();

    const input = container.querySelector('input');
    expect(input).not.toBeNull();

    fireEvent.change(input!, { target: { value: '2025-08-20' } });

    expect(onChange).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ validationError: null }))
  });

});