// File: src/components/DatePicker.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import DatePicker from '@/components/DatePicker';
import dayjs from 'dayjs';
import { jest } from '@jest/globals';

describe('DatePicker component', () => {
  it('Renders with label', () => {
    render(
      <DatePicker
        value={dayjs()}
        onChange={jest.fn()}
        label="Pick a date"
      />
    );

    const labels = screen.getAllByText('Pick a date');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('Disables the input when disabled is true', () => {
    render(
      <DatePicker
        value={dayjs()}
        onChange={jest.fn()}
        label="Disabled Date"
        disabled
      />
    );

    const group = screen.getByRole('group', { name: /Disabled Date/i });
    expect(group).toHaveClass('Mui-disabled');
  });
});
