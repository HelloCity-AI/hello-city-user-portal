'use client';

import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { twMerge } from 'tailwind-merge';

interface HamburgerMenuIconProps {
  isOpen: boolean;
  onClick: () => void;
  size?: number;
  color?: string;
  className?: string;
}

const HamburgerMenuIcon: React.FC<HamburgerMenuIconProps> = ({
  isOpen,
  onClick,
  size = 24,
  color = 'currentColor',
  className = '',
}) => {
  const baseLineStyles = {
    display: 'block',
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: color,
    borderRadius: 1.5,
    left: 0,
  };
  const animatedLineStyles = {
    ...baseLineStyles,
    opacity: 1,
    transformOrigin: 'center',
    transition: 'transform 0.3s ease-in-out, top 0.3s ease-in-out',
  };

  return (
    <IconButton
      onClick={onClick}
      className={twMerge('p-2', className)}
      style={{
        width: size + 16,
        height: size + 16,
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      disableFocusRipple
    >
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          transform: 'rotate(0deg)',
          transition: '0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            ...animatedLineStyles,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            top: isOpen ? size / 2 - 1.5 : 2,
          }}
        />
        <Box
          sx={{
            ...baseLineStyles,
            opacity: isOpen ? 0 : 1,
            top: size / 2 - 1.5,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
        <Box
          sx={{
            ...animatedLineStyles,
            transform: isOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
            top: isOpen ? size / 2 - 1.5 : size - 5,
          }}
        />
      </Box>
    </IconButton>
  );
};

export default HamburgerMenuIcon;
