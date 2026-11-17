import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DCard = ({
  imageUrl,
  title,
  text,
  description,
  category = 'RESEARCH AREA',
  onClick,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const displayTitle = title || text;

  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.8)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
          boxShadow: isDark
            ? '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 20px -2px rgba(59, 130, 246, 0.2)'
            : '0 12px 30px -8px rgba(0, 0, 0, 0.1), 0 0 15px -2px rgba(29, 78, 216, 0.12)',
          '& .card-image': {
            transform: 'scale(1.05)',
          },
          ...(onClick
            ? {
                '& .card-arrow': {
                  transform: 'translateX(4px)',
                  color: theme.palette.primary.main,
                },
              }
            : {}),
        },
      }}
    >
      {/* Image container */}
      <Box
        sx={{
          width: '100%',
          height: '210px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: isDark ? '#0A0D14' : '#F1F5F9',
        }}
      >
        <Box
          component="img"
          className="card-image"
          src={imageUrl}
          alt={displayTitle || 'Research domain'}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* Subtle gradient overlay (dark mode only) */}
        {isDark && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 21, 35, 0.9) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              color: isDark ? '#60A5FA' : '#1D4ED8',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            {category}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.4,
              color: theme.palette.text.primary,
              mb: description ? 1.25 : 0,
            }}
          >
            {displayTitle}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#CBD5E1' : '#475569',
                fontSize: '0.88rem',
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {onClick && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              pt: 1.5,
              borderTop: '1px solid',
              borderColor: theme.palette.divider,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: theme.palette.text.secondary,
              }}
            >
              Explore Area
            </Typography>
            <ArrowForwardIcon
              className="card-arrow"
              sx={{
                fontSize: '1rem',
                ml: 1,
                color: theme.palette.text.secondary,
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DCard;
