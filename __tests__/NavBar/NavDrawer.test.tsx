import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavDrawer from '@/compoundComponents/NavBar/NavDrawer';
import { TestProviders } from '../utils/TestWrapper';
import { mockNavItems } from './mockData';

const mockMainMenu = mockNavItems;
const mockSubMenu = mockMainMenu.find((item) => item.id === 'services')?.childrenItem || [];

const renderNavDrawer = (props = {}) => {
  const defaultProps = {
    open: true,
    menuStack: [mockMainMenu],
    activeSubMenuIndex: null,
    setActiveSubMenuIndex: jest.fn(),
    closeDrawer: jest.fn(),
    onClose: jest.fn(),
    ...props,
  };

  return render(
    <TestProviders>
      <NavDrawer {...defaultProps} />
    </TestProviders>,
  );
};

const clickMenuItem = (itemText: string) => {
  const menuItem = screen.getByText(itemText);
  fireEvent.click(menuItem);
  return menuItem;
};

describe('NavDrawer - Navigation drawer with single-level submenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Rendering', () => {
    it('Renders without crashing', () => {
      renderNavDrawer();
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('Renders Try HelloCiti button', () => {
      renderNavDrawer();
      expect(screen.getByText('Try HelloCiti', { exact: false })).toBeInTheDocument();
    });

    it('Renders menu items correctly', () => {
      renderNavDrawer();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('Shows arrow for items with children', () => {
      renderNavDrawer();

      // Services item should have an arrow icon since it has children
      const servicesText = screen.getByText('Services');
      const servicesButton = servicesText.closest('button');
      expect(servicesButton).toBeInTheDocument();

      // Check if the Services button contains an arrow icon
      const svgIcon = servicesButton?.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe('Menu Navigation', () => {
    it('Calls onClick for items without children', () => {
      const closeDrawer = jest.fn();
      renderNavDrawer({ closeDrawer });

      clickMenuItem('Home');
      expect(mockMainMenu[0].onClick).toHaveBeenCalledTimes(1);
      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    it('Sets submenu index for items with children', () => {
      const setActiveSubMenuIndex = jest.fn();
      const closeDrawer = jest.fn();
      renderNavDrawer({ setActiveSubMenuIndex, closeDrawer });

      clickMenuItem('Services');
      expect(setActiveSubMenuIndex).toHaveBeenCalledTimes(1);
      expect(setActiveSubMenuIndex).toHaveBeenCalledWith(2); // Services is at index 2 in mockNavItems (chat commented out)
      expect(closeDrawer).toHaveBeenCalledTimes(0);
    });

    it('Shows submenu when subMenuIdx is set', () => {
      renderNavDrawer({
        menuStack: [mockMainMenu, mockSubMenu],
        activeSubMenuIndex: 1,
      });

      expect(screen.getByText('Web Dev')).toBeInTheDocument();
      expect(screen.getByText('Mobile Dev')).toBeInTheDocument();
    });

    it('Shows correct content when submenu is active', async () => {
      renderNavDrawer({
        menuStack: [mockMainMenu, mockSubMenu],
        activeSubMenuIndex: 1,
        open: true,
      });

      expect(screen.getByText('Web Dev')).toBeInTheDocument();
      expect(screen.getByText('Mobile Dev')).toBeInTheDocument();
    });

    it('Returns null when menuStack is empty', () => {
      const { container } = renderNavDrawer({ menuStack: [] });

      expect(container.firstChild).toBeNull();
    });

    it('Renders menu content with submenu', () => {
      renderNavDrawer({
        menuStack: [mockMainMenu, mockSubMenu],
        open: true,
      });

      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Try HelloCiti', { exact: false })).toBeInTheDocument();
    });

    it('Handles click on submenu items', () => {
      const closeDrawer = jest.fn();
      renderNavDrawer({
        menuStack: [mockMainMenu, mockSubMenu],
        activeSubMenuIndex: 1,
        closeDrawer,
      });

      clickMenuItem('Web Dev');
      expect(mockSubMenu[0].onClick).toHaveBeenCalledTimes(1);
      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });
  });
});
