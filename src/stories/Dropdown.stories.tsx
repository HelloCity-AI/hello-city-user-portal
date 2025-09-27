import ContrastOutlinedIcon from '@mui/icons-material/ContrastOutlined';
import Logout from '@mui/icons-material/Logout';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import Dropdown from '@/components/Dropdown';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MenuOption } from '@/types/menu';
import Box from '@mui/material/Box';
interface DropdownDisplayProps {
  disableIconButton: boolean;
  dropdownOptions: MenuOption[];
  showUserLabel?: boolean;
  textAlignCenter?: boolean;
  layout?: 'vertical' | 'horizontal'; // Specify whether the dropdown items should be laid out vertically or horizontally
  transformOriginHorizontal: 'left' | 'center' | 'right';
  transformOriginVertical: 'top' | 'center' | 'bottom';
  anchorOriginHorizontal: 'left' | 'center' | 'right';
  anchorOriginVertical: 'top' | 'center' | 'bottom';
}

const userMenuDisplayOptions: MenuOption[] = [
  {
    id: 'profile',
    label: 'Profile',
    value: 'profile',
    icon: PaymentOutlinedIcon,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'settings',
    label: 'Settings',
    value: 'settings',
    icon: SettingsOutlinedIcon,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'theme',
    label: 'Theme',
    value: 'theme',
    icon: ContrastOutlinedIcon,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'subscription',
    label: 'Subscription',
    value: 'subscription',
    icon: PaymentOutlinedIcon,
    divider: true,
    onClick: (value) => alert(value),
  },
  {
    id: 'logout',
    label: 'Logout',
    value: 'logout',
    icon: Logout,
    divider: false,
    onClick: (value) => alert(value),
  },
];

const languageMenuDisplayOptions: MenuOption[] = [
  {
    id: 'zh-cn',
    label: '简体中文',
    value: 'zh-CN',
    icon: null,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'zh-tw',
    label: '繁體中文',
    value: 'zh-TW',
    icon: null,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'en-uk',
    label: 'English',
    value: 'en-UK',
    icon: null,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'ja-jp',
    label: '日本語',
    value: 'ja-JP',
    icon: null,
    divider: false,
    onClick: (value) => alert(value),
  },
  {
    id: 'ko-kr',
    label: '한국어',
    value: 'ko-KR',
    icon: null,
    divider: false,
    onClick: (value) => alert(value),
  },
];

const DropdownDisplay: React.FC<DropdownDisplayProps> = ({
  disableIconButton,
  dropdownOptions,
  showUserLabel,
  textAlignCenter,
  layout,
  transformOriginHorizontal = 'right',
  transformOriginVertical = 'top',
  anchorOriginHorizontal = 'right',
  anchorOriginVertical = 'bottom',
}) => {
  const content = disableIconButton ? (
    <Box sx={{ width: 60, py: 0.5, cursor: 'pointer' }}>TestMenu</Box>
  ) : (
    <Avatar
      sx={{ width: 40, height: 40, cursor: 'pointer' }}
      src="/images/banner-image.jpeg"
      alt="User Avatar"
    />
  );

  return (
    <Dropdown
      anchorElContent={content}
      disableIconButton={disableIconButton}
      dropdownOptions={dropdownOptions}
      showUserLabel={showUserLabel}
      textAlignCenter={textAlignCenter}
      layout={layout}
      transformOrigin={{ horizontal: transformOriginHorizontal, vertical: transformOriginVertical }}
      anchorOrigin={{ horizontal: anchorOriginHorizontal, vertical: anchorOriginVertical }}
    />
  );
};

const meta: Meta<typeof DropdownDisplay> = {
  title: 'Components/DropdownDisplay',
  component: DropdownDisplay,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dropdownOptions: {
      control: { type: 'radio' },
      options: [userMenuDisplayOptions, languageMenuDisplayOptions],
    },
    disableIconButton: {
      control: 'boolean',
    },
    layout: {
      control: { type: 'radio' },
      options: ['vertical', 'horizontal'],
    },
    showUserLabel: {
      control: 'boolean',
    },
    textAlignCenter: {
      control: 'boolean',
    },
    transformOriginHorizontal: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right'],
      description: 'The horizontal reference point of the menu itself (left/center/right)',
    },
    transformOriginVertical: {
      control: { type: 'radio' },
      options: ['top', 'center', 'bottom'],
      description: 'The vertical reference point of the menu itself (top/center/bottom)',
    },
    anchorOriginHorizontal: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right'],
      description: 'The horizontal alignment point on the anchor element (left/center/right)',
    },
    anchorOriginVertical: {
      control: { type: 'radio' },
      options: ['top', 'center', 'bottom'],
      description: 'The vertical alignment point on the anchor element (top/center/bottom)',
    },
  },
} satisfies Meta<typeof DropdownDisplay>;

export default meta;

export const Primary: StoryObj<typeof DropdownDisplay> = {
  args: {
    dropdownOptions: userMenuDisplayOptions,
    layout: 'vertical',
    showUserLabel: true,
    textAlignCenter: false,
    transformOriginHorizontal: 'right',
    transformOriginVertical: 'top',
    anchorOriginHorizontal: 'right',
    anchorOriginVertical: 'bottom',
  },
};

export const Horizontal: StoryObj<typeof DropdownDisplay> = {
  args: {
    dropdownOptions: languageMenuDisplayOptions,
    layout: 'horizontal',
    showUserLabel: false,
    textAlignCenter: true,
    transformOriginHorizontal: 'right',
    transformOriginVertical: 'top',
    anchorOriginHorizontal: 'right',
    anchorOriginVertical: 'bottom',
  },
};
