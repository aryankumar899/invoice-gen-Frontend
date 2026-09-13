import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ec4899', // Pink 500
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f4f6f8',
            paper: '#ffffff',
          },
          text: {
            primary: '#111827',
            secondary: '#374151',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff',
          },
          background: {
            default: '#0b0f19',
            paper: '#111827',
          },
          text: {
            primary: '#f9fafb',
            secondary: '#d1d5db',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: '"Manrope", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: 0 },
    h2: { fontWeight: 700, letterSpacing: 0 },
    h3: { fontWeight: 700, letterSpacing: 0 },
    h4: { fontWeight: 700, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    subtitle1: { fontFamily: '"Manrope", sans-serif' },
    body1: { fontFamily: '"Manrope", sans-serif', lineHeight: 1.6 },
    body2: { fontFamily: '"Manrope", sans-serif' },
    button: { fontFamily: '"Manrope", sans-serif', fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
          },
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: mode === 'dark' ? 'blur(16px)' : 'none',
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: mode === 'dark' ? '0 4px 30px rgba(0, 0, 0, 0.1)' : '0 4px 15px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
        h1: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
        h2: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
        h3: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
        h4: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
        h5: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
        h6: { color: mode === 'dark' ? '#f9fafb' : '#111827' },
      },
    },
  },
});
