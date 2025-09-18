import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  userId: string;
  email: string;
  avatar: string;
  gender: Genders | '';
  nationality: Nationalities | '';
  city: Cities | '';
  university: string;
  major: string;
  preferredLanguage: Languages | '';
  lastJoinDate: Date;
};

export const defaultUser: User = {
  userId: '',
  email: '',
  avatar: '',
  gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};
