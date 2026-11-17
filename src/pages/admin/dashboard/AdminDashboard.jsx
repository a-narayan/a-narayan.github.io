import React from 'react';
import { SectionWrapper } from '../../../components';
import { Box, Chip, Grid, Typography } from '@mui/material';
import AdminDashboardButton from './components/AdminDashboardButton';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const userData = useSelector((states) => states.user.value);

  const pages = ['Home', 'Publications', 'News', 'Team', 'Research', 'Resources', 'Opportunities'];
  const paths = [
    `/admin/${userData.id}/home`,
    `/admin/${userData.id}/publications`,
    `/admin/${userData.id}/news`,
    `/admin/${userData.id}/team`,
    `/admin/${userData.id}/research`,
    `/admin/${userData.id}/resources`,
    `/admin/${userData.id}/opportunities`,
  ];

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <SectionWrapper showBottomLine={false}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                letterSpacing: '-0.025em',
                color: theme.palette.text.primary,
              }}
            >
              Admin Console
            </Typography>
            <Chip
              label="Administrator"
              size="small"
              sx={{
                fontWeight: 700,
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.1)',
                color: isDark ? '#60A5FA' : '#1D4ED8',
              }}
            />
          </Box>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Welcome back{userData.name ? `, ${userData.name}` : ''}. Select a module below to edit website content or manage lab data.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {pages.map((page, index) => (
            <Grid key={page} item xs={12} sm={6} md={4} lg={3}>
              <AdminDashboardButton
                onClick={() => {
                  navigate(paths[index]);
                }}
              >
                {page}
              </AdminDashboardButton>
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>
    </Box>
  );
};

export default AdminDashboard;
