import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CyberHeroCanvas from '../../../../components/CyberHeroCanvas';

const TopHeading = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const stats = [
    { value: '100+', label: 'Publications & Articles' },
    { value: '3', label: 'Top Universities (Western • UBC • Waterloo)' },
    { value: '6+', label: 'Industry & Gov. Collaborators' },
    { value: '100%', label: 'Safety & Trustworthy Focus' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 11 },
        background: isDark
          ? 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(59, 130, 246, 0.22), transparent 70%), #080B11'
          : 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(37, 99, 235, 0.1), transparent 70%), #F8FAFC',
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
      }}
    >
      {/* Interactive Cyber-Physical & Neural Canvas */}
      <CyberHeroCanvas />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: '960px', mx: 'auto', textAlign: 'center' }}>
          
          {/* Eyebrow Pill Tag */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.25,
              px: 2,
              py: 0.75,
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(29, 78, 216, 0.08)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
              backdropFilter: 'blur(10px)',
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#06B6D4',
                boxShadow: '0 0 10px #06B6D4',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.4, transform: 'scale(0.85)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: isDark ? '#93C5FD' : '#1D4ED8',
              }}
            >
              Intelligent Data Science Lab · Western • UBC • Waterloo
            </Typography>
          </Box>

          {/* Main Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.2rem' },
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              mb: 3,
              color: theme.palette.text.primary,
            }}
          >
            Empowering the Next Generation of{' '}
            <Box
              component="span"
              sx={{
                background: isDark
                  ? 'linear-gradient(135deg, #60A5FA 0%, #38BDF8 50%, #A78BFA 100%)'
                  : 'linear-gradient(135deg, #1D4ED8 0%, #0284C7 50%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cyber-Physical Systems
            </Box>{' '}
            through Data & AI
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              lineHeight: 1.65,
              color: theme.palette.text.secondary,
              maxWidth: '820px',
              mx: 'auto',
              mb: 4.5,
              fontWeight: 400,
            }}
          >
            We bridge intelligent machine learning, specification mining, automated reasoning, and decision-making under uncertainty to build robust, resilient, and safe artificial intelligence for mission-critical software.
          </Typography>

          {/* Call-to-action buttons */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mb: 8,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/research')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 3.5,
                py: 1.25,
                fontSize: '1rem',
                borderRadius: '9999px',
              }}
            >
              Explore Our Research
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/publications')}
              startIcon={<MenuBookOutlinedIcon />}
              sx={{
                px: 3,
                py: 1.25,
                fontSize: '1rem',
                borderRadius: '9999px',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(29, 78, 216, 0.06)',
                },
              }}
            >
              Publications
            </Button>

            <Button
              variant="text"
              size="large"
              onClick={() => navigate('/opportunities')}
              sx={{
                px: 2.5,
                py: 1.25,
                fontSize: '1rem',
                borderRadius: '9999px',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Join the Lab →
            </Button>
          </Box>

          {/* Metrics / Key Stats Strip */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(15, 21, 35, 0.65)' : '#FFFFFF',
              backdropFilter: 'blur(16px)',
              border: '1px solid',
              borderColor: theme.palette.divider,
              boxShadow: isDark
                ? '0 10px 30px -10px rgba(0, 0, 0, 0.6)'
                : '0 10px 30px -10px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {stats.map((stat, idx) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      borderRight: {
                        xs: idx % 2 === 0 ? '1px solid' : 'none',
                        md: idx !== 3 ? '1px solid' : 'none',
                      },
                      borderColor: theme.palette.divider,
                      pr: { xs: 1, md: 2 },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: '1.75rem', md: '2.2rem' },
                        background: isDark
                          ? 'linear-gradient(135deg, #FFFFFF 40%, #60A5FA 100%)'
                          : 'linear-gradient(135deg, #0F172A 40%, #1D4ED8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.82rem',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default TopHeading;
