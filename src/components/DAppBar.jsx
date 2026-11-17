import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/images/favicon.ico';

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Research', path: '/research' },
  { label: 'Publications', path: '/publications' },
  { label: 'Team', path: '/team' },
  { label: 'News', path: '/news' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Resources', path: '/resources' },
];

function DAppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        backgroundColor: isDark ? 'rgba(8, 11, 17, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: '64px', md: '72px' }, display: 'flex', alignItems: 'center' }}>
          
          {/* Logo & Brand Name (Desktop) */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
              textDecoration: 'none',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(29, 78, 216, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
                mr: 1.5,
              }}
            >
              <img
                src={logo}
                alt="IDSL Logo"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  background: isDark
                    ? 'linear-gradient(135deg, #FFFFFF 30%, #60A5FA 100%)'
                    : 'linear-gradient(135deg, #0F172A 30%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                IDSL
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  lineHeight: 1,
                  fontSize: '0.68rem',
                  letterSpacing: '0.04em',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                }}
              >
                Intelligent Data Science Lab
              </Typography>
            </Box>
          </Box>

          {/* Mobile Hamburger Button */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="medium"
              aria-label="open navigation menu"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{
                p: '8px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo & Brand (Mobile) */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer',
              ml: 1.5,
            }}
          >
            <img
              src={logo}
              alt="IDSL Logo"
              style={{ width: '22px', height: '22px', marginRight: '8px' }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                color: theme.palette.text.primary,
              }}
            >
              IDSL
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            {pages.map((page) => {
              const active = isActive(page.path);
              return (
                <Button
                  key={page.label}
                  onClick={() => handleNavClick(page.path)}
                  sx={{
                    px: '14px',
                    py: '6px',
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: active ? 700 : 500,
                    color: active
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.12)'
                        : 'rgba(29, 78, 216, 0.08)'
                      : 'transparent',
                    border: '1px solid',
                    borderColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.25)'
                        : 'rgba(29, 78, 216, 0.2)'
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: theme.palette.text.primary,
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Action Utilities (Theme Switcher + Portal Button) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ThemeToggle />

            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/login')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                fontSize: '0.82rem',
                py: '6px',
                px: '16px',
                borderRadius: '9999px',
              }}
            >
              Lab Portal
            </Button>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: '280px',
            backgroundColor: isDark ? '#0A0D14' : '#FFFFFF',
            backgroundImage: 'none',
            borderRight: '1px solid',
            borderColor: theme.palette.divider,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="IDSL Logo" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
            <Typography variant="h6" fontWeight={800}>
              IDSL
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} size="small" color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <List sx={{ p: 0 }}>
          {pages.map((page) => {
            const active = isActive(page.path);
            return (
              <ListItem key={page.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(page.path)}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(29, 78, 216, 0.08)'
                      : 'transparent',
                    color: active ? theme.palette.primary.main : theme.palette.text.primary,
                  }}
                >
                  <ListItemText
                    primary={page.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: theme.palette.divider }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleNavClick('/login')}
            sx={{ borderRadius: '9999px', py: 1 }}
          >
            Lab Portal
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default DAppBar;
