import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../components';
import { useTheme } from '@mui/material/styles';
import CollaboratorCarousel from '../../../components/CollaboratorCarousel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import {
  DEFAULT_RESEARCH_CONTENT,
  getResearchContent,
} from '../../../services/researchContentService';

const renderTopicIcon = (iconType) => {
  switch (iconType) {
    case 'verified':
      return <VerifiedUserOutlinedIcon sx={{ fontSize: '1.75rem', color: '#3B82F6' }} />;
    case 'memory':
      return <MemoryOutlinedIcon sx={{ fontSize: '1.75rem', color: '#06B6D4' }} />;
    case 'manufacturing':
      return <PrecisionManufacturingOutlinedIcon sx={{ fontSize: '1.75rem', color: '#8B5CF6' }} />;
    case 'insights':
      return <InsightsOutlinedIcon sx={{ fontSize: '1.75rem', color: '#10B981' }} />;
    case 'security':
      return <SecurityOutlinedIcon sx={{ fontSize: '1.75rem', color: '#EF4444' }} />;
    case 'code':
      return <CodeOutlinedIcon sx={{ fontSize: '1.75rem', color: '#F59E0B' }} />;
    default:
      return <HubOutlinedIcon sx={{ fontSize: '1.75rem', color: '#3B82F6' }} />;
  }
};

const Research = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [content, setContent] = useState(DEFAULT_RESEARCH_CONTENT);

  useEffect(() => {
    let isMounted = true;
    getResearchContent().then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const header = content.header || DEFAULT_RESEARCH_CONTENT.header;
  const focusAreas = content.focusAreas || DEFAULT_RESEARCH_CONTENT.focusAreas;
  const applicationDomains = content.applicationDomains || DEFAULT_RESEARCH_CONTENT.applicationDomains;
  const topics = focusAreas.topics && focusAreas.topics.length > 0 ? focusAreas.topics : DEFAULT_RESEARCH_CONTENT.focusAreas.topics;
  const domains = applicationDomains.domains && applicationDomains.domains.length > 0 ? applicationDomains.domains : DEFAULT_RESEARCH_CONTENT.applicationDomains.domains;

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
              {header.eyebrow || 'Research & Innovation'}
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
              {header.title || 'Autonomous, Safe, and Resilient Systems'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
              }}
            >
              {header.description || DEFAULT_RESEARCH_CONTENT.header.description}
            </Typography>
          </Box>
        </SectionWrapper>
      </Box>

      <SectionWrapper showBottomLine={false}>
        {/* Research Themes & Topics */}
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
            {focusAreas.title || 'Key Research Focus Areas'}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 4, maxWidth: '700px' }}>
            {focusAreas.subtitle || DEFAULT_RESEARCH_CONTENT.focusAreas.subtitle}
          </Typography>

          <Grid container spacing={3}>
            {topics.map((t, index) => (
              <Grid item xs={12} sm={6} key={t.id || t.title || index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    height: '100%',
                    backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(29, 78, 216, 0.3)',
                      boxShadow: isDark
                        ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{renderTopicIcon(t.iconType)}</Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    {t.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    {t.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Application Domains */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.5)' : 'rgba(241, 245, 249, 0.6)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            mb: 6,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: '1.35rem',
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {applicationDomains.title || 'Application Domains'}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            {applicationDomains.subtitle || DEFAULT_RESEARCH_CONTENT.applicationDomains.subtitle}
          </Typography>

          <Grid container spacing={2}>
            {domains.map((domain, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: '1.15rem', color: isDark ? '#38BDF8' : '#0284C7' }} />
                  <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                    {domain}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Industry Partners */}
        <Box sx={{ mt: 4 }}>
          <CollaboratorCarousel />
        </Box>
      </SectionWrapper>
    </Box>
  );
};

export default Research;
