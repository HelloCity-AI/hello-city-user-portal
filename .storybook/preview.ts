import type { Preview } from '@storybook/nextjs-vite';
import { ThemeProvider, CssBaseline } from '@mui/material';
import websiteTheme from '../src/theme/theme';

import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import './storybook-fonts.css';
import '../src/app/globals.css';

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: websiteTheme,
    },
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
];

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      disable: false,
    },
  },
};

export default preview;
