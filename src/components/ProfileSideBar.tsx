import React from 'react';
import { Button, IconButton } from '@mui/material';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ProfileSideBar = () => {
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <div
      className={`fixed left-0 top-0 z-10 h-full bg-white p-5 transition-all duration-300 ${isCollapse ? 'w-[80px]' : 'w-[15%] max-w-[350px]'} `}
    >
      <div className="mt-20">
        <div className="flex justify-end">
          <IconButton onClick={() => setIsCollapse(!isCollapse)}>
            {isCollapse ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        {!isCollapse && (
          <div className="flex h-[85vh] flex-col">
            <div className="mt-20 flex flex-1 flex-col gap-4">
              <Button href="/plans">Plans</Button>
              <Button href="/history">History</Button>
              <Button href="/settings">Settings</Button>
            </div>

            <Button href="/auth/logout">Logout</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSideBar;
