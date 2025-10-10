import { useEffect, useMemo, useState } from 'react';
import type { CityInfo, CityDisplayData } from '../types';
import { getCityDisplayData } from '../utils/cityDataHelpers';

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
 * Manages city display data with image error handling
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

  // Reset image error when city changes
  useEffect(() => {
    setImageError(false);
    // TODO: Add image preloading for next city
  }, [cityInfo]);

  // Calculate display data with default fallback
  const displayData = useMemo(
    () => getCityDisplayData(cityInfo, heroImage, title, subtitle, imageError),
    [cityInfo, heroImage, title, subtitle, imageError],
  );

  return {
    displayData,
    imageError,
    setImageError,
  };
};
