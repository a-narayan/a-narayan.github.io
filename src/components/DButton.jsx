import { Button } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const DButton = ({
  children,
  onClick,
  variant = 'contained',
  isLoading = false,
  fullWidth = false,
  fontSize = '0.925rem',
  padding = '8px 22px',
  backgroundColor,
  color,
  sx = {},
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const defaultBg = variant === 'contained'
    ? (backgroundColor || theme.palette.primary.main)
    : 'transparent';

  const defaultColor = color || (variant === 'contained' ? '#FFFFFF' : theme.palette.primary.main);

  return (
    <Button
      variant={variant}
      disableElevation
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={isLoading}
      sx={{
        p: padding,
        textTransform: 'none',
        fontSize: fontSize,
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: defaultBg,
        color: defaultColor,
        border: variant === 'outlined' ? `1px solid ${theme.palette.primary.main}` : 'none',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          backgroundColor: variant === 'contained'
            ? theme.palette.primary.dark
            : (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(29, 78, 216, 0.08)'),
          transform: 'translateY(-1px)',
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default DButton;
