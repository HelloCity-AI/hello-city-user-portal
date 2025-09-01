import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import { twMerge } from 'tailwind-merge';

interface SectionContentAreaProps {
  children: ReactNode;
  additionalClassName?: string;
}

const SectionContentArea: React.FC<SectionContentAreaProps> = ({
  children,
  additionalClassName,
}) => {
  const baseClassName = 'flex w-full flex-wrap gap-5 text-left justify-center lg:flex-nowrap';

  return (
    <Box component="div" className={twMerge(baseClassName, additionalClassName)}>
      {children}
    </Box>
  );
};

export default SectionContentArea;
