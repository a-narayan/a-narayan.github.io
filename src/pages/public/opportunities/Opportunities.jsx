import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../components';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
  DEFAULT_OPPORTUNITIES_CONTENT,
  getOpportunitiesContent,
} from '../../../services/opportunitiesContentService';

const Opportunities = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [content, setContent] = useState(DEFAULT_OPPORTUNITIES_CONTENT);

  useEffect(() => {
    let isMounted = true;
    getOpportunitiesContent().then((res) => {
      if (isMounted && res) {
        setContent(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const { header, financialSupport, openPositions, applicationInstructions } = content;

  const handleEmailApply = () => {
    const email = applicationInstructions.contactEmail || 'apurva.narayan@uwo.ca';
    const subject = encodeURIComponent(
      applicationInstructions.emailSubject || 'IDSL Prospective Student Application - [Your Name]'
    );
    window.open(`mailto:${email}?subject=${subject}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Page Header */}
      <Box
        sx={{
          pt: { xs: 6, md: 8 },
          pb: { xs: 5, md: 6 },
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent 70%), #080B11'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%), #F8FAFC',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <SectionWrapper showBottomLine={false}>
          <Box sx={{ maxWidth: '820px' }}>
            <Typography
              variant="caption"
              sx={{
                display: 'inline-block',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isDark ? '#60A5FA' : '#1D4ED8',
                mb: 1,
              }}
            >
              {header.eyebrow}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              {header.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
              }}
            >
              {header.description}
            </Typography>
          </Box>
        </SectionWrapper>
      </Box>

      <SectionWrapper showBottomLine={false}>
        {/* Financial support banner */}
        <Box
          sx={{
            p: 3,
            mb: 5,
            mt: 4,
            borderRadius: '16px',
            background: isDark
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)'
              : 'linear-gradient(135deg, rgba(29, 78, 216, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.1)',
              color: isDark ? '#60A5FA' : '#1D4ED8',
              flexShrink: 0,
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: '1.6rem' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
              {financialSupport.title}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {financialSupport.description}
            </Typography>
          </Box>
        </Box>

        {/* Open Positions Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {openPositions.title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            {openPositions.subtitle}
          </Typography>

          <Grid container spacing={3}>
            {(openPositions.positions || []).map((pos, idx) => {
              const isOpen = String(pos.tag || 'OPEN').toUpperCase() !== 'CLOSED';
              return (
                <Grid item xs={12} sm={6} key={pos.id || idx}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      height: '100%',
                      backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease',
                      opacity: isOpen ? 1 : isDark ? 0.72 : 0.78,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: isOpen
                          ? isDark
                            ? 'rgba(59, 130, 246, 0.45)'
                            : 'rgba(29, 78, 216, 0.3)'
                          : theme.palette.divider,
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Chip
                          label={isOpen ? 'OPEN' : 'CLOSED'}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            backgroundColor: isOpen
                              ? isDark
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(16, 185, 129, 0.1)'
                              : isDark
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(239, 68, 68, 0.08)',
                            color: isOpen
                              ? isDark
                                ? '#34D399'
                                : '#059669'
                              : isDark
                              ? '#F87171'
                              : '#DC2626',
                            border: '1px solid',
                            borderColor: isOpen
                              ? isDark
                                ? 'rgba(16, 185, 129, 0.4)'
                                : 'rgba(16, 185, 129, 0.3)'
                              : isDark
                              ? 'rgba(239, 68, 68, 0.35)'
                              : 'rgba(239, 68, 68, 0.25)',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {pos.terms}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        {pos.role}
                      </Typography>

                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                        {pos.focus}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* How to Apply / Application Checklist */}
        <Box
          sx={{
            p: { xs: 3.5, md: 5 },
            borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <SchoolIcon sx={{ color: theme.palette.primary.main, fontSize: '1.75rem' }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                color: theme.palette.text.primary,
              }}
            >
              {applicationInstructions.title}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            {applicationInstructions.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
            {(applicationInstructions.checklist || []).map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: isDark ? '#38BDF8' : '#0284C7', fontSize: '1.25rem', mt: 0.25 }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500, lineHeight: 1.6 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            onClick={handleEmailApply}
            sx={{ borderRadius: '9999px', px: 3.5, py: 1.25 }}
          >
            {applicationInstructions.buttonText || 'Submit Application by Email'}
          </Button>
        </Box>
      </SectionWrapper>
    </Box>
  );
};

export default Opportunities;
