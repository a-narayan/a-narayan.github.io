import { Box, Chip, Typography, Button, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';

const PublicationBanner = ({
  index,
  publicationType = 'Paper',
  title,
  authors = '',
  booktitle,
  ppText,
  year,
  topic,
  scholarUrl,
  pdfUrl,
  doi,
  bibtex,
  links = {},
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [copied, setCopied] = useState(false);

  // Fallback to direct Google Scholar search query to prevent 404 broken citation views
  const effectiveScholarUrl =
    scholarUrl && !scholarUrl.includes('view_op=view_citation')
      ? scholarUrl
      : `https://scholar.google.com/scholar?q=${encodeURIComponent(title || '')}`;

  const handleCopyBibTeX = () => {
    const bibString =
      bibtex ||
      `@article{narayan${year || ''},
  title={${title}},
  author={${authors}},
  journal={${booktitle || ''}},
  year={${year || ''}}
}`;
    navigator.clipboard.writeText(bibString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        mb: 2.5,
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          borderColor: isDark ? 'rgba(59, 130, 246, 0.45)' : 'rgba(29, 78, 216, 0.3)',
          transform: 'translateY(-2px)',
          boxShadow: isDark
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px -3px rgba(59, 130, 246, 0.15)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          {index !== undefined && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Space Grotesk', monospace",
                fontWeight: 700,
                fontSize: '0.8rem',
                color: theme.palette.text.secondary,
              }}
            >
              #{index}
            </Typography>
          )}

          <Chip
            label={publicationType || 'Paper'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
              color: isDark ? '#60A5FA' : '#1D4ED8',
              border: '1px solid',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
            }}
          />

          {year && (
            <Chip
              label={year}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.72rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                color: theme.palette.text.primary,
              }}
            />
          )}

          {topic && (
            <Chip
              label={topic}
              size="small"
              sx={{
                fontSize: '0.72rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(2, 132, 199, 0.08)',
                color: isDark ? '#22D3EE' : '#0284C7',
                border: '1px solid',
                borderColor: isDark ? 'rgba(6, 182, 212, 0.25)' : 'rgba(2, 132, 199, 0.2)',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Paper Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.05rem', md: '1.2rem' },
          lineHeight: 1.35,
          color: theme.palette.text.primary,
          mb: 1.25,
        }}
      >
        {title}
      </Typography>

      {/* Authors list */}
      {authors && (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.94rem',
            lineHeight: 1.55,
            mb: 1,
          }}
        >
          {authors}
        </Typography>
      )}

      {/* Venue / Journal / Booktitle */}
      {booktitle && (
        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            color: isDark ? '#93C5FD' : '#2563EB',
            fontSize: '0.9rem',
            mb: 2,
          }}
        >
          {booktitle} {ppText ? `(${ppText})` : ''}
        </Typography>
      )}

      {/* Action Buttons: Scholar, PDF, DOI, BibTeX */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          pt: 1.5,
          borderTop: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<SchoolIcon sx={{ fontSize: '1rem' }} />}
          onClick={() => window.open(effectiveScholarUrl, '_blank')}
          sx={{
            borderRadius: '9999px',
            fontSize: '0.78rem',
            py: '3px',
            px: '12px',
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        >
          Google Scholar
        </Button>

        {pdfUrl && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<DescriptionOutlinedIcon sx={{ fontSize: '1rem' }} />}
            onClick={() => window.open(pdfUrl, '_blank')}
            sx={{
              borderRadius: '9999px',
              fontSize: '0.78rem',
              py: '3px',
              px: '12px',
              borderColor: theme.palette.divider,
              color: isDark ? '#34D399' : '#059669',
              '&:hover': {
                borderColor: isDark ? '#34D399' : '#059669',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
              },
            }}
          >
            PDF / Paper
          </Button>
        )}

        {doi && (
          <Button
            size="small"
            variant="outlined"
            endIcon={<LaunchIcon sx={{ fontSize: '0.85rem' }} />}
            onClick={() => window.open(doi.startsWith('http') ? doi : `https://doi.org/${doi}`, '_blank')}
            sx={{
              borderRadius: '9999px',
              fontSize: '0.78rem',
              py: '3px',
              px: '12px',
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
            }}
          >
            DOI / Publisher
          </Button>
        )}

        {links &&
          Object.entries(links).map(([type, url]) => (
            <Button
              key={type}
              size="small"
              variant="outlined"
              onClick={() => window.open(url, '_blank')}
              sx={{
                borderRadius: '9999px',
                fontSize: '0.78rem',
                py: '3px',
                px: '12px',
                borderColor: theme.palette.divider,
                color: theme.palette.text.secondary,
              }}
            >
              {type}
            </Button>
          ))}

        <Tooltip title={copied ? 'BibTeX Copied!' : 'Copy BibTeX to clipboard'}>
          <Button
            size="small"
            variant="outlined"
            startIcon={copied ? <CheckIcon sx={{ fontSize: '1rem', color: '#10B981' }} /> : <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={handleCopyBibTeX}
            sx={{
              borderRadius: '9999px',
              fontSize: '0.78rem',
              py: '3px',
              px: '12px',
              borderColor: copied ? '#10B981' : theme.palette.divider,
              color: copied ? '#10B981' : theme.palette.text.secondary,
              ml: { xs: 0, sm: 'auto' },
            }}
          >
            {copied ? 'Copied BibTeX' : 'Cite (BibTeX)'}
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PublicationBanner;
