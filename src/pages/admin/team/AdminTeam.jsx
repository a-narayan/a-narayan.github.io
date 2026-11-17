import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { SectionWrapper } from '../../../components';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateAlumni, updateTeam } from '../../../features/team';
import AdminTeamMember from './components/AdminTeamMember';
import EditTeamMemberDialog from './components/EditTeamMemberDialog';
import AdminAlumniManager from './components/AdminAlumniManager';
import AdminFacultyLeadership from './components/AdminFacultyLeadership';
import AlumnusDialog from './components/AlumnusDialog';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SearchIcon from '@mui/icons-material/Search';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';

const DEGREES = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];

const AdminTeam = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch();

  const rawTeam = useSelector((states) => states.team.team);
  const team = useMemo(() => rawTeam || [], [rawTeam]);
  const rawAlumni = useSelector((states) => states.team.alumni);
  const alumni = useMemo(() => rawAlumni || [], [rawAlumni]);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [availableDegrees, setAvailableDegrees] = useState([]);

  // Dialog states
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addAlumnusDialogOpen, setAddAlumnusDialogOpen] = useState(false);

  const calculateDegrees = useCallback((t) => {
    const availableDeg = [];
    DEGREES.forEach((degree) => {
      if (t.some((member) => member.degree === degree) && !availableDeg.includes(degree)) {
        availableDeg.push(degree);
      }
    });
    // Add any custom degrees not in DEGREES
    t.forEach((member) => {
      if (member.degree && !availableDeg.includes(member.degree)) {
        availableDeg.push(member.degree);
      }
    });
    setAvailableDegrees(availableDeg);
  }, []);

  const getTeam = useCallback(async () => {
    try {
      setLoading(true);
      const t = [];
      const q = query(collection(db, 'team'), where('isAlumni', '==', false));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((d) => {
        t.push({ ...d.data(), id: d.id });
      });
      dispatch(updateTeam(t));
      calculateDegrees(t);
    } catch (err) {
      console.error('Error fetching team in admin:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, calculateDegrees]);

  const getAlumni = useCallback(async () => {
    try {
      const a = [];
      const q = query(collection(db, 'alumni'), orderBy('year'));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach((d) => {
        const alumnusList = d.data().alumnus || [];
        alumnusList.forEach((al) => {
          a.push({ ...al, year: d.data().year });
        });
      });
      dispatch(updateAlumni(a.reverse()));
    } catch (err) {
      console.error('Error fetching alumni in admin:', err);
    }
  }, [dispatch]);

  useEffect(() => {
    getTeam();
    getAlumni();
  }, [getTeam, getAlumni]);

  // Filter team members based on search and degree selection
  const filteredTeam = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return team.filter((member) => {
      // Degree filter
      if (degreeFilter !== 'All' && member.degree !== degreeFilter) {
        return false;
      }
      // Search filter
      if (!q) return true;
      const nameMatch = (member.name || '').toLowerCase().includes(q);
      const emailMatch = (member.emailId || '').toLowerCase().includes(q);
      const researchMatch = (member.researchArea || '').toLowerCase().includes(q);
      const supervisorMatch = (member.coSupervisor || '').toLowerCase().includes(q);
      const degreeMatch = (member.degree || '').toLowerCase().includes(q);
      return nameMatch || emailMatch || researchMatch || supervisorMatch || degreeMatch;
    });
  }, [team, searchQuery, degreeFilter]);

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      {/* Hero Header */}
      <Box
        sx={{
          pt: { xs: 5, md: 7 },
          pb: { xs: 4, md: 5 },
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent 70%), #080B11'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.08), transparent 70%), #F8FAFC',
          borderBottom: '1px solid',
          borderColor: theme.palette.divider,
        }}
      >
        <SectionWrapper showBottomLine={false}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: '750px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Chip
                  label="Admin Console"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.1)',
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                  }}
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                  Team & Scholars Directory
                </Typography>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: theme.palette.text.primary,
                  mb: 1.5,
                }}
              >
                Lab Team Management
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.6,
                }}
              >
                Manage active student and postdoc researcher profiles, maintain historical graduating alumni records, and update faculty leadership details.
              </Typography>
            </Box>

            {/* Quick Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<PersonAddOutlinedIcon />}
                onClick={() => setAddMemberDialogOpen(true)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.1,
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                + Add Team Member
              </Button>
              <Button
                variant="outlined"
                startIcon={<SchoolOutlinedIcon />}
                onClick={() => setAddAlumnusDialogOpen(true)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  py: 1.1,
                }}
              >
                + Add Alumnus
              </Button>
            </Box>
          </Box>
        </SectionWrapper>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: '1px solid', borderColor: theme.palette.divider, mb: 4 }}>
        <SectionWrapper showBottomLine={false}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                minHeight: '56px',
                px: 2.5,
              },
            }}
          >
            <Tab
              icon={<GroupsOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label={`Active Researchers (${team.length})`}
            />
            <Tab
              icon={<SchoolOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label={`Lab Alumni (${alumni.length})`}
            />
            <Tab
              icon={<SupervisorAccountOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Faculty & Leadership"
            />
          </Tabs>
        </SectionWrapper>
      </Box>

      {/* Content Container */}
      <SectionWrapper showBottomLine={false}>
        {/* Tab 0: Active Researchers & Students */}
        {tabValue === 0 && (
          <Box>
            {/* Filter & Search Bar */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                size="small"
                placeholder="Search active team by name, research area, email, or advisor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 520 },
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
                  },
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                  Showing: <strong>{filteredTeam.length}</strong> of {team.length} researchers
                </Typography>
              </Box>
            </Box>

            {/* Degree Filter Chips */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 4 }}>
              <Chip
                label={`All Degrees (${team.length})`}
                onClick={() => setDegreeFilter('All')}
                color={degreeFilter === 'All' ? 'primary' : 'default'}
                variant={degreeFilter === 'All' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700, borderRadius: '9999px', fontSize: '0.8rem' }}
              />
              {availableDegrees.map((deg) => {
                const count = team.filter((m) => m.degree === deg).length;
                return (
                  <Chip
                    key={deg}
                    label={`${deg} (${count})`}
                    onClick={() => setDegreeFilter(deg)}
                    color={degreeFilter === deg ? 'primary' : 'default'}
                    variant={degreeFilter === deg ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600, borderRadius: '9999px', fontSize: '0.8rem' }}
                  />
                );
              })}
            </Box>

            {/* Loading Spinner */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={36} />
              </Box>
            ) : filteredTeam.length === 0 ? (
              /* Empty state */
              <Card
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(15, 21, 35, 0.5)' : '#FFFFFF',
                  border: '1px dashed',
                  borderColor: theme.palette.divider,
                }}
              >
                <GroupsOutlinedIcon sx={{ fontSize: 52, color: theme.palette.text.secondary, mb: 1.5, opacity: 0.6 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  No Team Members Found
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2.5 }}>
                  {searchQuery || degreeFilter !== 'All'
                    ? 'No members match the current filter or search criteria.'
                    : 'There are no active researchers recorded in the database yet.'}
                </Typography>
                {(searchQuery || degreeFilter !== 'All') ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      setDegreeFilter('All');
                    }}
                    sx={{ borderRadius: '8px' }}
                  >
                    Reset Filters
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setAddMemberDialogOpen(true)}
                    sx={{ borderRadius: '8px', textTransform: 'none' }}
                  >
                    + Add New Student
                  </Button>
                )}
              </Card>
            ) : degreeFilter === 'All' && !searchQuery ? (
              /* Grouped by Degree */
              availableDegrees.map((degree) => {
                const degreeMembers = filteredTeam.filter((m) => m.degree === degree);
                if (degreeMembers.length === 0) return null;
                return (
                  <Box key={degree} sx={{ mb: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          fontSize: '1.25rem',
                          color: theme.palette.text.primary,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {degree}s
                      </Typography>
                      <Chip
                        label={`${degreeMembers.length} Active`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          borderRadius: '9999px',
                          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                          color: isDark ? '#60A5FA' : '#1D4ED8',
                        }}
                      />
                    </Box>

                    <Grid container spacing={2.5}>
                      {degreeMembers.map((member) => (
                        <Grid key={member.id} item xs={12} sm={6} md={4}>
                          <AdminTeamMember
                            id={member.id}
                            imageLink={member.imageUrl}
                            name={member.name}
                            researchArea={member.researchArea}
                            coSupervisor={member.coSupervisor}
                            degree={member.degree}
                            description={member.description}
                            emailId={member.emailId}
                            yearJoined={member.yearJoined}
                            password={member.password}
                            onRefresh={getTeam}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })
            ) : (
              /* Flat Filtered Grid */
              <Grid container spacing={2.5}>
                {filteredTeam.map((member) => (
                  <Grid key={member.id} item xs={12} sm={6} md={4}>
                    <AdminTeamMember
                      id={member.id}
                      imageLink={member.imageUrl}
                      name={member.name}
                      researchArea={member.researchArea}
                      coSupervisor={member.coSupervisor}
                      degree={member.degree}
                      description={member.description}
                      emailId={member.emailId}
                      yearJoined={member.yearJoined}
                      password={member.password}
                      onRefresh={getTeam}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Tab 1: Alumni Management */}
        {tabValue === 1 && (
          <AdminAlumniManager alumni={alumni} onRefresh={getAlumni} />
        )}

        {/* Tab 2: Faculty & Leadership CMS */}
        {tabValue === 2 && (
          <AdminFacultyLeadership />
        )}
      </SectionWrapper>

      {/* Add New Member Dialog */}
      {addMemberDialogOpen && (
        <EditTeamMemberDialog
          dialogOpen={addMemberDialogOpen}
          handleDialogClose={() => setAddMemberDialogOpen(false)}
          onSuccess={getTeam}
          isEdit={false}
        />
      )}

      {/* Add Alumnus Dialog */}
      {addAlumnusDialogOpen && (
        <AlumnusDialog
          open={addAlumnusDialogOpen}
          handleClose={() => setAddAlumnusDialogOpen(false)}
          onSuccess={getAlumni}
          isEdit={false}
        />
      )}
    </Box>
  );
};

export default AdminTeam;
