import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d8bff',
    },
    background: {
      default: '#f5f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
});

export default lightTheme;
