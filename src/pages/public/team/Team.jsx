import React, { useEffect, useState, useCallback } from 'react';
import { Box, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { SectionWrapper } from '../../../components';
import InfoBanner from '../../../components/InfoBanner';
import TeamMember from './components/TeamMember';
import AlumniTable from './components/AlumniTable';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateAlumni, updateTeam } from '../../../features/team';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { DEFAULT_FACULTY_CONTENT, getFacultyContent } from '../../../services/teamContentService';

const degrees = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];

const Team = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const team = useSelector((states) => states.team.team);
  const alumni = useSelector((states) => states.team.alumni);
  const [facultyData, setFacultyData] = useState(DEFAULT_FACULTY_CONTENT);
  const [availableDegrees, setAvailableDegrees] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateDegrees = useCallback((t) => {
    const availableDeg = [];
    degrees.forEach((degree) => {
      t.forEach((member) => {
        if (member.degree === degree && !availableDeg.includes(degree)) {
          availableDeg.push(degree);
        }
      });
    });
    setAvailableDegrees(availableDeg);
  }, []);

  const getTeam = useCallback(async () => {
    try {
      setLoading(true);
      const t = [];
      const q = query(collection(db, 'team'), where('isAlumni', '==', false));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        t.push({ ...doc.data(), id: doc.id });
      });
      dispatch(updateTeam(t));
      calculateDegrees(t);
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, calculateDegrees]);

  const getAlumni = useCallback(async () => {
    try {
      let a = [];
      const q = query(collection(db, 'alumni'), orderBy('year'));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((doc) => {
        (doc.data().alumnus || []).forEach((al) => {
          a.push({ ...al, year: doc.data().year });
        });
      });
      dispatch(updateAlumni(a.reverse()));
    } catch (err) {
      console.error('Error fetching alumni:', err);
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    getFacultyContent().then((res) => {
      if (isMounted && res) {
        setFacultyData(res);
      }
    });

    if (alumni === undefined || alumni.length === 0) {
      getAlumni();
    }

    if (team === undefined || team.length === 0) {
      getTeam();
    } else {
      calculateDegrees(team);
    }

    return () => {
      isMounted = false;
    };
  }, [alumni, team, getAlumni, getTeam, calculateDegrees]);

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
          <Box sx={{ maxWidth: '800px' }}>
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
              Our Team
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
              Researchers, Engineers & Scholars
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.65,
              }}
            >
              Meet the faculty, postdoctoral researchers, graduate students, and alumni shaping our intelligent cyber-physical systems initiatives.
            </Typography>
          </Box>
        </SectionWrapper>
      </Box>

      <SectionWrapper showBottomLine={false}>
        {/* Faculty & Principal Investigator Section */}
        <Box
          sx={{
            pt: { xs: 4, md: 5 },
            pb: { xs: 5, md: 6 },
            mb: { xs: 6, md: 8 },
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
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
              {facultyData.eyebrow || 'Faculty & Leadership'}
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
              {facultyData.sectionTitle || 'Principal Investigator & Lab Director'}
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
                  src={facultyData.directorImage || DEFAULT_FACULTY_CONTENT.directorImage}
                  alt={facultyData.directorName || 'Dr. Apurva Narayan'}
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
                directorName={facultyData.directorName}
                directorTitle={facultyData.directorTitle}
                directorBio={facultyData.directorBio}
                affiliations={facultyData.affiliations}
                email={facultyData.email}
                linkedin={facultyData.linkedin}
                googleScholar={facultyData.googleScholar}
                facultyDirectory={facultyData.facultyDirectory}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Active Lab Members Section Heading */}
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
              mb: 0.5,
            }}
          >
            Researchers & Scholars
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
            Active Lab Members
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          team !== undefined &&
          team.length > 0 &&
          availableDegrees.map((degree) => (
            <Box key={degree} sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    color: theme.palette.text.primary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {degree}s
                </Typography>
                <Chip
                  label={`${team.filter((m) => m.degree === degree).length} Members`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                  }}
                />
              </Box>

              <Grid container spacing={2.5}>
                {team.map(
                  (member) =>
                    member.name !== undefined &&
                    member.name.length > 0 &&
                    member.degree === degree && (
                      <Grid key={member.id || member.name} item xs={12} sm={6} md={4}>
                        <TeamMember
                          id={member.id}
                          imageLink={member.imageUrl}
                          name={member.name}
                          researchArea={member.researchArea}
                          coSupervisor={member.coSupervisor}
                          degree={member.degree}
                          description={member.description}
                          emailId={member.emailId}
                          yearJoined={member.yearJoined}
                        />
                      </Grid>
                    )
                )}
              </Grid>
            </Box>
          ))
        )}

        {/* Alumni Section */}
        <Box sx={{ mt: 6, pt: 6, borderTop: '1px solid', borderColor: theme.palette.divider }}>
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
                mb: 0.5,
              }}
            >
              Next Horizons
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.6rem', md: '2.1rem' },
                letterSpacing: '-0.02em',
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Lab Alumni
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Former graduate students and research associates now advancing technology in academia and leading global companies.
            </Typography>
          </Box>

          {alumni !== undefined && alumni.length > 0 && <AlumniTable data={alumni} />}
        </Box>
      </SectionWrapper>
    </Box>
  );
};

export default Team;
