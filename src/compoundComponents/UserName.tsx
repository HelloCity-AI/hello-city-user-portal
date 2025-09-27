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

  // Priority: Email > Fallback (User type only has Email property)
  const displayName = data?.Email || fallback;

  return <Typography {...typographyProps}>{displayName}</Typography>;
};

export default UserName;
