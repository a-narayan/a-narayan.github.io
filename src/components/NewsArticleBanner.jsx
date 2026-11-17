import { Box, Typography } from '@mui/material';
import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const NewsArticleBanner = ({ id, index, title, subtitle, date, content }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      onClick={() => {
        navigate(`/news/${id}`, {
          state: {
            id,
            index,
            title,
            subtitle,
            date,
            content,
          },
        });
      }}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        mb: 2.5,
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
          boxShadow: isDark
            ? '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 15px -2px rgba(59, 130, 246, 0.2)'
            : '0 12px 30px -8px rgba(0, 0, 0, 0.08), 0 0 12px -2px rgba(29, 78, 216, 0.1)',
          '& .news-title': {
            color: theme.palette.primary.main,
          },
          '& .news-arrow': {
            transform: 'translateX(4px)',
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.3,
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
            color: theme.palette.text.secondary,
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: '0.85rem' }} />
          <span>{date || 'Recent'}</span>
        </Box>
        <Box
          sx={{
            px: 1.25,
            py: 0.3,
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
            color: isDark ? '#60A5FA' : '#1D4ED8',
            textTransform: 'uppercase',
          }}
        >
          Article #{index}
        </Box>
      </Box>

      <Typography
        variant="h5"
        className="news-title"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.2rem', md: '1.35rem' },
          lineHeight: 1.3,
          color: theme.palette.text.primary,
          mb: 1,
          transition: 'color 0.2s ease',
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {subtitle}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: theme.palette.text.secondary,
          fontSize: '0.88rem',
          fontWeight: 600,
          pt: 1,
          borderTop: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <span>Read full article</span>
        <ArrowForwardIcon className="news-arrow" sx={{ fontSize: '1rem', transition: 'all 0.2s ease' }} />
      </Box>
    </Box>
  );
};

export default NewsArticleBanner;
