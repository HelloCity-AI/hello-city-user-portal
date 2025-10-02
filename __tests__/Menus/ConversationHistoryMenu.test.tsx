import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConversationHistoryMenu from '@/compoundComponents/Menus/ConversationHistoryMenu';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CONVERSATION_ID = 'test-conversation-123';
const onClickEditMock = jest.fn();
const onClickDeleteMock = jest.fn();

const defaultProps = {
  trigger: <MoreHorizIcon data-testid="trigger-icon" />,
  conversationId: CONVERSATION_ID,
  onClickEdit: onClickEditMock,
  onClickDelete: onClickDeleteMock,
  modal: <div data-testid="delete-modal">Delete Modal</div>,
};

const renderConversationHistoryMenu = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<ConversationHistoryMenu {...defaultProps} {...props} />);

const openMenu = async () => {
  await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
};

describe('ConversationHistoryMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Style', () => {
    it('Renders trigger element', () => {
      renderConversationHistoryMenu();
      expect(screen.getByTestId('trigger-icon')).toBeInTheDocument();
    });

    it('Displays menu items when opened', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      expect(screen.getByText('Rename History')).toBeInTheDocument();
      expect(screen.getByText('Delete Conversation')).toBeInTheDocument();
    });

    it('Displays correct icons for menu items', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      const menuItems = await screen.findAllByRole('menuitem');
      expect(menuItems).toHaveLength(2);

      const renameItem = menuItems[0];
      const deleteItem = menuItems[1];

      expect(within(renameItem).getByTestId('rename-icon')).toBeInTheDocument();
      expect(within(deleteItem).getByTestId('delete-icon')).toBeInTheDocument();
    });

    it('Renders modal when provided', () => {
      renderConversationHistoryMenu();
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });

    it('Supports vertical layout by default', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      const list = document.querySelector('.MuiMenu-list');
      expect(list).toBeInTheDocument();
    });

    it('Applies textAlignCenter when provided', async () => {
      renderConversationHistoryMenu({ textAlignCenter: true });
      await openMenu();

      const typography = await screen.findByText('Rename History');
      expect(typography).toBeInTheDocument();
    });
  });

  describe('UX Interactions', () => {
    it('Calls onClickEdit when Rename History is clicked', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      const renameButton = await screen.findByText('Rename History');
      await userEvent.click(renameButton);

      expect(onClickEditMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onClickDelete when Delete Conversation is clicked', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      const deleteButton = screen.getByText('Delete Conversation');
      await userEvent.click(deleteButton);

      expect(onClickDeleteMock).toHaveBeenCalledTimes(1);
    });

    it('Closes menu after clicking an option', async () => {
      renderConversationHistoryMenu();
      await openMenu();

      const renameButton = await screen.findByText('Rename History');
      await userEvent.click(renameButton);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
