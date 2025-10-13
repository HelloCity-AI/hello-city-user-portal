'use client';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import UserAvatar from '@/compoundComponents/UserAvatar';
import UserName from '@/compoundComponents/UserName';
import UserMenu from '@/compoundComponents/Menus/UserMenu';
import IconButton from '@mui/material/IconButton';

interface UserSectionProps {
  isCollapsed: boolean;
}

/**
 * User Section Component - Sidebar bottom user information area with integrated UserMenu
 * Expanded: Avatar container(32px) + Username container(168px) + Arrow container(40px) = 240px
 * Collapsed: Avatar container(32px) + Username container(0px) + Arrow container(0px) = 32px
 * Integrates UserMenu dropdown functionality internally
 */
export default function UserSection({ isCollapsed }: UserSectionProps) {
  return (
    <ItemWrapper variant="none">
      <UserMenu
        trigger={
          <div className="flex h-12 items-center rounded-lg">
            {/* Avatar container - Fixed 32px width, uses ResponsiveIconContainer */}
            <ResponsiveIconContainer>
              <UserAvatar size="1.75rem" />
            </ResponsiveIconContainer>

            {/* Username container - 168px when expanded, 0px when collapsed, contains username text */}
            <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[168px]">
              <UserName
                variant="body2"
                className="select-none overflow-hidden truncate whitespace-nowrap pl-3 text-left text-sm font-medium text-primaryBlack"
              />
            </ResponsiveContainer>

            {/* Arrow container - 40px(w-10) when expanded, 0px when collapsed, contains up arrow icon */}
            <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-10">
              <IconButton
                component="div"
                className="flex w-full items-center justify-center"
                disableRipple
              >
                <KeyboardArrowUpOutlinedIcon className="text-base text-gray-500 transition-transform duration-200 ease-out" />
              </IconButton>
            </ResponsiveContainer>
          </div>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableIconButton={true}
      />
    </ItemWrapper>
  );
}
