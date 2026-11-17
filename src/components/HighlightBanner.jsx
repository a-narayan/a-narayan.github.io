import { Box, Typography } from '@mui/material';
import React from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '@mui/material/styles';

const HighlightBanner = ({ date, text, link }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleOpenLink = () => {
    if (!link) return;
    try {
      const win = window.open(link, '_blank');
      if (win) win.focus();
    } catch (err) {
      console.log('Could not open the link');
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 2,
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.7)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(2, 132, 199, 0.2)',
        boxShadow: isDark
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(6, 182, 212, 0.15)'
          : '0 4px 15px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: isDark ? '#06B6D4' : '#0284C7',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(2, 132, 199, 0.1)',
            color: isDark ? '#22D3EE' : '#0284C7',
            flexShrink: 0,
          }}
        >
          <CampaignIcon sx={{ fontSize: '1.4rem' }} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(29, 78, 216, 0.08)',
                color: isDark ? '#60A5FA' : '#1D4ED8',
                textTransform: 'uppercase',
              }}
            >
              Highlight
            </Box>
            {date && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  fontSize: '0.82rem',
                }}
              >
                {date}
              </Typography>
            )}
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 500,
              fontSize: '0.96rem',
              lineHeight: 1.5,
            }}
          >
            {text}
          </Typography>
        </Box>
      </Box>

      {link && (
        <Box
          onClick={handleOpenLink}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 0.75,
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            color: isDark ? '#F8FAFC' : '#0F172A',
            border: '1px solid',
            borderColor: theme.palette.divider,
            flexShrink: 0,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(2, 132, 199, 0.1)',
              borderColor: isDark ? '#06B6D4' : '#0284C7',
              color: isDark ? '#22D3EE' : '#0284C7',
            },
          }}
        >
          <span>Learn more</span>
          <OpenInNewIcon sx={{ fontSize: '0.95rem' }} />
        </Box>
      )}
    </Box>
  );
};

export default HighlightBanner;
