import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import { twMerge } from 'tailwind-merge';

interface SectionContentProps {
  children: ReactNode;
  additionalClassName?: string;
}

const SectionContent: React.FC<SectionContentProps> = ({
  children,
  additionalClassName = 'flex flex-col justify-center flex-wrap items-center text-center',
}) => {
  const baseClassName = 'max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 gap-3 relative z-20';

  return (
    <Box component="div" className={twMerge(baseClassName, additionalClassName)}>
      {children}
    </Box>
  );
};

export default SectionContent;
