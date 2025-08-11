import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: Genders | '';
  nationality: Nationalities | '';
  city: Cities | '';
  language: Languages | '';
};

export const defaultUser: User = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  nationality: '',
  city: '',
  language: '',
};
