import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { SectionWrapper } from '../../../../components';
import HighlightBanner from '../../../../components/HighlightBanner';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { updateHighlights } from '../../../../features/highlights';
import { useTheme } from '@mui/material/styles';

const Highlights = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const highlights = useSelector((states) => states.highlights.value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const docSnapshot = await getDoc(doc(db, 'highlights', 'highlights'));
        if (docSnapshot.exists()) {
          const n = [];
          (docSnapshot.data().highlights || []).forEach((highlight) => {
            n.push(highlight);
          });
          dispatch(updateHighlights(n));
        }
      } catch (err) {
        console.error('Error fetching highlights:', err);
      } finally {
        setLoading(false);
      }
    };

    if (highlights === undefined || highlights.length === 0) {
      fetchHighlights();
    }
  }, [dispatch, highlights]);

  // If no highlights and not loading, we can still render if there are any
  if (!loading && (!highlights || highlights.length === 0)) {
    return null;
  }

  return (
    <SectionWrapper>
      <Box sx={{ mb: 3.5 }}>
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
          Recent Spotlights
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
          Lab Highlights
        </Typography>
      </Box>

      {loading && (!highlights || highlights.length === 0) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        highlights.map((highlight, index) => (
          <HighlightBanner
            key={highlight.id || highlight.text || index}
            date={highlight.date}
            text={highlight.text}
            link={highlight.link}
          />
        ))
      )}
    </SectionWrapper>
  );
};

export default Highlights;
