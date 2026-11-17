import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';

const ThemeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
  setMode: () => {},
});

export const useColorMode = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    try {
      const savedMode = localStorage.getItem('idsl_theme_mode');
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }
      // Default to dark mode for Google DeepMind-inspired aesthetic
      return 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('idsl_theme_mode', next);
      } catch (e) {
        // ignore localstorage errors
      }
      return next;
    });
  };

  const setMode = (newMode) => {
    if (newMode === 'dark' || newMode === 'light') {
      setModeState(newMode);
      try {
        localStorage.setItem('idsl_theme_mode', newMode);
      } catch (e) {}
    }
  };

  useEffect(() => {
    // Set data-theme attribute on body/html for external css styling
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
      isDark: mode === 'dark',
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

