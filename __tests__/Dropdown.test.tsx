import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { act, render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '@/components/Dropdown';
import renderWithTheme from './utils/renderWithTheme';
import { i18n } from '@lingui/core';
import { I18nTestWrapper } from './utils/TestWrapper';
import { profileLabel } from '@/components/dropdownMenuOptions';
import { messages as zhMessages } from '@/locales/zh/messages';
import type { DropdownOptionProps } from '@/components/Dropdown';

const fireMenuItem = jest.fn();
const baseTestOptions: DropdownOptionProps[] = [
  {
    label: 'Profile',
    value: 'profile',
    icon: AccountCircleIcon,
    divider: false,
    onClick: fireMenuItem,
  },
  {
    label: 'Logout',
    value: 'logout',
    icon: null,
    divider: true,
    onClick: fireMenuItem,
  },
];
const testOptionsWithoutIcon: DropdownOptionProps[] = [
  { label: 'Profile', value: 'profile', onClick: fireMenuItem },
];
const translationTestOption: DropdownOptionProps[] = [
  { label: profileLabel, value: 'profile', onClick: fireMenuItem },
];

const renderDropdown = (props = {}) => {
  return renderWithTheme(
    <Dropdown anchorElContent={<span>open</span>} dropdownOptions={baseTestOptions} {...props} />,
  );
};

const renderDropdownAndOpenMenu = async (props = {}) => {
  renderDropdown(props);
  await act(() => userEvent.click(screen.getByRole('button', { name: /open menu/i })));
};

describe('DropDown component', () => {
  describe('UI Style', () => {
    it('Renders only trigger button on initial load', () => {
      renderDropdown();

      const button = screen.getByRole('button', { name: /open menu/i });
      const menu = screen.queryByRole('menu');

      expect(button).toBeInTheDocument();
      expect(button).not.toHaveAttribute('aria-expanded');
      expect(menu).not.toBeInTheDocument();
    });

    it('Opens menu and renders items on button click', async () => {
      await renderDropdownAndOpenMenu();

      const menuItem = await screen.findAllByRole('menuitem');

      expect(await screen.findByRole('menu')).toBeVisible();
      expect(menuItem).toHaveLength(baseTestOptions.length);
      expect(menuItem[0]).toHaveTextContent('Profile');
      expect(menuItem[1]).toHaveTextContent('Logout');
      expect(within(menuItem[0]).getByTestId('profile-icon')).toBeVisible();
      expect(within(menuItem[1]).queryByTestId('logout-icon')).not.toBeInTheDocument();
    });

    it('Renders Divider when option.divider=true', async () => {
      await renderDropdownAndOpenMenu({ divider: true });
      expect(await screen.findAllByRole('separator')).toHaveLength(1);
    });

    it('Items are rendered vertically when layout = vertical as default value', async () => {
      await renderDropdownAndOpenMenu();
      const list = document.querySelector('.MuiMenu-list');
      expect(list).toHaveClass('MuiMenu-list');
    });

    it('Items are rendered horizontally when layout = horizontal', async () => {
      await renderDropdownAndOpenMenu({ layout: 'horizontal' });
      const list = document.querySelector('.MuiMenu-list');
      expect(list).toHaveClass('MuiMenu-list');
    });

    it('User label is rendered if showUserLabel = true', async () => {
      renderDropdownAndOpenMenu({ showUserLabel: true });
      expect(await screen.findByText(/Leon/i)).toBeInTheDocument();
    });

    it('Applied centered text align when textAlignCenter = true', async () => {
      renderDropdownAndOpenMenu({ textAlignCenter: true });
      const typography = await screen.findByText('Profile');
      expect(typography).toHaveStyle({ textAlign: 'center', flexGrow: 1 });
    });

    it('Uses negative margin when popup opens upward (vertical="top")', async () => {
      await renderDropdownAndOpenMenu({
        dropdownOptions: testOptionsWithoutIcon,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      const paper = document.querySelector('.MuiPaper-root') as HTMLElement;
      expect(paper).toHaveStyle({ marginTop: '-0.5rem' });
    });

    it('Uses zero margin when vertically centered (vertical="center")', async () => {
      await renderDropdownAndOpenMenu({
        dropdownOptions: testOptionsWithoutIcon,
        anchorOrigin: { vertical: 'center', horizontal: 'right' },
      });
      const paper = document.querySelector('.MuiPaper-root') as HTMLElement;
      expect(paper).toHaveStyle({ marginTop: '0rem' });
    });
  });

  describe('UX interactions', () => {
    beforeEach(async () => {
      await renderDropdownAndOpenMenu({ dropdownOptions: testOptionsWithoutIcon });
    });

    it('Onclick fired and menu closes after clicking an item', async () => {
      expect(await screen.findByRole('menu')).toBeInTheDocument();

      await userEvent.click(screen.getByText('Profile'));

      expect(fireMenuItem).toHaveBeenCalledTimes(1);
      expect(fireMenuItem).toHaveBeenCalledWith('profile');
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('Menu closes after clicking outside', async () => {
      expect(await screen.findByRole('menu')).toBeInTheDocument();

      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('Menu closes after press esc', async () => {
      expect(await screen.findByRole('menu')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Translations', () => {
    it('Should show Chinese text when locale is zh', async () => {
      i18n.load({ zh: zhMessages });
      i18n.activate('zh');

      render(
        <I18nTestWrapper>
          <Dropdown anchorElContent={<span>open</span>} dropdownOptions={translationTestOption} />
        </I18nTestWrapper>,
      );

      await userEvent.click(screen.getByRole('button', { name: /open menu/i }));

      expect(screen.getByText('个人资料')).toBeInTheDocument();
    });
  });
});
