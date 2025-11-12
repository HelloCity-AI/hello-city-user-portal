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
    [Nationalities.Australia]: 'userAttr.nationalityOption.Australia',
    [Nationalities.Canada]: 'userAttr.nationalityOption.Canada',
    [Nationalities.China]: 'userAttr.nationalityOption.China',
    [Nationalities.Korea]: 'userAttr.nationalityOption.Korea',
    [Nationalities.France]: 'userAttr.nationalityOption.France',
    [Nationalities.Germany]: 'userAttr.nationalityOption.Germany',
    [Nationalities.HongKong]: 'userAttr.nationalityOption.HongKong',
    [Nationalities.Indonesia]: 'userAttr.nationalityOption.Indonesia',
    [Nationalities.Ireland]: 'userAttr.nationalityOption.Ireland',
    [Nationalities.Japan]: 'userAttr.nationalityOption.Japan',
    [Nationalities.Macau]: 'userAttr.nationalityOption.Macau',
    [Nationalities.Netherlands]: 'userAttr.nationalityOption.Netherlands',
    [Nationalities.NewZealand]: 'userAttr.nationalityOption.NewZealand',
    [Nationalities.Singapore]: 'userAttr.nationalityOption.Singapore',
    [Nationalities.Thailand]: 'userAttr.nationalityOption.Thailand',
    [Nationalities.UnitedArabEmirates]: 'userAttr.nationalityOption.UnitedArabEmirates',
    [Nationalities.UnitedKingdom]: 'userAttr.nationalityOption.UnitedKingdom',
    [Nationalities.UnitedStates]: 'userAttr.nationalityOption.UnitedStates',
    [Nationalities.Other]: 'userAttr.nationalityOption.Other',
  },
  cities: {
    // Australia
    [Cities.Sydney]: 'userAttr.cityOption.Sydney',
    [Cities.Melbourne]: 'userAttr.cityOption.Melbourne',
    [Cities.Brisbane]: 'userAttr.cityOption.Brisbane',
    [Cities.Perth]: 'userAttr.cityOption.Perth',
    [Cities.Adelaide]: 'userAttr.cityOption.Adelaide',
    [Cities.GoldCoast]: 'userAttr.cityOption.GoldCoast',
    // Canada
    [Cities.Toronto]: 'userAttr.cityOption.Toronto',
    [Cities.Vancouver]: 'userAttr.cityOption.Vancouver',
    [Cities.Montreal]: 'userAttr.cityOption.Montreal',
    [Cities.Calgary]: 'userAttr.cityOption.Calgary',
    [Cities.Ottawa]: 'userAttr.cityOption.Ottawa',
    // China
    [Cities.Beijing]: 'userAttr.cityOption.Beijing',
    [Cities.Shanghai]: 'userAttr.cityOption.Shanghai',
    [Cities.Guangzhou]: 'userAttr.cityOption.Guangzhou',
    [Cities.Shenzhen]: 'userAttr.cityOption.Shenzhen',
    [Cities.Chengdu]: 'userAttr.cityOption.Chengdu',
    [Cities.Chongqing]: 'userAttr.cityOption.Chongqing',
    [Cities.Xian]: 'userAttr.cityOption.Xian',
    [Cities.Hangzhou]: 'userAttr.cityOption.Hangzhou',
    // Hong Kong & Macau
    [Cities.HongKong]: 'userAttr.cityOption.HongKong',
    [Cities.Macau]: 'userAttr.cityOption.Macau',
    // Japan
    [Cities.Tokyo]: 'userAttr.cityOption.Tokyo',
    [Cities.Osaka]: 'userAttr.cityOption.Osaka',
    [Cities.Kyoto]: 'userAttr.cityOption.Kyoto',
    // Singapore
    [Cities.Singapore]: 'userAttr.cityOption.Singapore',
    // United States
    [Cities.NewYork]: 'userAttr.cityOption.NewYork',
    [Cities.LosAngeles]: 'userAttr.cityOption.LosAngeles',
    [Cities.SanFrancisco]: 'userAttr.cityOption.SanFrancisco',
    [Cities.Miami]: 'userAttr.cityOption.Miami',
    [Cities.Seattle]: 'userAttr.cityOption.Seattle',
    [Cities.Chicago]: 'userAttr.cityOption.Chicago',
    [Cities.Boston]: 'userAttr.cityOption.Boston',
    [Cities.WashingtonDC]: 'userAttr.cityOption.WashingtonDC',
    // United Kingdom
    [Cities.London]: 'userAttr.cityOption.London',
    [Cities.Edinburgh]: 'userAttr.cityOption.Edinburgh',
    [Cities.Manchester]: 'userAttr.cityOption.Manchester',
    // France
    [Cities.Paris]: 'userAttr.cityOption.Paris',
    // Germany
    [Cities.Berlin]: 'userAttr.cityOption.Berlin',
    [Cities.Munich]: 'userAttr.cityOption.Munich',
    [Cities.Hamburg]: 'userAttr.cityOption.Hamburg',
    // Netherlands
    [Cities.Amsterdam]: 'userAttr.cityOption.Amsterdam',
    // Ireland
    [Cities.Dublin]: 'userAttr.cityOption.Dublin',
    // New Zealand
    [Cities.Auckland]: 'userAttr.cityOption.Auckland',
    [Cities.Wellington]: 'userAttr.cityOption.Wellington',
    [Cities.Christchurch]: 'userAttr.cityOption.Christchurch',
    // United Arab Emirates
    [Cities.Dubai]: 'userAttr.cityOption.Dubai',
    // Thailand
    [Cities.Bangkok]: 'userAttr.cityOption.Bangkok',
    // Indonesia
    [Cities.Bali]: 'userAttr.cityOption.Bali',
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
