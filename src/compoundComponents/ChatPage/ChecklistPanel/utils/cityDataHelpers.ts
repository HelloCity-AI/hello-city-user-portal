import type { CityInfo, CityDisplayData } from '../types';

export const getCityDisplayData = (
  cityInfo?: CityInfo,
  randomCityInfo?: CityInfo | null,
  heroImage?: string,
  title?: string,
  subtitle?: string,
  imageError = false,
): CityDisplayData => {
  const image = imageError
    ? cityInfo?.fallbackImage || randomCityInfo?.fallbackImage || '/images/default-city-image.jpg'
    : cityInfo?.heroImage ||
      randomCityInfo?.heroImage ||
      heroImage ||
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

  const name = cityInfo?.name || randomCityInfo?.name;

  const displayTitle = cityInfo?.tagline || randomCityInfo?.tagline || title;

  const displaySubtitle = cityInfo?.description || randomCityInfo?.description || subtitle;

  return {
    image,
    name,
    title: displayTitle,
    subtitle: displaySubtitle,
  };
};

export const shouldUseRandomCity = (cityInfo?: CityInfo): boolean => {
  return !cityInfo;
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
