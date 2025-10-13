import { Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { type TypographyProps } from '@mui/material/Typography';

export interface UserNameProps extends Omit<TypographyProps, 'children'> {
  fallback?: string;
}

const UserName: React.FC<UserNameProps> = ({ fallback = 'Guest User', ...typographyProps }) => {
  const { data } = useSelector((state: RootState) => state.user);

  // Priority: email > Fallback
  const displayName = data?.username || fallback;
  const emailAddress = data?.email || fallback;

  return (
    <>
      <Typography {...typographyProps}>
        {displayName}
        <br />
        <Typography variant="body2" color="text.secondary">
          {emailAddress}
        </Typography>
      </Typography>
    </>
  );
};

export default UserName;
