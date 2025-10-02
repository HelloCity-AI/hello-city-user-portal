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
    const { container } = renderDatePicker();

    // label 会渲染到 legend 内部
    const legend = container.querySelector('legend');
    expect(legend).toHaveTextContent('Pick a date');
  });

  test('Disables the input when disabled is true', () => {
    const { container } = renderDatePicker({
      label: 'Disabled Date',
      disabled: true,
    });

    // 找 input 并确认 disabled
    const input = container.querySelector('input');
    expect(input).toBeDisabled();
  });

  test('Calls onChange when value changes', () => {
    const { onChange, container } = renderDatePicker();

    const input = container.querySelector('input');
    expect(input).not.toBeNull();

    fireEvent.change(input!, { target: { value: '2025-08-20' } });

    // 只要被调用即可
    expect(onChange).toHaveBeenCalled();
  });
});
