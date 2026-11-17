import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SectionWrapper } from '../../../components';
import { Box, Button, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import TeamMemberImage from './components/TeamMemberImage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EmailIcon from '@mui/icons-material/Email';

const TeamMemberDetails = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [dataAvailable, setDataAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const [imageLink, setImageLink] = useState('');
  const [name, setName] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [coSupervisor, setCoSupervisor] = useState('');
  const [degree, setDegree] = useState('');
  const [description, setDescription] = useState('');
  const [emailId, setEmailId] = useState('');
  const [yearJoined, setYearJoined] = useState('');

  const fetchTeamMemberDetails = useCallback(async () => {
    try {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, 'team', params.id));
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setImageLink(data.imageUrl || '');
        setName(data.name || '');
        setResearchArea(data.researchArea || '');
        setCoSupervisor(data.coSupervisor || '');
        setDegree(data.degree || '');
        setDescription(data.description || '');
        setEmailId(data.emailId || '');
        setYearJoined(data.yearJoined || '');
        setDataAvailable(true);
      } else {
        setDataAvailable(false);
      }
    } catch (err) {
      console.error('Error fetching member details:', err);
      setDataAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!location.state || Object.keys(location.state).length === 0) {
      fetchTeamMemberDetails();
    } else {
      setImageLink(location.state.imageLink || '');
      setName(location.state.name || '');
      setResearchArea(location.state.researchArea || '');
      setCoSupervisor(location.state.coSupervisor || '');
      setDegree(location.state.degree || '');
      setDescription(location.state.description || '');
      setEmailId(location.state.emailId || '');
      setYearJoined(location.state.yearJoined || '');
      setDataAvailable(true);
      setLoading(false);
    }
  }, [location.state, fetchTeamMemberDetails]);

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <SectionWrapper showBottomLine={false}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/team')}
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
          Back to Team Directory
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : dataAvailable ? (
          <Grid container spacing={4}>
            {/* Left Col: Avatar & Badges */}
            <Grid item xs={12} md={4} lg={3.5}>
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TeamMemberImage imageLink={imageLink} diameter="150px" alt={name} />

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    mt: 2.5,
                    mb: 0.5,
                    color: theme.palette.text.primary,
                  }}
                >
                  {name}
                </Typography>

                {degree && (
                  <Chip
                    label={degree}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: '9999px',
                      mt: 1,
                      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                      color: isDark ? '#60A5FA' : '#1D4ED8',
                    }}
                  />
                )}

                {yearJoined && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                    Member since {yearJoined}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Right Col: Details */}
            <Grid item xs={12} md={8} lg={8.5}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: '20px',
                  backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 2,
                  }}
                >
                  Biography & Overview
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.75,
                    mb: 4,
                  }}
                >
                  {description || 'No biography provided.'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3, borderTop: '1px solid', borderColor: theme.palette.divider }}>
                  
                  {/* Program / Degree */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: theme.palette.primary.main, mt: 0.25 }}>
                      <SchoolIcon />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: 'uppercase' }}>
                        Program / Degree
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        {degree} {yearJoined ? `(Joined ${yearJoined})` : ''}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Research Area */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: isDark ? '#38BDF8' : '#0284C7', mt: 0.25 }}>
                      <PsychologyIcon />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: 'uppercase' }}>
                        Primary Research Area
                      </Typography>
                      <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                        {researchArea || 'Cyber-Physical Systems & Machine Learning'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Co-Supervisor */}
                  {coSupervisor && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ color: '#8B5CF6', mt: 0.25 }}>
                        <SupervisorAccountIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: 'uppercase' }}>
                          Co-Supervisor(s)
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                          {coSupervisor}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Email */}
                  {emailId && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ color: '#10B981', mt: 0.25 }}>
                        <EmailIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 700, textTransform: 'uppercase' }}>
                          Email Contact
                        </Typography>
                        <Typography
                          component="a"
                          href={`mailto:${emailId}`}
                          variant="body1"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {emailId}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Member details not found.
          </Typography>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default TeamMemberDetails;
