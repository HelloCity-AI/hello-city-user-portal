import { memo } from 'react';

import Typography from '@mui/material/Typography';

import { mergeClassNames } from '@/utils/classNames';

import type { HeroSectionProps } from '../../types';

const HeaderInfo = memo(({ title, subtitle, cityName }: HeroSectionProps) => {
  return (
    <div className={mergeClassNames('relative min-h-28 overflow-hidden bg-transparent')}>
      <div className="relative z-10 flex flex-col gap-2">
        {/* Header with city name and title */}
        <div className="flex flex-col gap-1">
          {cityName && (
            <Typography variant="h5" className="font-bold text-foreground">
              {cityName}
            </Typography>
          )}
          <Typography variant="h6" className="font-semibold text-primary-color">
            {title}
          </Typography>
        </div>
        {/* Subtitle */}
        <Typography variant="body2" className="text-muted-foreground">
          {subtitle}
        </Typography>
      </div>
    </div>
  );
});

HeaderInfo.displayName = 'HeaderInfo';

export default HeaderInfo;
