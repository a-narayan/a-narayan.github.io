import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const AdminDashboardButton = ({ children, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 3.5,
        borderRadius: '18px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '140px',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
          boxShadow: isDark
            ? '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 15px -2px rgba(59, 130, 246, 0.2)'
            : '0 12px 30px -8px rgba(0, 0, 0, 0.08)',
          '& .dash-arrow': {
            transform: 'translateX(4px)',
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: '1.2rem',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
          Manage section
        </Typography>
        <ArrowForwardIcon className="dash-arrow" sx={{ fontSize: '1.1rem', color: theme.palette.text.secondary, transition: 'all 0.2s ease' }} />
      </Box>
    </Box>
  );
};

export default AdminDashboardButton;
