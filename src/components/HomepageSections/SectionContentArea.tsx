import type { ReactNode } from 'react';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';
import Box from '@mui/material/Box';

interface SectionContentAreaProps {
  children: ReactNode;
  additionalClassName?: string;
}

const SectionContentArea: React.FC<SectionContentAreaProps> = ({
  children,
  additionalClassName = '',
}) => {
  const baseClassName = 'flex w-full flex-wrap gap-5 text-left justify-center';

  return (
    <Box component="div" className={clsx(baseClassName, additionalClassName)}>
      {children}
    </Box>
  );
};

export default SectionContentArea;
