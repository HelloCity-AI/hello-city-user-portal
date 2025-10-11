import type { CityInfo, CityDisplayData } from '../types';
import { defaultCity } from '../data/cityData';

export const getCityDisplayData = (
  cityInfo?: CityInfo,
  heroImage?: string,
  title?: string,
  subtitle?: string,
  imageError = false,
): CityDisplayData => {
  // Use provided cityInfo, or fall back to default city
  const effectiveCityInfo = cityInfo || defaultCity;

  const image = imageError
    ? effectiveCityInfo.fallbackImage || '/images/default-city-image.jpg'
    : effectiveCityInfo.heroImage ||
      heroImage ||
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';

  const name = effectiveCityInfo.name;

  const displayTitle = effectiveCityInfo.tagline || title;

  const displaySubtitle = effectiveCityInfo.description || subtitle;

  return {
    image,
    name,
    title: displayTitle,
    subtitle: displaySubtitle,
  };
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
