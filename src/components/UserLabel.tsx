'use client';

import React from 'react';
import Image from 'next/image';
import { Avatar } from '@mui/material';
interface UserData {
  UserName?: string;
  PreferredName?: string;
  AvatarImg?: string;
  LastJoinDate?: string;
}

const UserProfileCard: React.FC<UserData> = ({
  UserName,
  PreferredName,
  AvatarImg,
  LastJoinDate,
}) => {
  return (
    <div className="flex items-center gap-5 rounded-2xl text-white">
      <div
        className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white"
        data-testid="avatar-container"
      >
        {!AvatarImg ? (
          <span className="material-icons text-8xl text-gray-400">account_circle</span>
        ) : (
          <Avatar
            data-testid="user-avatar"
            alt="User Avatar"
            src={AvatarImg}
            sx={{ width: 100, height: 100 }}
          />
        )}
      </div>
      <div>
        <span className="flex text-xl font-bold text-gray-500">{UserName || 'Unknown User'}</span>
        <span className="flex text-gray-500">@{PreferredName || 'UnknownNickname'}</span>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <span className="material-icons text-base text-gray-500">access_time</span>
          last login: {LastJoinDate || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
