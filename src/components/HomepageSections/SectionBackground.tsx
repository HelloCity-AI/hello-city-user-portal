import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';

interface SectionBackgroundProps {
  children: ReactNode;
  bgColor?: 'primary' | 'secondary' | 'white';
  bgImg?: string;
  overlay?: boolean;
  imgSrc?: string;
  imgAlt?: string;
  additionalWrapperClassName?: string;
  overlayClassName?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({
  children,
  bgColor = 'white',
  overlay = false,
  additionalWrapperClassName = '',
  bgImg,
  imgAlt,
  imgSrc,
  priority,
  loading,
  overlayClassName = 'absolute inset-0 bg-black/50 z-10',
}) => {
  const baseClassName = `relative overflow-hidden py-10 lg:py-20`;

  return (
    <Box
      component="section"
      className={clsx(baseClassName, additionalWrapperClassName)}
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
          alt={imgAlt ?? ''}
          fill
          priority={priority}
          loading={loading}
          className="object-cover"
          sizes="100vw"
        />
      )}
      {overlay && <Box component="div" className={overlayClassName} />}
      {children}
    </Box>
  );
};

export default SectionBackground;
