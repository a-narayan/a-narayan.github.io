import React, { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { SectionWrapper } from '../../../components';
import ResourcesTable from './components/ResourcesTable';
import { updateResources } from '../../../features/resources';
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { formatTimestamp } from '../../../utils/dateUtils';
import Images from '../../../sections/images/Images';
import { useTheme } from '@mui/material/styles';

const Resources = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const resources = useSelector((states) => states.resources.value);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const r = [];
      const q = query(collection(db, 'resources'), orderBy('date'));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        const docData = { ...doc.data() };
        docData.date = formatTimestamp(docData.date);
        r.push(docData);
      });
      dispatch(updateResources(r));
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (resources === undefined || resources.length === 0) {
      fetchResources();
    }
    const getData = async () => {
      try {
        const docSnapshot = await getDoc(doc(db, 'resourcesContent', 'resourcesContent'));
        if (docSnapshot.exists()) {
          setData(docSnapshot.data()?.data || []);
        }
      } catch (err) {
        console.error('Error loading resources content:', err);
      }
    };
    getData();
  }, [resources, fetchResources]);

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
              Datasets & Toolkits
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
              Open-Source Resources & Benchmarks
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
              }}
            >
              Explore experimental benchmark suites, industrial datasets, presentation recordings, and reproducible software code developed at IDSL.
            </Typography>
          </Box>
        </SectionWrapper>
      </Box>

      <SectionWrapper showBottomLine={false}>
        {/* Dynamic Firestore content */}
        {data &&
          data.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              {item.type === 'html' ? (
                <div style={{ lineHeight: '1.65' }} dangerouslySetInnerHTML={{ __html: item.content }} />
              ) : (
                <Images links={item.links} />
              )}
            </Box>
          ))}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : resources !== undefined && resources.length > 0 ? (
          <ResourcesTable data={resources} />
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            No resources available at this time.
          </Typography>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default Resources;
