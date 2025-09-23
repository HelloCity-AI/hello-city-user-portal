import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  userId: string;
  Email: string;
  Avatar: string;
  Gender: Genders | '';
  nationality: Nationalities | '';
  city: Cities | '';
  university: string;
  major: string;
  preferredLanguage: Languages | '';
  lastJoinDate: Date;
};

export const defaultUser: User = {
  userId: '',
  Email: '',
  Avatar: '',
  Gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};
