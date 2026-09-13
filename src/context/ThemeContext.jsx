import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../theme';

export const ThemeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

export function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  useEffect(() => {
    document.body.classList.toggle('dark', mode === 'dark');
    document.body.classList.toggle('light', mode === 'light');
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
