import { memo } from 'react';
import HeaderInfo from '../ui/HeaderInfo';
import ChecklistProgress from '../ui/ChecklistProgress';
import type { ChecklistHeaderSectionProps } from '../../types';

const ChecklistHeaderSection = memo(
  ({ title, subtitle, cityName, stats, filter, onFilterChange }: ChecklistHeaderSectionProps) => {
    return (
      <div className="glass mb-5 flex flex-shrink-0 flex-col gap-3 rounded-2xl px-4 py-6">
        <HeaderInfo title={title} subtitle={subtitle} cityName={cityName} />
        <ChecklistProgress stats={stats} filter={filter} onFilterChange={onFilterChange} />
      </div>
    );
  },
);

ChecklistHeaderSection.displayName = 'ChecklistHeaderSection';

export default ChecklistHeaderSection;
