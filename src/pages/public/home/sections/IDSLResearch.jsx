import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../../components';
import DCard from '../../../../components/DCard';
import { useTheme } from '@mui/material/styles';
import CollaboratorCarousel from '../../../../components/CollaboratorCarousel';
import { DEFAULT_HOME_CONTENT, getHomeContent } from '../../../../services/homeContentService';

const IDSLResearch = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [researchData, setResearchData] = useState(DEFAULT_HOME_CONTENT.research);

  useEffect(() => {
    let isMounted = true;
    getHomeContent().then((content) => {
      if (isMounted && content?.research) {
        setResearchData(content.research);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const areas =
    Array.isArray(researchData.areas) && researchData.areas.length > 0
      ? researchData.areas
      : DEFAULT_HOME_CONTENT.research.areas;

  return (
    <SectionWrapper>
      {/* 1. Section Header */}
      <Box sx={{ mb: 4.5 }}>
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
          {researchData.eyebrow || 'Research Focus'}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontWeight: 800,
            color: theme.palette.text.primary,
            letterSpacing: '-0.025em',
            mb: 1.5,
          }}
        >
          {researchData.title || 'IDSL Research'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#E2E8F0' : '#475569',
            fontSize: { xs: '1rem', md: '1.08rem' },
            maxWidth: '820px',
            lineHeight: 1.65,
          }}
        >
          {researchData.description || DEFAULT_HOME_CONTENT.research.description}
        </Typography>
      </Box>

      {/* 2. Research Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {areas.map((area, idx) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={area.id || idx}>
            <DCard
              imageUrl={area.imageUrl}
              category={area.tag}
              title={area.title}
              description={area.description}
            />
          </Grid>
        ))}
      </Grid>

      {/* 3. Partners & Collaborators Moving Carousel */}
      <CollaboratorCarousel />
    </SectionWrapper>
  );
};

export default IDSLResearch;
