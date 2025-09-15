'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import type { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { userMenuOptions } from '@/components/dropdownMenuOptions.example';
import { UserProfileCard } from '@/components';

interface UserDrawerProps extends DrawerProps {
  closeDrawer: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({
  closeDrawer,
  anchor = 'top',
  className = 'z-40',
  ...drawerProps
}) => {
  // args type to be updated
  const handleClick = (menuAction: (value: string) => void, value: string) => {
    menuAction(value);
    closeDrawer();
  };

  return (
    <Drawer {...drawerProps} onClose={closeDrawer} anchor={anchor} className={className}>
      <Box component="div" className="mx-5 mt-20">
        <UserProfileCard AvatarImg={'/images/banner-image.jpeg'} UserName="Leon" />
      </Box>
      <Divider className="mx-6 mt-5 border-t-[0.1px] border-dotted opacity-50" />

      <List className="px-7">
        {userMenuOptions.map((option) => {
          return (
            <React.Fragment key={option.value}>
              <ListItemButton onClick={() => handleClick(option.onClick, option.value)}>
                {option.icon && (
                  <ListItemIcon sx={{ mr: 1 }} data-testid={`${option.value}-icon`}>
                    <option.icon fontSize="small" sx={{ color: 'secondary.contrastText' }} />
                  </ListItemIcon>
                )}
                <Typography variant="body2" className="font-medium">
                  {option.label}
                </Typography>
              </ListItemButton>
              {option.divider && (
                <Divider className="mx-6 border-t-[0.1px] border-dotted opacity-50" />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Drawer>
  );
};

export default UserDrawer;
