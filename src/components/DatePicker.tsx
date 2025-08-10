'use client';

import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
// eslint-disable-next-line import/no-unresolved
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// eslint-disable-next-line import/no-unresolved
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import type { Dayjs } from 'dayjs';

interface DatePickerProps {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, disabled = false }) => {
  return (
    <div className="w-[300px]">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MUIDatePicker
          value={value}
          onChange={onChange}
          disabled={disabled}
          label={label}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              inputProps: {
                'aria-label': typeof label === 'string' ? label : 'datepicker',
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
