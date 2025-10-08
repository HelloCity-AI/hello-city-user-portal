import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  username?: string;
  userId: string;
  email: string;
  gender: Genders | '';
  avatar?: string;
  avatarFile?: File | null;
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
  gender: '',
  avatar: '',
  avatarFile: null,
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};
