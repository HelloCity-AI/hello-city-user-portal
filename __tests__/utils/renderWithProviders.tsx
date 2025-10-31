import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { I18nTestWrapper } from './TestWrapper';

export const renderWithThemeAndI18n = (ui: React.ReactElement<any>) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <I18nTestWrapper>{ui}</I18nTestWrapper>
    </ThemeProvider>,
  );
};
