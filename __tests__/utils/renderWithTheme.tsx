import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render } from '@testing-library/react';

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

export default renderWithTheme;
