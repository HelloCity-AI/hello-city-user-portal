import { Genders, Nationalities, Cities, Languages } from '@/enums/UserAttributes';

// Stable IDs for attribute labels
export const userAttrLabelIds = {
  email: 'userAttr.email',
  nationality: 'userAttr.nationality',
  city: 'userAttr.city',
  gender: 'userAttr.gender',
  university: 'userAttr.university',
  major: 'userAttr.major',
  preferredLanguage: 'userAttr.preferredLanguage',
} as const;

// Ensure extraction of default messages for labels (literal IDs for reliable extraction)
// No macros: translations are manually maintained in messages.po

// Stable IDs for option texts
export const userAttrOptionIds = {
  genders: {
    [Genders.Male]: 'userAttr.genderOption.Male',
    [Genders.Female]: 'userAttr.genderOption.Female',
    [Genders.Other]: 'userAttr.genderOption.Other',
    [Genders.PreferNotToSay]: 'userAttr.genderOption.PreferNotToSay',
  },
  nationalities: {
    [Nationalities.China]: 'userAttr.nationalityOption.China',
    [Nationalities.Korea]: 'userAttr.nationalityOption.Korea',
    [Nationalities.Japan]: 'userAttr.nationalityOption.Japan',
  },
  cities: {
    [Cities.Sydney]: 'userAttr.cityOption.Sydney',
    [Cities.Melbourne]: 'userAttr.cityOption.Melbourne',
    [Cities.Adelaide]: 'userAttr.cityOption.Adelaide',
    [Cities.Perth]: 'userAttr.cityOption.Perth',
  },
  languages: {
    [Languages.English]: 'userAttr.languageOption.en',
    [Languages.SimplifiedChinese]: 'userAttr.languageOption.zh_CN',
    [Languages.TraditionalChinese]: 'userAttr.languageOption.zh_TW',
    [Languages.Japanese]: 'userAttr.languageOption.ja',
    [Languages.Korean]: 'userAttr.languageOption.ko',
  },
} as const;

// Ensure extraction of default messages for options (literal IDs)
// No macros: option translations are manually maintained in messages.po
