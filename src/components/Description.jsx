import React from 'react';
import Point from '@mui/icons-material/Circle';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Description = ({ heading, data = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ my: 2 }}>
      {heading && (
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.4rem', md: '1.8rem' },
            letterSpacing: '-0.02em',
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          {heading}
        </Typography>
      )}

      {data.map((item, idx) =>
        Array.isArray(item) ? (
          <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 1.5, pl: 1 }}>
            {item.map((bullet, bIdx) => (
              <Box key={bIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <Point
                  sx={{
                    fontSize: '0.55rem',
                    color: isDark ? '#38BDF8' : '#0284C7',
                    mt: 0.9,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? '#E2E8F0' : '#334155',
                    fontSize: '0.98rem',
                    lineHeight: 1.65,
                  }}
                >
                  {bullet}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            key={idx}
            variant="body1"
            sx={{
              color: isDark ? '#E2E8F0' : '#334155',
              fontSize: '1rem',
              lineHeight: 1.75,
              mb: 2,
            }}
          >
            {item}
          </Typography>
        )
      )}
    </Box>
  );
};

export default Description;
