import { cityData } from '../data/cityData';
import type { CityCode, CityInfo } from '../types';

/**
 * Get full CityInfo by city code
 *
 * @param cityCode - City code from Redux state
 * @returns Full CityInfo with React elements from cityData.tsx
 */
export function getCityInfo(cityCode: CityCode): CityInfo {
  return cityData[cityCode];
}
