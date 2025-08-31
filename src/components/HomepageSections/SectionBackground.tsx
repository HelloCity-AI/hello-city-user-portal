import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface SectionBackgroundProps {
  children: ReactNode;
  bgColor?: 'primary' | 'secondary' | 'white';
  bgImg?: string;
  imgSrc?: string;
  imgAlt?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  overlay?: boolean;
  overlayClassName?: string;
  additionalWrapperClassName?: string;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({
  children,
  bgColor = 'white',
  bgImg,
  imgSrc,
  imgAlt = '',
  priority,
  loading,
  overlay = false,
  overlayClassName = 'absolute inset-0 bg-black/50 z-10',
  additionalWrapperClassName,
}) => {
  const baseClassName = `relative overflow-hidden py-10 lg:py-20`;

  return (
    <Box
      component="section"
      className={twMerge(baseClassName, additionalWrapperClassName)}
      sx={{
        background: `url(${bgImg}) center/cover no-repeat `,
        backgroundColor:
          bgColor === 'primary'
            ? 'primary.main'
            : bgColor === 'secondary'
              ? 'secondary.main'
              : 'white',
      }}
    >
      {imgSrc && (
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          priority={priority}
          loading={loading}
          className="z-0 object-cover"
          sizes="100vw"
        />
      )}
      {overlay && <Box component="div" className={overlayClassName} />}
      {children}
    </Box>
  );
};

export default SectionBackground;
