import { useEffect, useMemo, useState } from 'react';
import type { CityInfo, CityDisplayData } from '../types';
import { getCityDisplayData, shouldUseRandomCity } from '../utils/cityDataHelpers';
import { getRandomCity } from '../data/cityData';

interface UseCityDisplayProps {
  cityInfo?: CityInfo;
  heroImage?: string;
  title?: string;
  subtitle?: string;
}

interface UseCityDisplayReturn {
  displayData: CityDisplayData;
  imageError: boolean;
  setImageError: (error: boolean) => void;
}

/**
 * Manages city display data with image error handling and random city selection
 *
 * TODO: Add image caching mechanism
 * TODO: Implement city-based theme adaptation
 * PLACEHOLDER: Add image preloading for better UX
 */
export const useCityDisplay = ({
  cityInfo,
  heroImage,
  title,
  subtitle,
}: UseCityDisplayProps): UseCityDisplayReturn => {
  const [imageError, setImageError] = useState(false);

  // Generate random city info only once when needed
  const randomCityInfo = useMemo(() => {
    // PLACEHOLDER: Add user preference for city selection
    return shouldUseRandomCity(cityInfo) ? getRandomCity() : null;
  }, [cityInfo]);

  // Reset image error when city changes
  useEffect(() => {
    setImageError(false);
    // TODO: Add image preloading for next city
  }, [cityInfo, randomCityInfo]);

  // Calculate display data
  const displayData = useMemo(
    () => getCityDisplayData(cityInfo, randomCityInfo, heroImage, title, subtitle, imageError),
    [cityInfo, randomCityInfo, heroImage, title, subtitle, imageError],
  );

  return {
    displayData,
    imageError,
    setImageError,
  };
};
