import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';

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
    <Box component="div" className={clsx(baseClassName, additionalClassName)}>
      {children}
    </Box>
  );
};

export default SectionContent;
