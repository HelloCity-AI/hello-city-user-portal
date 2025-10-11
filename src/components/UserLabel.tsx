'use client';

import React, { useEffect } from 'react';
import { Avatar, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { fetchUser } from '@/store/slices/user';

interface UserData {
  UserName?: string;
  EmailAddress?: string;
  AvatarImg?: string;
  LastJoinDate?: string;
  wrap?: boolean;
  showTooltip?: boolean;
  className?: string;
  autoFetch?: boolean;
}

function formatLocalDateTime(input?: string | Date, locale?: string, timeZone?: string) {
  if (!input) return 'Unknown';
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return String(input);

  return new Intl.DateTimeFormat(
    locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-AU'),
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    },
  ).format(d);
}

const UserProfileCard: React.FC<UserData> = ({
  UserName,
  EmailAddress,
  AvatarImg,
  LastJoinDate,
  wrap = false,
  showTooltip = true,
  className = '',
  autoFetch = true,
}) => {
  const dispatch = useDispatch();
  const { data: storeUser, isLoading, error } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    if (!autoFetch) return;

    const noProps = !UserName && !EmailAddress && !AvatarImg && !LastJoinDate;

    if (noProps && !storeUser && !isLoading) {
      dispatch(fetchUser());
    }
  }, [autoFetch, UserName, EmailAddress, AvatarImg, LastJoinDate, storeUser, isLoading, dispatch]);

  const name = UserName ?? storeUser?.username ?? 'Unknown User';

  const email = EmailAddress ?? storeUser?.email ?? 'Unknown Email';

  const avatar = AvatarImg ?? storeUser?.avatarUrl ?? storeUser?.avatar ?? '';

  const last = LastJoinDate ?? storeUser?.lastJoinDate ?? 'Unknown';

  const textMode = wrap ? 'break-words' : 'truncate';

  const formattedLast = formatLocalDateTime(last);

  if (isLoading && !UserName && !EmailAddress && !AvatarImg && !LastJoinDate) {
    return (
      <div
        className={`flex w-full max-w-full items-center gap-5 rounded-2xl text-white ${className}`}
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white sm:h-24 sm:w-24 md:h-28 md:w-28">
          <Skeleton variant="circular" width="100%" height="100%" />
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    );
  }

  const subtitle = error ? `${email}  •  load error` : `${email}`;

  return (
    <div
      className={`flex w-full max-w-full items-center gap-5 rounded-2xl text-white ${className}`}
    >
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white sm:h-24 sm:w-24 md:h-28 md:w-28"
        data-testid="avatar-container"
      >
        {!avatar ? (
          <span className="material-icons text-6xl text-gray-400 sm:text-7xl md:text-8xl">
            account_circle
          </span>
        ) : (
          <Avatar
            data-testid="user-avatar"
            alt="User Avatar"
            src={avatar}
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
          title={showTooltip ? subtitle : undefined}
        >
          {subtitle}
        </span>

        {/* <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <span
            className={`block min-w-0 ${textMode}`}
            title={showTooltip ? `last login: ${last}` : undefined}
          >
            last login: {formattedLast}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default UserProfileCard;
