import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../theme/ThemeContext';
import { useTheme } from '@mui/material/styles';

const ThemeToggle = ({ size = 'medium' }) => {
  const { mode, toggleTheme } = useColorMode();
  const theme = useTheme();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <Box
        onClick={toggleTheme}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          p: '4px',
          borderRadius: '9999px',
          border: '1px solid',
          borderColor: theme.palette.divider,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
            transform: 'scale(1.05)',
          },
        }}
      >
        <IconButton
          size={size}
          color="inherit"
          disableRipple
          sx={{
            p: '4px',
            color: isDark ? '#F59E0B' : '#6366F1',
            transition: 'transform 0.4s ease, color 0.2s ease',
            transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        >
          {isDark ? (
            <Brightness7Icon sx={{ fontSize: '1.25rem' }} />
          ) : (
            <Brightness4Icon sx={{ fontSize: '1.25rem' }} />
          )}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle;

