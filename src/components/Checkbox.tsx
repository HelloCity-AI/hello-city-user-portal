import React, { type JSX } from 'react';
import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placement?: 'start' | 'end';
  size?: 'small' | 'medium';
  color?: 'default' | 'primary' | 'secondary' | 'info';
  className?: string;
  labelClassName?: string;
  indeterminate?: boolean; //dash icon
};

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled,
  placement,
  size,
  color,
  className,
  labelClassName,
  indeterminate,
}: CheckboxProps): JSX.Element => {
  return (
    <FormControlLabel
      control={
        <MUICheckbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          size={size}
          color={color}
          className={className}
          indeterminate={indeterminate}
        />
      }
      label={label}
      labelPlacement={placement}
      sx={(theme) => ({
        '& .MuiFormControlLabel-label': {
          ...theme.typography.body2,
          color: disabled ? theme.palette.text.disabled : theme.palette.text.primary,
        },
        columnGap: theme.spacing(0.5),
      })}
      className={labelClassName}
      disabled={disabled}
    />
  );
};

export default Checkbox;
