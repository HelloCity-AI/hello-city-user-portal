import type { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

export type User = {
  userId: string;
  Email: string;
  AvatarFile?: File | null;
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
  AvatarFile: null,
  Gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};
