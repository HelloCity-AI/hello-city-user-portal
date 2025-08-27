import { i18n } from '@lingui/core';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
  return passwordRegex.test(password);
};

export const getDefaultPlaceholder = (type: string): string => {
  switch (type) {
    case 'email':
      return i18n._('placeholder.email');
    case 'password':
      return i18n._('placeholder.password');
    case 'repeatPassword':
      return i18n._('placeholder.repeatPassword');
    case 'name':
      return i18n._('placeholder.name');
    case 'phone':
      return i18n._('placeholder.phone');
    case 'message':
      return i18n._('placeholder.message');
    default:
      return i18n._('placeholder.default');
  }
};

export const getInputType = (type: string): 'text' | 'email' | 'password' | 'tel' => {
  switch (type) {
    case 'email':
      return 'email';
    case 'password':
    case 'repeatPassword':
      return 'password';
    case 'phone':
      return 'tel';
    default:
      return 'text';
  }
};

export const validationRules: Record<
  string,
  {
    validate: (value: string, compareTo?: string) => boolean;
    error: () => string;
  }
> = {
  name: {
    validate: (v) => v.trim() !== '' && /^[a-zA-Z\s]+$/.test(v),
    error: () => i18n._('validation.name'),
  },
  email: {
    validate: isValidEmail,
    error: () => i18n._('validation.email'),
  },
  password: {
    validate: isStrongPassword,
    error: () => i18n._('validation.password'),
  },
  repeatPassword: {
    validate: (v, original = '') => v === original,
    error: () => i18n._('validation.repeatPassword'),
  },
  phone: {
    validate: (v) => /^\d+$/.test(v),
    error: () => i18n._('validation.phone'),
  },
  message: {
    validate: (v) => v.trim() !== '',
    error: () => i18n._('validation.message'),
  },
};
