import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';

const InfoBanner = ({
  directorName = 'Dr. Apurva Narayan',
  directorTitle = 'Principal Investigator & Lab Director',
  directorBio = 'Dr. Apurva Narayan leads the IDSL research group. He is an Associate Professor in the Department of Computer Science & Electrical and Computer Engineering at Western University, Affiliate Associate Professor in Computer Science and School of Engineering at the University of British Columbia (UBC), and Adjunct Associate Professor in Systems Design Engineering at the University of Waterloo.',
  affiliations = [
    { label: 'Western University', sub: 'CS & ECE' },
    { label: 'University of British Columbia', sub: 'CS & Engineering' },
    { label: 'University of Waterloo', sub: 'Systems Design' },
  ],
  linkedin = 'https://www.linkedin.com/in/apurva-narayan-44308b17/',
  googleScholar = 'https://scholar.google.com/citations?user=e5OCZ1cAAAAJ&hl=en',
  email = 'apurva.narayan@uwo.ca',
  facultyDirectory = 'https://www.csd.uwo.ca/people/faculty/faculty_members/narayan.html',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const cleanedBio = (directorBio || '').replace(/Assis?stant\s+Professor/gi, 'Associate Professor');

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '20px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        boxShadow: isDark
          ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
          : '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.25rem', md: '1.45rem' },
            color: theme.palette.text.primary,
          }}
        >
          {directorName}
        </Typography>
        {directorTitle && (
          <Chip
            label={directorTitle}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
              color: isDark ? '#60A5FA' : '#1D4ED8',
              border: '1px solid',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
            }}
          />
        )}
      </Box>

      {/* Affiliations badges */}
      {Array.isArray(affiliations) && affiliations.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
          {affiliations.map((aff, idx) => (
            <Box
              key={aff.label || idx}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                border: '1px solid',
                borderColor: theme.palette.divider,
                fontSize: '0.78rem',
                color: theme.palette.text.secondary,
              }}
            >
              <strong style={{ color: theme.palette.text.primary }}>{aff.label}</strong> {aff.sub ? `(${aff.sub})` : ''}
            </Box>
          ))}
        </Box>
      )}

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          lineHeight: 1.7,
          fontSize: '0.98rem',
          mb: 3,
        }}
      >
        {cleanedBio}
      </Typography>

      {/* Links and Contact */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {linkedin && (
          <Tooltip title="View LinkedIn Profile">
            <IconButton
              size="small"
              onClick={() => window.open(linkedin, '_blank')}
              sx={{
                p: 1,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                color: '#0A66C2',
                backgroundColor: isDark ? 'rgba(10, 102, 194, 0.1)' : 'rgba(10, 102, 194, 0.06)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(10, 102, 194, 0.2)' : 'rgba(10, 102, 194, 0.12)',
                },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {googleScholar && (
          <Tooltip title="Google Scholar">
            <IconButton
              size="small"
              onClick={() => window.open(googleScholar, '_blank')}
              sx={{
                p: 1,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                color: theme.palette.primary.main,
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(29, 78, 216, 0.06)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.12)',
                },
              }}
            >
              <SchoolOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {email && (
          <Tooltip title="Send Email">
            <IconButton
              size="small"
              onClick={() => window.open(`mailto:${email}`)}
              sx={{
                p: 1,
                borderRadius: '10px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                color: isDark ? '#22D3EE' : '#0284C7',
                backgroundColor: isDark ? 'rgba(6, 182, 212, 0.1)' : 'rgba(2, 132, 199, 0.06)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(2, 132, 199, 0.12)',
                },
              }}
            >
              <EmailOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {facultyDirectory && (
          <Box
            component="a"
            href={facultyDirectory}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              ml: { xs: 0, sm: 'auto' },
              fontSize: '0.84rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <span>Faculty Directory</span>
            <LaunchIcon sx={{ fontSize: '0.9rem' }} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InfoBanner;
