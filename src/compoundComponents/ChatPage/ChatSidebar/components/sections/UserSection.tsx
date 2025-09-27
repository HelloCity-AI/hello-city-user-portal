'use client';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import UserAvatar from '@/compoundComponents/UserAvatar';
import UserName from '@/compoundComponents/UserName';

interface UserSectionProps {
  isCollapsed: boolean;
  onClick: () => void;
}

/**
 * User Section Component - Sidebar bottom user information area
 * Expanded: Avatar container(40px) + Username container(160px) + Arrow container(40px) = 240px
 * Collapsed: Avatar container(40px) + Username container(0px) + Arrow container(0px) = 40px
 * Uses Tailwind CSS classes for responsive width control
 */
export default function UserSection({ isCollapsed, onClick }: UserSectionProps) {
  return (
    <ItemWrapper variant="none">
      <div
        className="flex h-12 cursor-pointer items-center rounded-lg transition-colors duration-200 ease-out hover:bg-black/5"
        onClick={onClick}
      >
        {/* Avatar container - Fixed 40px width, uses ResponsiveIconContainer */}
        <ResponsiveIconContainer>
          {/* <Avatar className="h-7 w-7 bg-primary-color text-sm font-semibold text-white shadow-[0_2px_8px_rgba(59,130,246,0.2)]">
            {userInitial}
          </Avatar> */}
          <UserAvatar size="1.75rem" />
        </ResponsiveIconContainer>

        {/* Username container - 160px(w-40) when expanded, 0px when collapsed, contains username text */}
        <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-40">
          <UserName
            variant="body2"
            className="select-none overflow-hidden truncate whitespace-nowrap pl-3 text-sm font-medium text-primaryBlack"
          />
        </ResponsiveContainer>

        {/* Arrow container - 40px(w-10) when expanded, 0px when collapsed, contains up arrow icon */}
        <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-10">
          <div className="flex w-full items-center justify-center">
            <KeyboardArrowUpOutlinedIcon className="text-base text-gray-500 transition-transform duration-200 ease-out" />
          </div>
        </ResponsiveContainer>
      </div>
    </ItemWrapper>
  );
}
