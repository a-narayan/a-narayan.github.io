import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SectionWrapper } from '../../../components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { formatTimestamp } from '../../../utils/dateUtils';
import { useTheme } from '@mui/material/styles';

// Helper to strip hardcoded white backgrounds and conflicting inline colors from rich text HTML
const cleanHtmlContent = (html) => {
  if (!html) return '';
  return html
    .replace(/background-color\s*:\s*[^;"]+;?/gi, '')
    .replace(/background\s*:\s*(#[0-9a-fA-F]+|rgb\([^)]+\)|rgba\([^)]+\)|white|#fff)[^;"]*;?/gi, '')
    .replace(/color\s*:\s*(rgb\(0,\s*0,\s*0\)|#000000|#000|black);?/gi, '')
    .replace(/color\s*:\s*(rgb\(255,\s*255,\s*255\)|#ffffff|#fff|white);?/gi, '');
};

const NewsDetails = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, 'news', params.id));
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setDate(formatTimestamp(data.date) || '');
        setContent(data.content || '');
      }
    } catch (err) {
      console.error('Error fetching news details:', err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!location.state || Object.keys(location.state).length === 0) {
      fetchNews();
    } else {
      setTitle(location.state.title || '');
      setSubtitle(location.state.subtitle || '');
      setDate(location.state.date || '');
      setContent(location.state.content || '');
      setLoading(false);
    }
  }, [location.state, fetchNews]);

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <SectionWrapper showBottomLine={false}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/news')}
          sx={{
            mb: 4,
            borderRadius: '9999px',
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Back to News Feed
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Box
            sx={{
              maxWidth: '850px',
              mx: 'auto',
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: theme.palette.divider,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label="Announcement"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  borderRadius: '9999px',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                  color: isDark ? '#60A5FA' : '#1D4ED8',
                }}
              />
              {date && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: theme.palette.text.secondary }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                    {date}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                lineHeight: 1.25,
                color: theme.palette.text.primary,
                letterSpacing: '-0.025em',
                mb: 2,
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 400,
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  lineHeight: 1.6,
                  mb: 4,
                  pb: 3,
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                {subtitle}
              </Typography>
            )}

            {content && (
              <Box
                className="dynamic-html-content"
                sx={{
                  color: isDark ? '#E2E8F0' : '#1E293B',
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                  '& *': {
                    backgroundColor: 'transparent !important',
                  },
                  '& p': {
                    mb: 2,
                    backgroundColor: 'transparent !important',
                    color: isDark ? '#E2E8F0 !important' : '#1E293B',
                  },
                  '& span': {
                    backgroundColor: 'transparent !important',
                    color: isDark ? '#E2E8F0 !important' : 'inherit',
                  },
                  '& div': {
                    backgroundColor: 'transparent !important',
                    color: isDark ? '#E2E8F0 !important' : 'inherit',
                  },
                  '& strong, & b': {
                    color: isDark ? '#FFFFFF !important' : '#0F172A !important',
                    backgroundColor: 'transparent !important',
                    fontWeight: 700,
                  },
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: isDark ? '#FFFFFF !important' : '#0F172A !important',
                    backgroundColor: 'transparent !important',
                    fontWeight: 800,
                    mt: 3,
                    mb: 1.5,
                  },
                  '& a': {
                    color: isDark ? '#60A5FA !important' : `${theme.palette.primary.main} !important`,
                    textDecoration: 'none',
                    backgroundColor: 'transparent !important',
                    '&:hover': { textDecoration: 'underline' },
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2,
                  },
                  '& li': {
                    mb: 0.75,
                    backgroundColor: 'transparent !important',
                    color: isDark ? '#E2E8F0 !important' : 'inherit',
                  },
                  '& pre, & code': {
                    fontFamily: 'monospace',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08) !important' : 'rgba(0, 0, 0, 0.05) !important',
                    borderRadius: '6px',
                    px: 0.75,
                    py: 0.25,
                    color: isDark ? '#93C5FD !important' : '#1D4ED8 !important',
                  },
                  '& img': {
                    maxWidth: '100%',
                    borderRadius: '12px',
                    my: 2.5,
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: theme.palette.primary.main,
                    pl: 2.5,
                    py: 1,
                    my: 2.5,
                    fontStyle: 'italic',
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08) !important' : 'rgba(29, 78, 216, 0.04) !important',
                    borderRadius: '0 8px 8px 0',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }}
              />
            )}
          </Box>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default NewsDetails;
