import Avatar from '@mui/material/Avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { type AvatarProps } from '@mui/material/Avatar';

export interface UserAvatarProps extends Omit<AvatarProps, 'sx' | 'children' | 'src' | 'alt'> {
  size?: number | string;
  clickable?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = '2rem',
  clickable = true,
  ...AvatarProps
}) => {
  const { data } = useSelector((state: RootState) => state.user);

  return (
    <Avatar
      sx={{ width: size, height: size, cursor: clickable ? 'pointer' : 'default' }}
      src={data?.avatarUrl}
      alt="User Avatar"
      {...AvatarProps}
    >
      {data?.email && data.email.length > 0 ? data.email.slice(0, 1).toUpperCase() : undefined}
    </Avatar>
  );
};

export default UserAvatar;
