import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';
import Logout from '@mui/icons-material/Logout';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Trans } from '@lingui/react';
import type { DropdownOptionProps } from './Dropdown';

const profileLabel = <Trans id={`Profile`}>Profile</Trans>;
const settingsLabel = <Trans id={`Settings`}>Settings</Trans>;
const themeLabel = <Trans id={`Theme`}>Theme</Trans>;
const subscriptionLabel = <Trans id={`Subscription`}>Subscription</Trans>;
const logoutLabel = <Trans id={`Logout`}>Logout</Trans>;

export const userMenuOptions: DropdownOptionProps[] = [
  {
    label: profileLabel,
    value: 'profile',
    icon: PersonOutlineIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: settingsLabel,
    value: 'settings',
    icon: SettingsOutlinedIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: themeLabel,
    value: 'theme',
    icon: ContrastOutlinedIcon,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: subscriptionLabel,
    value: 'subscription',
    icon: PaymentOutlinedIcon,
    divider: true,
    onClick: (value: string) => alert(value),
  },
  {
    label: logoutLabel,
    value: 'logout',
    icon: Logout,
    divider: false,
    onClick: (value: string) => alert(value),
  },
];

export const languageMenuOptions: DropdownOptionProps[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: '繁體中文',
    value: 'zh-TW',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: 'English',
    value: 'en-UK',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: 'Français',
    value: 'fr-FR',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: 'Deutsch',
    value: 'de-DE',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: '日本語',
    value: 'ja-JP',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
  {
    label: '한국어',
    value: 'ko-KR',
    icon: null,
    divider: false,
    onClick: (value: string) => alert(value),
  },
];
