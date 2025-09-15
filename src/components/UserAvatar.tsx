import Avatar from '@mui/material/Avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { type AvatarProps } from '@mui/material/Avatar';

export interface UserAvatarProps extends Omit<AvatarProps, 'sx' | 'children' | 'src' | 'alt'> {
  size?: number | string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size = 32, ...AvatarProps }) => {
  const { data } = useSelector((state: RootState) => state.user);

  return (
    <Avatar
      sx={{ width: size, height: size, cursor: 'pointer' }}
      src={data?.Avatar}
      alt="User Avatar"
      {...AvatarProps}
    >
      {data?.Email.slice(0, 1).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
