import React from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../../components';
import { useTheme } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SendIcon from '@mui/icons-material/Send';
import MemoryIcon from '@mui/icons-material/Memory';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useNavigate } from 'react-router-dom';

const recruitmentTracks = [
  {
    role: 'PhD Researchers',
    type: '4 Years',
    icon: <SchoolIcon sx={{ fontSize: '1.6rem', color: '#3B82F6' }} />,
    status: 'ACTIVE RECRUITING',
  },
  {
    role: 'Postdoctoral Scholars',
    type: '1-2 Years · Research Fellowship',
    icon: <WorkspacePremiumIcon sx={{ fontSize: '1.6rem', color: '#06B6D4' }} />,
    status: 'ACTIVE RECRUITING',
  },
  {
    role: "Master's (MASc / MSc)",
    type: '2 Years · Thesis Stream',
    icon: <MemoryIcon sx={{ fontSize: '1.6rem', color: '#8B5CF6' }} />,
    status: 'ACTIVE RECRUITING',
  },
  {
    role: 'Undergraduate Researchers',
    type: 'USRA / Summer Fellowships',
    icon: <BusinessCenterIcon sx={{ fontSize: '1.6rem', color: '#10B981' }} />,
    status: 'ACTIVE RECRUITING',
  },
];

const checklistItems = [
  { title: 'Curriculum Vitae (CV)', desc: 'Highlighting relevant software, AI, or math coursework & projects' },
  { title: 'Research Statement', desc: '1 page outlining your research interests and why IDSL is the right fit' },
  { title: 'Sample Work / GitHub', desc: 'Links to open-source code, thesis, or technical publications if applicable' },
];

const Recruitment = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const handleEmailApply = () => {
    const subject = encodeURIComponent('IDSL Prospective Student Application - [Your Name]');
    const body = encodeURIComponent(
      'Dear Dr. Apurva Narayan,\n\nI am writing to express my strong interest in joining the Intelligent Data Science Lab (IDSL). Please find attached my CV, research statement, and samples of my work.\n\nBest regards,\n[Your Name]'
    );
    window.open(`mailto:apurva.narayan@uwo.ca?subject=${subject}&body=${body}`);
  };

  return (
    <SectionWrapper showBottomLine={false}>
      {/* Section Header */}
      <Box sx={{ mb: 4.5 }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? '#34D399' : '#059669',
            }}
          >
            Year-Round Admissions & Opportunities
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: theme.palette.text.primary,
            mb: 1.5,
          }}
        >
          Join Our Research Group
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: isDark ? '#E2E8F0' : '#475569',
            fontSize: { xs: '1rem', md: '1.1rem' },
            maxWidth: '850px',
            lineHeight: 1.7,
          }}
        >
          We are seeking motivated undergraduate and graduate researchers passionate about building robust, certified, and mathematically sound AI systems for mission-critical infrastructure.
        </Typography>
      </Box>

      {/* Recruitment Tracks Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {recruitmentTracks.map((track) => (
          <Grid item xs={12} sm={6} md={3} key={track.role}>
            <Box
              sx={{
                p: 3,
                borderRadius: '18px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.8)' : '#FFFFFF',
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: theme.palette.divider,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
                  boxShadow: isDark
                    ? '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 15px -2px rgba(59, 130, 246, 0.15)'
                    : '0 12px 30px -8px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {track.icon}
                  </Box>
                  <Chip
                    label="OPEN"
                    size="small"
                    sx={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '9999px',
                      height: '20px',
                      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                      color: isDark ? '#34D399' : '#059669',
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {track.role}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: isDark ? '#93C5FD' : '#2563EB',
                    fontWeight: 600,
                  }}
                >
                  {track.type}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* How to Apply Interactive Roadmap Card */}
      <Box
        sx={{
          p: { xs: 3.5, md: 4.5 },
          borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          How to Apply to IDSL
        </Typography>

        <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#475569', mb: 3 }}>
          Interested candidates should email <strong>Dr. Apurva Narayan</strong> directly. Please assemble the following items:
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {checklistItems.map((item, index) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(29, 78, 216, 0.12)',
                      color: isDark ? '#60A5FA' : '#1D4ED8',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#CBD5E1' : '#64748B', fontSize: '0.86rem', lineHeight: 1.5 }}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={handleEmailApply}
            sx={{
              borderRadius: '9999px',
              px: 3.5,
              py: 1.2,
              fontWeight: 700,
            }}
          >
            Email Dr. Apurva Narayan
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/opportunities')}
            sx={{
              borderRadius: '9999px',
              px: 3,
              py: 1.2,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            Full Opportunities Guide
          </Button>
        </Box>
      </Box>
    </SectionWrapper>
  );
};

export default Recruitment;
