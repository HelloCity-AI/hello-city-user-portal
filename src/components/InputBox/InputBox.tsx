'use client';

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from './InputBox.module.scss';
import { validationRules, getDefaultPlaceholder, getInputType } from './utils';

export type InputVariant = 'primary' | 'secondary' | 'tertiary';
export type InputFieldType = 'name' | 'email' | 'password' | 'repeatPassword' | 'phone';

export interface InputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  fieldType: InputFieldType;
  placeholder?: string;
  variant?: InputVariant;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  autoComplete?: boolean;
  originalPassword?: string;
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
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const normalizedFieldType = fieldType || label.toLowerCase().replace(/\s/g, '');
  const inputType =
    normalizedFieldType === 'password' || normalizedFieldType === 'repeatPassword'
      ? showPassword
        ? 'text'
        : 'password'
      : getInputType(normalizedFieldType);
  const finalPlaceholder = placeholder ?? getDefaultPlaceholder(normalizedFieldType);
  const maxLength = 20;
  const inputId = `input-${normalizedFieldType}`;

  useEffect(() => {
    if (!touched) return;

    const rule = validationRules[normalizedFieldType];
    let currentError = '';

    if (!value.trim()) {
      if (required) {
        currentError = `${label} is required.`;
      }
    } else if (rule) {
      const isValid =
        normalizedFieldType === 'repeatPassword'
          ? rule.validate(value, originalPassword ?? '')
          : rule.validate(value);

      if (!isValid) {
        currentError = rule.error;
      }
    }

    setErrorMessage(currentError);
  }, [value, touched, required, originalPassword, label, normalizedFieldType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!touched) setTouched(true);
    onChange(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`${styles['input-box-wrapper']} ${variant}`}>
      <TextField
        id={inputId}
        fullWidth
        label={label.charAt(0).toUpperCase() + label.slice(1)}
        type={inputType}
        value={value}
        onChange={handleChange}
        placeholder={finalPlaceholder}
        variant="outlined"
        error={!!(errorMessage || externalErrorMessage)}
        helperText={errorMessage || externalErrorMessage || ' '}
        disabled={disabled}
        required={required}
        inputProps={{
          id: inputId,
          maxLength,
          autoComplete: autoComplete ? 'on' : 'off',
          name: normalizedFieldType,
        }}
        InputProps={
          normalizedFieldType === 'password' || normalizedFieldType === 'repeatPassword'
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
      />
    </div>
  );
};

export default InputBox;
