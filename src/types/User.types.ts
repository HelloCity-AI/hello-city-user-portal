import type { Genders, Nationalities, Languages } from '@/enums/UserAttributes';

export type User = {
  username?: string;
  userId: string;
  email: string;
  gender: Genders | '';
  avatarUrl?: string;
  nationality: Nationalities | '';
  city: string;
  university: string;
  major: string;
  preferredLanguage: Languages | '';
  lastJoinDate: string | Date;
};

export const defaultUser: User = {
  username: '',
  userId: '',
  email: '',
  gender: '',
  avatarUrl: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: '',
};
