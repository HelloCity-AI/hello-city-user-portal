'use client';

import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Trans } from '@lingui/react';
import ActionButton from '../ui/ActionButton';
import { ICON_STYLES } from '../../constants';
import SearchChatMenu from '@/compoundComponents/Menus/SearchChatMenu';
import { useRouter, useParams } from 'next/navigation';

interface ActionsSectionProps {
  isCollapsed: boolean;
  onNewChat: () => void;
}

/**
 * Main Actions Section - Manages functional button groups
 * Contains action buttons like New Chat, Search Chat etc.
 *
 * Layout: Vertical stack of ActionButton components
 * Each button: Icon(40px) + Text(200px) when expanded, Icon(40px) only when collapsed
 *
 * Usage: Primary actions area for chat functionality
 */
export default function ActionsSection({ isCollapsed, onNewChat }: ActionsSectionProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      
      <ActionButton
        icon={<AddIcon className={ICON_STYLES.action} />}
        text={<Trans id="sidebar.actions.newChat" message="New Chat" />}
        isCollapsed={isCollapsed}
        onClick={onNewChat}
      />

      
      <SearchChatMenu
        trigger={
          <ActionButton
            icon={<SearchIcon className={ICON_STYLES.action} />}
            text={<Trans id="sidebar.actions.searchChat" message="Search Chat" />}
            isCollapsed={isCollapsed}
            onClick={() => {}} 
          />
        }
        onSelect={(id) => router.push(`/${params.lang}/assistant/${id}`)}
      />
    </>
  );
}
