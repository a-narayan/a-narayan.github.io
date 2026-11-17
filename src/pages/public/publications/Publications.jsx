import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SchoolIcon from '@mui/icons-material/School';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SyncIcon from '@mui/icons-material/Sync';
import { SectionWrapper } from '../../../components';
import PublicationBanner from '../../../components/PublicationBanner';
import { useDispatch } from 'react-redux';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updatePublications } from '../../../features/publications';
import { fetchAllPublications, getScholarProfile } from '../../../services/scholarService';
import { useTheme } from '@mui/material/styles';

const typeCategories = ['All Types', 'Conference', 'Journal', 'Workshop', 'Preprint'];
const topicCategories = [
  'All Topics',
  'Agentic AI & LLMs',
  'Trustworthy & Safe AI',
  'Cyber-Physical Systems & IoT',
  'Machine Learning & Analytics',
  'Smart Manufacturing & Robotics',
];

const Publications = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const scholar = getScholarProfile();

  // State
  const [publications, setPublications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [sortBy, setSortBy] = useState('year-desc'); // 'year-desc' | 'year-asc' | 'title-asc'
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load and merge publications across OpenAlex, Semantic Scholar, DBLP, and snapshot
  const loadPublications = useCallback(async (force = false) => {
    try {
      if (force) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      let firestorePubs = [];

      // Check Firestore
      try {
        const q = query(collection(db, 'publications'), orderBy('year'));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach((doc) => {
          const docPubs = doc.data()?.publications;
          if (Array.isArray(docPubs)) {
            docPubs.forEach((pub) => firestorePubs.push(pub));
          }
        });
      } catch (e) {
        // Safe to ignore if offline
      }

      const merged = await fetchAllPublications(firestorePubs, force);
      setPublications(merged);
      dispatch(updatePublications(merged));
    } catch (err) {
      console.error('Error loading publications:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadPublications(false);
  }, [loadPublications]);

  // Dynamically compute available years from loaded publications
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    publications.forEach((pub) => {
      const y = parseInt(pub.year, 10);
      if (!isNaN(y) && y >= 2021) {
        yearsSet.add(y.toString());
      }
    });
    const sorted = Array.from(yearsSet).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    return ['All Years', ...sorted, '2020 & Earlier'];
  }, [publications]);

  // Filtering & Sorting Pipeline
  const filteredAndSortedPublications = useMemo(() => {
    let result = [...publications];

    // 1. Text Search Filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter((pub) => {
        const titleMatch = (pub.title || '').toLowerCase().includes(q);
        const authorsMatch = (pub.authors || '').toLowerCase().includes(q);
        const venueMatch = (pub.venue || pub.booktitle || '').toLowerCase().includes(q);
        const yearMatch = (pub.year || '').toString().includes(q);
        const topicMatch = (pub.topic || '').toLowerCase().includes(q);
        return titleMatch || authorsMatch || venueMatch || yearMatch || topicMatch;
      });
    }

    // 2. Publication Type Filter
    if (selectedType !== 'All Types') {
      result = result.filter((pub) => {
        const type = (pub.type || pub.publicationType || '').toLowerCase();
        return type.includes(selectedType.toLowerCase());
      });
    }

    // 3. Topic Filter
    if (selectedTopic !== 'All Topics') {
      result = result.filter((pub) => {
        return (pub.topic || '').toLowerCase() === selectedTopic.toLowerCase();
      });
    }

    // 4. Year Filter
    if (selectedYear !== 'All Years') {
      result = result.filter((pub) => {
        const y = parseInt(pub.year, 10);
        if (selectedYear === '2020 & Earlier') {
          return y <= 2020;
        }
        return y === parseInt(selectedYear, 10);
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === 'year-desc') {
        return (b.year || 0) - (a.year || 0) || (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'year-asc') {
        return (a.year || 0) - (b.year || 0) || (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [publications, searchQuery, selectedType, selectedTopic, selectedYear, sortBy]);

  // Sliced items for "View More" pagination
  const visiblePublications = useMemo(() => {
    return filteredAndSortedPublications.slice(0, visibleCount);
  }, [filteredAndSortedPublications, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredAndSortedPublications.length);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedTopic('All Topics');
    setSelectedYear('All Years');
    setSortBy('year-desc');
    setVisibleCount(20);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* 1. Page Header */}
      <Box
        sx={{
          pt: { xs: 6, md: 7 },
          pb: { xs: 5, md: 6 },
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent 70%), #080B11'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%), #F8FAFC',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <SectionWrapper showBottomLine={false}>
          <Box sx={{ maxWidth: '900px' }}>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isDark ? '#60A5FA' : '#1D4ED8',
                }}
              >
                Research & Dissemination
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.2rem', md: '3.2rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: theme.palette.text.primary,
                mb: 1.5,
              }}
            >
              IDSL Lab Publications
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#CBD5E1' : '#475569',
                fontSize: { xs: '1rem', md: '1.12rem' },
                lineHeight: 1.65,
                mb: 3,
                maxWidth: '780px',
              }}
            >
              Peer-reviewed conference proceedings, journal articles, and preprints from the Intelligent Data Science Lab (IDSL) led by Dr. Apurva Narayan across Western University, the University of British Columbia, and the University of Waterloo.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<SchoolIcon />}
                onClick={() => window.open(scholar.scholarUrl, '_blank')}
                sx={{
                  borderRadius: '9999px',
                  px: 3,
                  py: 1,
                  fontSize: '0.88rem',
                  fontWeight: 700,
                }}
              >
                Google Scholar Profile
              </Button>

              <Button
                variant="outlined"
                onClick={() => loadPublications(true)}
                disabled={isRefreshing}
                startIcon={
                  <SyncIcon
                    sx={{
                      fontSize: '1rem',
                      animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                }
                sx={{
                  borderRadius: '9999px',
                  px: 2.5,
                  py: 1,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {isRefreshing ? 'Syncing...' : 'Sync Publications'}
              </Button>

              <Chip
                label={`${publications.length} Papers`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
                  color: isDark ? '#93C5FD' : '#1D4ED8',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
                }}
              />
            </Box>
          </Box>
        </SectionWrapper>
      </Box>

      {/* 2. Main Content & Filters */}
      <SectionWrapper showBottomLine={false}>
        
        {/* Search, Filter & Sort Control Panel */}
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 4,
            borderRadius: '20px',
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Row 1: Search Bar & Sort Dropdown */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                placeholder="Search publications by title, co-author (e.g. Devulapalli, Sharma), venue, year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '9999px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <ClearIcon
                        onClick={() => setSearchQuery('')}
                        sx={{ cursor: 'pointer', fontSize: '1.1rem', color: theme.palette.text.secondary }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>

            {/* Sort Dropdown */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon sx={{ fontSize: '1.1rem', color: theme.palette.text.secondary, ml: 1 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <MenuItem value="year-desc">Sort by: Newest First (Year ↓)</MenuItem>
                  <MenuItem value="year-asc">Sort by: Oldest First (Year ↑)</MenuItem>
                  <MenuItem value="title-asc">Sort by: Title (A → Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Year Selector */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  {availableYears.map((yr) => (
                    <MenuItem key={yr} value={yr}>
                      {yr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Row 2: Type Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, mr: 1, textTransform: 'uppercase' }}>
              Type:
            </Typography>
            {typeCategories.map((type) => {
              const active = selectedType === type;
              return (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => setSelectedType(type)}
                  clickable
                  size="small"
                  sx={{
                    fontWeight: active ? 700 : 500,
                    borderRadius: '9999px',
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.25)'
                        : 'rgba(29, 78, 216, 0.12)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.03)',
                    color: active ? (isDark ? '#60A5FA' : '#1D4ED8') : theme.palette.text.secondary,
                    border: '1px solid',
                    borderColor: active ? (isDark ? '#3B82F6' : '#1D4ED8') : theme.palette.divider,
                  }}
                />
              );
            })}
          </Box>

          {/* Row 3: Topic Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, mr: 1, textTransform: 'uppercase' }}>
              Theme:
            </Typography>
            {topicCategories.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <Chip
                  key={topic}
                  label={topic}
                  onClick={() => setSelectedTopic(topic)}
                  clickable
                  size="small"
                  sx={{
                    fontWeight: active ? 700 : 500,
                    borderRadius: '9999px',
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(6, 182, 212, 0.22)'
                        : 'rgba(2, 132, 199, 0.12)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.04)'
                      : 'rgba(0, 0, 0, 0.03)',
                    color: active ? (isDark ? '#22D3EE' : '#0284C7') : theme.palette.text.secondary,
                    border: '1px solid',
                    borderColor: active ? (isDark ? '#06B6D4' : '#0284C7') : theme.palette.divider,
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* 3. Status Bar: Result Count & Active Filter Indicator */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            Showing <strong>{Math.min(visibleCount, filteredAndSortedPublications.length)}</strong> of{' '}
            <strong>{filteredAndSortedPublications.length}</strong> matching papers
            {selectedType !== 'All Types' && ` · ${selectedType}`}
            {selectedTopic !== 'All Topics' && ` · ${selectedTopic}`}
            {selectedYear !== 'All Years' && ` · ${selectedYear}`}
            {searchQuery && ` · "${searchQuery}"`}
          </Typography>

          {(searchQuery || selectedType !== 'All Types' || selectedTopic !== 'All Topics' || selectedYear !== 'All Years') && (
            <Button
              size="small"
              onClick={handleResetFilters}
              sx={{ fontSize: '0.82rem', textTransform: 'none', color: theme.palette.primary.main }}
            >
              Reset all filters
            </Button>
          )}
        </Box>

        {/* 4. Publication List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : visiblePublications.length > 0 ? (
          <Box>
            {visiblePublications.map((pub, index) => (
              <PublicationBanner
                key={pub.id || pub.title + index}
                index={index + 1}
                publicationType={pub.type || pub.publicationType}
                title={pub.title}
                authors={pub.authors}
                booktitle={pub.venue || pub.booktitle}
                ppText={pub.ppText}
                year={pub.year}
                topic={pub.topic}
                scholarUrl={pub.scholarUrl}
                pdfUrl={pub.pdfUrl}
                doi={pub.doi}
                bibtex={pub.bibtex}
                links={pub.links}
              />
            ))}

            {/* 5. View More / Pagination Controls */}
            {visibleCount < filteredAndSortedPublications.length && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  mt: 4,
                  pt: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoadMore}
                  endIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: '9999px',
                    px: 4,
                    py: 1.25,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                  }}
                >
                  Load More (+10 Publications)
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleShowAll}
                  sx={{
                    borderRadius: '9999px',
                    px: 3,
                    py: 1.25,
                    fontSize: '0.92rem',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                  }}
                >
                  View All ({filteredAndSortedPublications.length})
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(15, 21, 35, 0.5)' : 'rgba(241, 245, 249, 0.5)',
              border: '1px dashed',
              borderColor: theme.palette.divider,
            }}
          >
            <FilterListIcon sx={{ fontSize: '2.5rem', color: theme.palette.text.secondary, mb: 1.5 }} />
            <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
              No publications match your filter criteria
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
              Try adjusting your search query, or selecting "All Types" and "All Topics".
            </Typography>
            <Button variant="outlined" size="small" onClick={handleResetFilters} sx={{ borderRadius: '9999px' }}>
              Reset Filters
            </Button>
          </Box>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default Publications;
