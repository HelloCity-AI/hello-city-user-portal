'use client';

import React from 'react';
import { Avatar, Typography} from '@mui/material';

interface UserData {
  UserName?: string;
  EmailAdress?: string;
  AvatarImg?: string;
  LastJoinDate?: string;
  wrap?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const UserProfileCard: React.FC<UserData> = ({
  UserName,
  EmailAdress,
  AvatarImg,
  LastJoinDate,
  wrap = false,
  showTooltip = true,
  className = '',
}) => {
  const name = UserName || 'Unknown User';
  const email = EmailAdress || 'Unknown Email';
  const last = LastJoinDate || 'Unknown';
  const textMode = wrap ? 'break-words' : 'truncate';

  return (
    <Typography
      component="div"
      className={`flex w-full max-w-full items-center gap-5 rounded-2xl text-white ${className}`}
    >
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white sm:h-24 sm:w-24 md:h-28 md:w-28"
        data-testid="avatar-container"
      >
        {!AvatarImg ? (
          <span className="material-icons text-6xl text-gray-400 sm:text-7xl md:text-8xl">
            account_circle
          </span>
        ) : (
          <Avatar
            data-testid="user-avatar"
            alt="User Avatar"
            src={AvatarImg}
            sx={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <span
          className={`block text-xl font-bold text-gray-500 ${textMode}`}
          title={showTooltip ? name : undefined}
        >
          {name}
        </span>
        <span
          className={`block text-gray-500 ${textMode}`}
          title={showTooltip ? `@${email}` : undefined}
        >
          @{email}
        </span>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <span className="material-icons shrink-0 text-base text-gray-500">access_time</span>
          <span
            className={`block min-w-0 ${textMode}`}
            title={showTooltip ? `last login: ${last}` : undefined}
          >
            last login: {last}
          </span>
        </div>
      </div>
    </Typography>
  );
};

export default UserProfileCard;