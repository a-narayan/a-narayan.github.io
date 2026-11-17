import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { NewsArticleBanner, SectionWrapper } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateNews } from '../../../features/news';
import { formatTimestamp } from '../../../utils/dateUtils';
import { useTheme } from '@mui/material/styles';

const News = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const newsArticles = useSelector((states) => states.news.value);
  const [loading, setLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const n = [];
      const q = query(collection(db, 'news'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        const docData = doc.data();
        docData.date = formatTimestamp(docData.date);
        n.push({ ...docData, id: doc.id });
      });
      dispatch(updateNews(n));
    } catch (err) {
      try {
        const querySnapshot = await getDocs(collection(db, 'news'));
        const n = [];
        querySnapshot.docs.forEach((doc) => {
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
  }, [dispatch]);

  useEffect(() => {
    if (newsArticles === undefined || newsArticles.length === 0) {
      fetchNews();
    }
  }, [newsArticles, fetchNews]);

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
              News & Updates
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
              Lab Dispatches & Announcements
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
              }}
            >
              The latest breakthroughs, paper acceptances, conference appearances, honors, and milestone events from IDSL.
            </Typography>
          </Box>
        </SectionWrapper>
      </Box>

      <SectionWrapper showBottomLine={false}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : newsArticles !== undefined && newsArticles.length > 0 ? (
          newsArticles.map((newsArticle, index) => (
            <NewsArticleBanner
              key={newsArticle.id || index}
              id={newsArticle.id}
              index={newsArticles.length - index}
              title={newsArticle.title}
              subtitle={newsArticle.subtitle}
              date={newsArticle.date}
              content={newsArticle.content}
            />
          ))
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            No news articles available.
          </Typography>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default News;
