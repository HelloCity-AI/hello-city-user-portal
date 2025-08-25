import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';
import Logout from '@mui/icons-material/Logout';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Trans } from '@lingui/react';
import type { DropdownOptionProps } from './Dropdown';

export const userMenuOptions: DropdownOptionProps[] = [
  {
    label: <Trans id="Profile" message="Profile" />,
    value: 'profile',
    icon: PersonOutlineIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: <Trans id="Settings" message="Settings" />,
    value: 'settings',
    icon: SettingsOutlinedIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: <Trans id="Theme" message="Theme" />,
    value: 'theme',
    icon: ContrastOutlinedIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: <Trans id="Subscription" message="Subscription" />,
    value: 'subscription',
    icon: PaymentOutlinedIcon,
    divider: true,
    onClick: (value: string) => alert(value),
  },
  {
    label: <Trans id="Logout" message="Logout" />,
    value: 'logout',
    icon: Logout,
    divider: false,
    onClick: (value: string) => alert(value),
  },
];

export const languageMenuOptions: DropdownOptionProps[] = [
  {
    label: 'English',
    value: 'en',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: '中文',
    value: 'zh',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: 'Español',
    value: 'es',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: 'Français',
    value: 'fr',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: 'Deutsch',
    value: 'de',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: '日本語',
    value: 'ja',
    icon: null,
    divider: false,
    onClick: () => {},
  },
  {
    label: '한국어',
    value: 'ko',
    icon: null,
    divider: false,
    onClick: () => {},
  },
];
