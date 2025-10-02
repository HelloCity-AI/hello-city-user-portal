'use client';
import React, { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import UserProfileCard from './UserLabel';
import type { MenuOption } from '@/types/menu';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface DropdownProps {
  anchorElContent: ReactNode;
  disableIconButton?: boolean;
  dropdownOptions: MenuOption[];
  showUserLabel?: boolean;
  textAlignCenter?: boolean;
  layout?: 'vertical' | 'horizontal'; // Specify whether the dropdown items should be laid out vertically or horizontally
  transformOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  anchorOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  disableHover?: boolean;
}

const DropDown: React.FC<DropdownProps> = ({
  anchorElContent,
  disableIconButton,
  dropdownOptions,
  showUserLabel,
  textAlignCenter,
  layout = 'vertical',
  transformOrigin = { horizontal: 'right', vertical: 'top' },
  anchorOrigin = { horizontal: 'right', vertical: 'bottom' },
  disableHover,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Force re-render menu only on first open to fix positioning issue
  useEffect(() => {
    if (open && !hasRenderedOnce) {
      const timer = setTimeout(() => {
        setHasRenderedOnce(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, hasRenderedOnce]);

  const getMenuMarginTopSx = () => {
    let marginTop = '0.5rem';
    if (anchorOrigin.vertical === 'top') {
      marginTop = '-0.5rem';
    }
    if (anchorOrigin.vertical === 'center') {
      marginTop = '0rem';
    }

    return {
      '& .MuiPaper-root': {
        marginTop,
        backgroundColor: '#ffffff',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    };
  };

  const renderAnchorButton = () => {
    if (disableIconButton) {
      return (
        <Box
          component="button"
          onClick={(event) => setAnchorEl(event.currentTarget as HTMLElement)}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="open menu"
          sx={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
            borderRadius: '8px',
            transition: 'background-color 0.2s ease-out',
            ...(!disableHover && {
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // 对应 hover:bg-black/5
              },
            }),
          }}
        >
          {anchorElContent}
        </Box>
      );
    }

    return (
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget as HTMLElement)}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="open menu"
        disableRipple={disableHover}
      >
        {anchorElContent}
      </IconButton>
    );
  };

  return (
    <React.Fragment>
      {/* AnchorEL */}
      {renderAnchorButton()}
      {/* Menu Paper*/}
      <Menu
        key={Number(hasRenderedOnce)}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        layout={layout}
        sx={getMenuMarginTopSx()}
      >
        {/* User label area, will update when userprofile global statement is ready */}
        {showUserLabel && layout === 'vertical' && (
          <MenuItem sx={{ minHeight: 'auto', alignItems: 'flex-start' }}>
            <UserProfileCard AvatarImg={'/images/banner-image.jpeg'} />
          </MenuItem>
        )}
        {showUserLabel && layout === 'vertical' && <Divider />}
        {/* Dropdown items */}
        {dropdownOptions?.map((option: MenuOption) => {
          return (
            <React.Fragment key={option.id}>
              <MenuItem onClick={() => option.onClick()}>
                {option.icon && (
                  <ListItemIcon sx={{ mr: 1 }} data-testid={`${option.value}-icon`}>
                    {option.icon && <option.icon fontSize="small" />}
                  </ListItemIcon>
                )}
                <Typography
                  sx={textAlignCenter ? { textAlign: 'center', flexGrow: 1 } : {}}
                  variant="body2"
                >
                  {option.label}
                </Typography>
              </MenuItem>
              {option.divider && layout === 'vertical' && <Divider />}
            </React.Fragment>
          );
        })}
      </Menu>
    </React.Fragment>
  );
};

export default DropDown;
