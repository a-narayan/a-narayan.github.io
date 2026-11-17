import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../../components';
import InfoBanner from '../../../../components/InfoBanner';
import { useTheme } from '@mui/material/styles';
import { DEFAULT_HOME_CONTENT, getHomeContent } from '../../../../services/homeContentService';

const Welcome = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [aboutData, setAboutData] = useState(DEFAULT_HOME_CONTENT.about);

  useEffect(() => {
    let isMounted = true;
    getHomeContent().then((content) => {
      if (isMounted && content?.about) {
        setAboutData(content.about);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionWrapper>
      {/* Eyebrow and Section Heading */}
      <Box sx={{ mb: 4 }}>
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
          {aboutData.eyebrow || 'Leadership & Vision'}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', md: '2.4rem' },
            fontWeight: 800,
            color: theme.palette.text.primary,
            letterSpacing: '-0.025em',
            mb: 1.5,
          }}
        >
          {aboutData.title || 'About IDSL'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '850px',
            lineHeight: 1.7,
          }}
        >
          {aboutData.description || DEFAULT_HOME_CONTENT.about.description}
        </Typography>
      </Box>

      <Grid container spacing={3.5} alignItems="center">
        <Grid
          item
          xs={12}
          md={3.5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: '180px', sm: '210px' },
              height: { xs: '180px', sm: '210px' },
              borderRadius: '50%',
              p: '5px',
              background: isDark
                ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
                : 'linear-gradient(135deg, #1D4ED8 0%, #0284C7 100%)',
              boxShadow: isDark
                ? '0 0 35px -5px rgba(59, 130, 246, 0.4)'
                : '0 10px 25px -5px rgba(29, 78, 216, 0.25)',
            }}
          >
            <Box
              component="img"
              src={aboutData.directorImage || DEFAULT_HOME_CONTENT.about.directorImage}
              alt={aboutData.directorName || 'Dr. Apurva Narayan'}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                backgroundColor: isDark ? '#0F1523' : '#FFFFFF',
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={8.5}>
          <InfoBanner
            directorName={aboutData.directorName}
            directorTitle={aboutData.directorTitle}
            directorBio={aboutData.directorBio}
            affiliations={aboutData.affiliations}
            email={aboutData.email}
            linkedin={aboutData.linkedin}
            googleScholar={aboutData.googleScholar}
            facultyDirectory={aboutData.facultyDirectory}
          />
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};

export default Welcome;
