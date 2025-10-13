import React from 'react';
import Link from 'next/link';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import type { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import { useTryHelloCity } from '@/hooks/useTryHelloCity';
import type { NavItem } from './navConfig';

interface NavDrawerProps extends DrawerProps {
  menuStack: NavItem[][];
  activeSubMenuIndex: number | null;
  setActiveSubMenuIndex: (value: number | null) => void;
  closeDrawer: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({
  menuStack,
  activeSubMenuIndex,
  setActiveSubMenuIndex,
  closeDrawer,
  anchor = 'top',
  className = 'z-40',
  ...DrawerProps
}) => {
  const {
    onClick: tryHelloCityClick,
    isLoading,
    LoginModal,
    label: tryHelloCityLabel,
  } = useTryHelloCity();
  const translateX = activeSubMenuIndex !== null ? '-100%' : '0%';

  const handleClick = (index: number) => {
    const currentMenu = menuStack[menuStack.length - 1];
    if (currentMenu[index].childrenItem) {
      setActiveSubMenuIndex(index);
      return;
    }
    if (currentMenu[index].onClick) currentMenu[index].onClick();
    closeDrawer();
  };

  if (!menuStack.length) return null;

  return (
    <Drawer {...DrawerProps} anchor={anchor} className={className}>
      <Button
        variant="tertiary"
        onClick={tryHelloCityClick}
        disabled={isLoading}
        disableFocusRipple
        className="mx-7 mb-5 mt-20 w-auto text-nowrap rounded-full bg-primary font-semibold text-white"
      >
        {tryHelloCityLabel}&nbsp;&nbsp;→
      </Button>
      <Divider className="mx-6 border-t-[0.1px] border-dotted opacity-50" />
      <Box component="div" className="w-full px-7">
        <Box component="div" className="overflow-hidden">
          <Box
            component="div"
            className="flex transition-transform"
            sx={{
              width: `${100 * menuStack.length}%`,
              transform: `translateX(${translateX})`,
            }}
          >
            {menuStack.map((menu, level) => {
              return (
                <List sx={{ width: `${100}%`, flexShrink: 0 }} key={level}>
                  {menu.map((item, itemIndex) => {
                    const isLink = !!item.href && !item.childrenItem;

                    return (
                      <ListItemButton
                        key={item.id}
                        component={isLink ? Link : 'button'}
                        href={isLink ? item.href : undefined}
                        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                        onClick={() => handleClick(itemIndex)}
                      >
                        <Typography component="span" variant="body2">
                          {item.label}
                        </Typography>
                        {item.childrenItem && (
                          <ArrowForwardIosOutlinedIcon
                            sx={{ fontSize: 12, color: 'secondary.contrastText' }}
                          />
                        )}
                      </ListItemButton>
                    );
                  })}
                </List>
              );
            })}
          </Box>
        </Box>
      </Box>
      {LoginModal}
    </Drawer>
  );
};

export default NavDrawer;
