'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { twMerge } from 'tailwind-merge';
import useIsMobile from '@/hooks/useIsMobile';

interface ResponsiveMarqueeProps {
  children: React.ReactNode;
  duplicateChildren: React.ReactNode;
  className?: string;
}

const ResponsiveMarquee: React.FC<ResponsiveMarqueeProps> = ({
  children,
  duplicateChildren,
  className,
}) => {
  const isMobile = useIsMobile();

  return (
    <Box
      className={twMerge(
        'group mt-3 w-[100vw]',
        isMobile ? 'overflow-x-scroll' : 'overflow-x-hidden',
      )}
      sx={{ WebkitOverflowScrolling: 'touch' }}
    >
      <Box
        className={twMerge(
          'flex gap-5 pl-6 text-left lg:pl-[max(2rem,calc((100vw-1200px)/2))]',
          !isMobile ? 'animate-marquee group-hover:paused' : '',
          className,
        )}
        sx={{ width: 'max-content', willChange: 'transform' }}
      >
        {children}
        {!isMobile && duplicateChildren}
      </Box>
    </Box>
  );
};

export default ResponsiveMarquee;
