export enum Genders {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'PreferNotToSay',
}
export const genderOptions = Object.values(Genders);

export enum Cities {
  Sydney = 'Sydney',
  Melbourne = 'Melbourne',
  Adelaide = 'Adelaide',
  Perth = 'Perth',
}
export const cityOptions = Object.values(Cities);

export enum Nationalities {
  China = 'China',
  Korea = 'Korea',
  Japan = 'Japan',
}
export const nationalityOptions = Object.values(Nationalities);

export enum Languages {
  English = 'en',
  SimplifiedChinese = 'zh_CN',
  TraditionalChinese = 'zh_TW',
  Japanese = 'ja',
  Korean = 'ko',
}
export const languageOptions = Object.values(Languages);
