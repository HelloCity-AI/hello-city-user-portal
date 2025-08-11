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
      return 'Please enter your email';
    case 'password':
      return 'Please enter your password';
    case 'repeatPassword':
      return 'Please repeat your password';
    case 'name':
      return 'Please enter your name';
    case 'phone':
      return 'Please enter your phone number';
    default:
      return 'Please enter value';
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
    error: string;
  }
> = {
  name: {
    validate: (v) => v.trim() !== '' && /^[a-zA-Z\s]+$/.test(v),
    error: 'Only letters are allowed and name is required.',
  },
  email: {
    validate: isValidEmail,
    error: 'Please enter a valid email address.',
  },
  password: {
    validate: isStrongPassword,
    error:
      'Password must be 6-20 characters with uppercase, lowercase, number, and special character.',
  },
  repeatPassword: {
    validate: (v, original = '') => v === original,
    error: 'Passwords do not match.',
  },
  phone: {
    validate: (v) => /^\d+$/.test(v),
    error: 'Only numbers are allowed.',
  },
};
