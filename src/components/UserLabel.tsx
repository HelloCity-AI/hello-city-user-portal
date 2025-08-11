'use client';

import React from 'react';

import Image from 'next/image';
interface UserData {
  UserName?: string;
  PreferredName?: string;
  Avatar?: string;
  LastJoinDate?: string;
}

const UserProfileCard: React.FC<UserData> = ({ UserName, PreferredName, Avatar, LastJoinDate }) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-xl hover:shadow-2xl">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white"
        data-testid="avatar-container"
      >
        {!Avatar ? (
          <span className="material-icons text-7xl text-gray-400">account_circle</span>
        ) : (
          <Image src={Avatar} alt="User Avatar" width={64} height={64} className="rounded-full" />
        )}
      </div>
      <div>
        <span className="flex text-xl font-bold">{UserName || 'Unknown User'}</span>
        <span className="flex text-indigo-200">@{PreferredName || 'UnknownNickname'}</span>
        <div className="mt-1 flex items-center gap-1 text-sm">
          <span className="material-icons text-base text-indigo-200">access_time</span>
          last login: {LastJoinDate || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
