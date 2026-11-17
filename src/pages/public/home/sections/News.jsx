import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../../components';
import NewsBanner from '../../../../components/NewsBanner';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { updateNews } from '../../../../features/news';
import { formatTimestamp } from '../../../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const News = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const newsArticles = useSelector((states) => states.news.value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'news'), orderBy('date', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        const n = [];
        querySnapshot.docs.forEach((doc) => {
          const docData = doc.data();
          docData.date = formatTimestamp(docData.date);
          n.push({ ...docData, id: doc.id });
        });
        dispatch(updateNews(n));
      } catch (err) {
        // Fallback without orderBy if index is building
        try {
          const snapshot = await getDocs(collection(db, 'news'));
          const n = [];
          snapshot.docs.forEach((doc) => {
            const docData = doc.data();
            docData.date = formatTimestamp(docData.date);
            n.push({ ...docData, id: doc.id });
          });
          dispatch(updateNews(n));
        } catch (e) {
          console.error('Error fetching news:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    if (newsArticles === undefined || newsArticles.length === 0) {
      fetchNews();
    }
  }, [dispatch, newsArticles]);

  return (
    <SectionWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: 'inline-block',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? '#60A5FA' : '#1D4ED8',
              mb: 0.5,
            }}
          >
            Latest News
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.6rem', md: '2.1rem' },
              letterSpacing: '-0.02em',
              color: theme.palette.text.primary,
            }}
          >
            Research Updates & Announcements
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate('/news')}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: '9999px',
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            px: 2.5,
            py: 0.75,
            flexShrink: 0,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(29, 78, 216, 0.05)',
            },
          }}
        >
          View All News
        </Button>
      </Box>

      {loading && (!newsArticles || newsArticles.length === 0) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {newsArticles &&
            newsArticles.slice(0, 4).map((article) => (
              <Grid item xs={12} md={6} key={article.id}>
                <NewsBanner
                  id={article.id}
                  index={article.index}
                  title={article.title}
                  subtitle={article.subtitle}
                  date={article.date}
                  content={article.content}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </SectionWrapper>
  );
};

export default News;
