'use client';

import React, { useId, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from './InputBox.module.css';
import { validationRules, getDefaultPlaceholder, getInputType } from './utils';

export type InputVariant = 'primary' | 'secondary' | 'tertiary';
export type InputFieldType = 'name' | 'email' | 'password' | 'repeatPassword' | 'phone';

export interface InputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label: string;
  fieldType: InputFieldType;
  placeholder?: string;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  autoComplete?: boolean;
  originalPassword?: string;
  name?: string;
  maxLength?: number;
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChange,
  label,
  fieldType,
  placeholder,
  variant = 'primary',
  disabled,
  required,
  errorMessage: externalErrorMessage = '',
  autoComplete,
  originalPassword,
  name,
  maxLength = 20,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    fieldType === 'password' || fieldType === 'repeatPassword'
      ? showPassword
        ? 'text'
        : 'password'
      : getInputType(fieldType);

  const validateChange = (val: string) => {
    if (!val.trim()) {
      setErrorMessage(required ? `${label} is required.` : '');
      return;
    }
    const rule = validationRules[fieldType];
    const isValid =
      fieldType === 'repeatPassword'
        ? rule.validate(val, originalPassword)
        : rule.validate(val);
    if (!isValid)  {
      setErrorMessage(rule.error)
      return
    }
    setErrorMessage('');
  };

  return (
    <div className={`${styles['input-box-wrapper']} ${variant}`}>
      <TextField
        id={`input-${fieldType}}-${useId()}`}
        label={label.charAt(0).toUpperCase() + label.slice(1)}
        type={inputType}
        value={value}
        onChange={(e) => (onChange(e), validateChange(e.target.value))}
        placeholder={placeholder ?? getDefaultPlaceholder(fieldType)}
        variant="outlined"
        error={!!(errorMessage || externalErrorMessage)}
        helperText={errorMessage || externalErrorMessage || ' '}
        disabled={disabled}
        required={required}
        slotProps={{
          input: {
            autoComplete: autoComplete ? 'on' : 'off',
            name: name || fieldType,
            endAdornment: (
              (fieldType === 'password' || fieldType === 'repeatPassword') &&
              (<InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>)
            ),
            inputProps: {
              maxLength: maxLength
            }
          }
        }}
      />
    </div>
  );
};

export default InputBox;
