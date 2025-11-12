export enum Genders {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'PreferNotToSay',
}
export const genderOptions = Object.values(Genders);

// Countries from cityData
export enum Nationalities {
  Australia = 'Australia',
  Canada = 'Canada',
  China = 'China',
  Korea = 'Korea',
  France = 'France',
  Germany = 'Germany',
  HongKong = 'China (Hong Kong)',
  Indonesia = 'Indonesia',
  Ireland = 'Ireland',
  Japan = 'Japan',
  Macau = 'China (Macau)',
  Netherlands = 'Netherlands',
  NewZealand = 'New Zealand',
  Singapore = 'Singapore',
  Thailand = 'Thailand',
  UnitedArabEmirates = 'United Arab Emirates',
  UnitedKingdom = 'United Kingdom',
  UnitedStates = 'United States',
}
export const nationalityOptions = Object.values(Nationalities);

// Cities from cityData (sorted by country)
export enum Cities {
  // Australia
  Sydney = 'Sydney',
  Melbourne = 'Melbourne',
  Brisbane = 'Brisbane',
  Perth = 'Perth',
  Adelaide = 'Adelaide',
  GoldCoast = 'Gold Coast',
  // Canada
  Toronto = 'Toronto',
  Vancouver = 'Vancouver',
  Montreal = 'Montreal',
  Calgary = 'Calgary',
  Ottawa = 'Ottawa',
  // China
  Beijing = 'Beijing',
  Shanghai = 'Shanghai',
  Guangzhou = 'Guangzhou',
  Shenzhen = 'Shenzhen',
  Chengdu = 'Chengdu',
  Chongqing = 'Chongqing',
  Xian = "Xi'an",
  Hangzhou = 'Hangzhou',
  // Hong Kong
  HongKong = 'Hong Kong',
  // Macau
  Macau = 'Macau',
  // Japan
  Tokyo = 'Tokyo',
  Osaka = 'Osaka',
  Kyoto = 'Kyoto',
  // Singapore
  Singapore = 'Singapore',
  // United States
  NewYork = 'New York',
  LosAngeles = 'Los Angeles',
  SanFrancisco = 'San Francisco',
  Miami = 'Miami',
  Seattle = 'Seattle',
  Chicago = 'Chicago',
  Boston = 'Boston',
  WashingtonDC = 'Washington DC',
  // United Kingdom
  London = 'London',
  Edinburgh = 'Edinburgh',
  Manchester = 'Manchester',
  // France
  Paris = 'Paris',
  // Germany
  Berlin = 'Berlin',
  Munich = 'Munich',
  Hamburg = 'Hamburg',
  // Netherlands
  Amsterdam = 'Amsterdam',
  // Ireland
  Dublin = 'Dublin',
  // New Zealand
  Auckland = 'Auckland',
  Wellington = 'Wellington',
  Christchurch = 'Christchurch',
  // United Arab Emirates
  Dubai = 'Dubai',
  // Thailand
  Bangkok = 'Bangkok',
  // Indonesia
  Bali = 'Bali Island',
}
export const cityOptions = Object.values(Cities);

// City-Country mapping for cascading selection
export const cityCountryMapping: Record<string, string[]> = {
  [Nationalities.Australia]: [
    Cities.Sydney,
    Cities.Melbourne,
    Cities.Brisbane,
    Cities.Perth,
    Cities.Adelaide,
    Cities.GoldCoast,
  ],
  [Nationalities.Canada]: [
    Cities.Toronto,
    Cities.Vancouver,
    Cities.Montreal,
    Cities.Calgary,
    Cities.Ottawa,
  ],
  [Nationalities.China]: [
    Cities.Beijing,
    Cities.Shanghai,
    Cities.Guangzhou,
    Cities.Shenzhen,
    Cities.Chengdu,
    Cities.Chongqing,
    Cities.Xian,
    Cities.Hangzhou,
  ],
  [Nationalities.HongKong]: [Cities.HongKong],
  [Nationalities.Macau]: [Cities.Macau],
  [Nationalities.Japan]: [Cities.Tokyo, Cities.Osaka, Cities.Kyoto],
  [Nationalities.Singapore]: [Cities.Singapore],
  [Nationalities.UnitedStates]: [
    Cities.NewYork,
    Cities.LosAngeles,
    Cities.SanFrancisco,
    Cities.Miami,
    Cities.Seattle,
    Cities.Chicago,
    Cities.Boston,
    Cities.WashingtonDC,
  ],
  [Nationalities.UnitedKingdom]: [Cities.London, Cities.Edinburgh, Cities.Manchester],
  [Nationalities.France]: [Cities.Paris],
  [Nationalities.Germany]: [Cities.Berlin, Cities.Munich, Cities.Hamburg],
  [Nationalities.Netherlands]: [Cities.Amsterdam],
  [Nationalities.Ireland]: [Cities.Dublin],
  [Nationalities.NewZealand]: [Cities.Auckland, Cities.Wellington, Cities.Christchurch],
  [Nationalities.UnitedArabEmirates]: [Cities.Dubai],
  [Nationalities.Thailand]: [Cities.Bangkok],
  [Nationalities.Indonesia]: [Cities.Bali],
};

// Helper function to get cities by country
export const getCitiesByCountry = (country: string): string[] => {
  return cityCountryMapping[country] || [];
};

export enum Languages {
  English = 'en',
  SimplifiedChinese = 'zh_CN',
  TraditionalChinese = 'zh_TW',
  Japanese = 'ja',
  Korean = 'ko',
}
export const languageOptions = Object.values(Languages);
