'use client';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { useState, useRef, useEffect, type FormEvent } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import { mergeClassNames } from '@/utils/classNames';
import { HOVER_EFFECTS, TEXT_STYLES, ICON_STYLES } from '../../constants';
import ConversationHistoryMenu from '@/compoundComponents/Menus/ConversationHistoryMenu';
import useDeleteConversation from '@/hooks/modals/useDeleteConversationHistory';
import { CircularProgress } from '@mui/material';

interface HistoryItemProps {
  text: string;
  isCollapsed: boolean;
  onClick?: () => void;
  isActive?: boolean;
  id: string;
  onRename: (conversationId: string, updatedTitle: string) => void;
  onDelete: (conversationId: string) => void;
  isLoading: boolean;
}

/**
 * History Item Component (Individual History Entry)
 * Expanded: Text(176px) + ResponsiveIconContainer(32px) + ResponsiveIconContainer(32px) = 240px
 * Collapsed: Text(0px) + ResponsiveIconContainer(0px) = 0px (completely hidden)
 * Uses Tailwind CSS for styling with responsive width transitions
 */
export default function HistoryItem({
  text,
  isCollapsed,
  onClick,
  isActive,
  id,
  onRename,
  onDelete,
  isLoading,
}: HistoryItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(text);
  const { show: showDeleteModal, ModalNode: DeleteModal } = useDeleteConversation(() =>
    onDelete(id),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-select text when entering edit mode with delayed focus
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Only submit if title actually changed
    const trimmedEditText = editText.trim();
    const trimmedOriginalText = text.trim();

    if (trimmedEditText !== trimmedOriginalText && trimmedEditText !== '') {
      onRename(id, trimmedEditText);
    }

    if (trimmedEditText === '') {
      setEditText(text);
    }

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(text);
  };

  // Semantic display state for better readability
  const displayState = {
    // Basic states
    isExpanded: !isCollapsed,
    isClickable: !!onClick,
    // Visual states
    showEditingBackground: isEditing,
    showActiveBackground: isActive && !isCollapsed && !isEditing,
    showTransparentBackground: !isEditing && (!isActive || isCollapsed),
    // Interaction states
    showPointerCursor: !!onClick,
    showDefaultCursor: !onClick,
    // Hover states
    showActiveHover: !!onClick && !isEditing && isActive,
    showInactiveHover: !!onClick && !isEditing && !isActive,
  };

  return (
    <ItemWrapper variant="compact">
      <form onSubmit={handleSubmit}>
        <div
          className={mergeClassNames(
            'flex h-10 items-center overflow-hidden rounded-lg transition-[width] duration-300 ease-out',
            {
              'w-0': isCollapsed,
              'w-auto': displayState.isExpanded,
            },
            {
              'bg-black/5': displayState.showEditingBackground,
              'bg-blue-500/10': displayState.showActiveBackground,
              'bg-transparent': displayState.showTransparentBackground,
            },
            {
              'cursor-pointer': displayState.showPointerCursor,
              'cursor-default': displayState.showDefaultCursor,
            },
            {
              [HOVER_EFFECTS.blue]: displayState.showActiveHover,
              [HOVER_EFFECTS.light]: displayState.showInactiveHover,
            },
          )}
        >
          {/* History text container - 176px -> 0px (responsive width) */}
          <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[176px]">
            <div onClick={isEditing ? undefined : onClick} className="w-full">
              {isEditing ? (
                <TextField
                  inputRef={inputRef}
                  value={editText}
                  onChange={({ target: { value } }) => setEditText(value)}
                  variant="standard"
                  size="small"
                  onBlur={handleCancel}
                  onKeyDown={handleKeyDown}
                  sx={{
                    '& .MuiInput-root:before': { display: 'none' },
                    '& .MuiInput-root:after': { display: 'none' },
                    '& .MuiInput-root:hover:not(.Mui-disabled):before': { display: 'none' },
                    '& .MuiInput-input': {
                      fontSize: '0.875rem',
                      color: isActive ? 'primary.main' : 'text.primary',
                      lineHeight: 'normal',
                      padding: '0 !important',
                      margin: '0 !important',
                    },
                  }}
                  className={mergeClassNames('w-full font-normal', TEXT_STYLES.sidebarText)}
                />
              ) : (
                <Typography
                  variant="body2"
                  className={mergeClassNames(
                    TEXT_STYLES.sidebarText,
                    'overflow-hidden truncate',
                    isActive ? 'font-medium text-primary-color' : 'font-normal text-primaryBlack',
                  )}
                >
                  {text}
                </Typography>
              )}
            </div>
          </ResponsiveContainer>
          <ResponsiveIconContainer isCollapsed={isCollapsed} responsive>
            {isEditing && (
              <IconButton type="submit" onMouseDown={(e) => e.preventDefault()}>
                <CheckIcon className={ICON_STYLES.small} />
              </IconButton>
            )}
          </ResponsiveIconContainer>
          <ResponsiveIconContainer isCollapsed={isCollapsed} responsive>
            {!isEditing && !isLoading ? (
              <ConversationHistoryMenu
                trigger={<MoreHorizIcon className={ICON_STYLES.small} />}
                conversationId={id}
                onClickDelete={showDeleteModal}
                onClickEdit={handleEdit}
                modal={DeleteModal}
              />
            ) : !isEditing && isLoading ? (
              <IconButton loading={true} loadingIndicator={<CircularProgress size="20px" />}>
                <CloseIcon className={ICON_STYLES.small} />
              </IconButton>
            ) : (
              <IconButton onClick={handleCancel} onMouseDown={(e) => e.preventDefault()}>
                <CloseIcon className={ICON_STYLES.small} />
              </IconButton>
            )}
          </ResponsiveIconContainer>
        </div>
      </form>
    </ItemWrapper>
  );
}
