import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  username?: string;
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
  username: '',
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
