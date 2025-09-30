'use client';

import React from 'react';
import Dropdown from '@/components/Dropdown';
import type { ReactNode } from 'react';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { Trans } from '@lingui/react';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { type MenuOption } from '@/types/menu';

interface ConversationHistoryMenuProps {
  trigger: ReactNode; // anchorElContent
  layout?: 'vertical' | 'horizontal';
  textAlignCenter?: boolean;
  transformOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  anchorOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  disableIconButton?: boolean;
  disableHover?: boolean;
  conversationId: string;
  onClickDelete: () => void;
  onClickEdit: () => void;
  modal: ReactNode;
}

/**
 * UserMenu
 * - Uses existing Dropdown component
 * - Data from useUserMenu()
 * - Intercepts the logout option to show a confirm modal
 */
const ConversationHistoryMenu: React.FC<ConversationHistoryMenuProps> = ({
  trigger,
  layout = 'vertical',
  textAlignCenter,
  transformOrigin,
  anchorOrigin,
  disableIconButton,
  disableHover,
  conversationId,
  onClickDelete,
  onClickEdit,
  modal,
}) => {
  const options: MenuOption[] = [
    {
      id: `edit-conversation-${conversationId}`,
      label: <Trans id="edit-conversation-title" message="Rename History" />,
      value: 'rename',
      icon: EditOutlined,
      divider: false,
      onClick: onClickEdit,
    },
    {
      id: `delete-conversation-${conversationId}`,
      label: <Trans id="delete-conversation" message="Delete Conversation" />,
      value: 'delete',
      icon: DeleteOutline,
      divider: false,
      onClick: onClickDelete,
    },
  ];

  return (
    <React.Fragment>
      <Dropdown
        anchorElContent={trigger}
        dropdownOptions={options}
        layout={layout}
        textAlignCenter={textAlignCenter}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        disableIconButton={disableIconButton}
        disableHover={disableHover}
      />
      {modal}
    </React.Fragment>
  );
};

export default ConversationHistoryMenu;
