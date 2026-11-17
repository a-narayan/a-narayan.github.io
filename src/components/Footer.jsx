import React from 'react';
import { Box, Button, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import logo from '../assets/images/favicon.ico';

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Research Themes', path: '/research' },
    { label: 'Publications', path: '/publications' },
    { label: 'Team & Alumni', path: '/team' },
    { label: 'News & Updates', path: '/news' },
    { label: 'Opportunities', path: '/opportunities' },
    { label: 'Resources & Benchmarks', path: '/resources' },
    { label: 'Lab Portal / Login', path: '/login' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? '#05070B' : '#F1F5F9',
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
        pt: { xs: 6, md: 8 },
        pb: 4,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          
          {/* Col 1: Brand & Mission */}
          <Grid item xs={12} md={4.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
                  mr: 1.5,
                }}
              >
                <img src={logo} alt="IDSL Logo" style={{ width: '22px', height: '22px' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  color: theme.palette.text.primary,
                }}
              >
                IDSL
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Intelligent Data Science Lab
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.7,
                mb: 3,
                maxWidth: '420px',
              }}
            >
              Conducting cutting-edge research in Cyber-Physical Systems, Data Analytics, and Safe Machine Learning across Western University, the University of British Columbia, and the University of Waterloo.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Western University', 'UBC', 'Univ. of Waterloo'].map((uni) => (
                <Box
                  key={uni}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {uni}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Col 2: Navigation Links */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              Navigation
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="text"
                  onClick={() => navigate(link.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 0,
                    py: 0.25,
                    color: theme.palette.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: theme.palette.primary.main,
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Col 3: Contact Information */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              Contact & Location
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              Dr. Apurva Narayan
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 2 }}>
              Lead Investigator · Associate Professor
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                <PlaceOutlinedIcon sx={{ fontSize: '1.2rem', color: theme.palette.primary.main, mt: 0.25 }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                  MC - 368, 1151 Richmond St<br />
                  London, ON N6A 3K7, Canada
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <PhoneOutlinedIcon sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  +1 250.807.8272
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <EmailOutlinedIcon sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }} />
                <Typography
                  component="a"
                  href="mailto:apurva.narayan@uwo.ca"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  apurva.narayan@uwo.ca
                </Typography>
              </Box>
            </Box>
          </Grid>

        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            © {new Date().getFullYear()} Intelligent Data Science Lab (IDSL). All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: { xs: 'none', md: 'block' } }}>
              Safety · Security · Resiliency in AI
            </Typography>
            <Tooltip title="Scroll to top">
              <IconButton
                size="small"
                onClick={scrollToTop}
                sx={{
                  p: 0.75,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#FFFFFF',
                  },
                }}
              >
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
