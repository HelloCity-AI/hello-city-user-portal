// File: src/components/DatePicker.tsx
import React from 'react';
import { TextField } from '@mui/material';
import { DatePicker as MUIDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type dayjs from 'dayjs';

type Props = {
  value: dayjs.Dayjs | null;
  onChange: (value: dayjs.Dayjs | null) => void;
  label?: React.ReactNode;
  disabled?: boolean;
};

const DatePicker: React.FC<Props> = ({ value, onChange, label, disabled }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUIDatePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{
          textField: {},
        }}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
