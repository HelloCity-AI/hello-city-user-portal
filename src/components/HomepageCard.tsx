import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';

interface HomepageCardProps {
  children: ReactNode;
  additionalClassName?: string;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  disableDefaultClass?: boolean;
}

const HomepageCard: React.FC<HomepageCardProps> = ({
  children,
  additionalClassName,
  variant = 'elevation',
  elevation = 0,
  disableDefaultClass,
}) => {
  const defaultClassName =
    'w-[85vw] md:w-[85vw] md:max-w-[360px] xl:min-w-[380px] xl:max-w-auto relative flex-grow';

  return (
    <Card
      variant={variant}
      elevation={variant === 'elevation' ? elevation : 0}
      className={clsx(!disableDefaultClass && defaultClassName, additionalClassName)}
    >
      {children}
    </Card>
  );
};

export default HomepageCard;
