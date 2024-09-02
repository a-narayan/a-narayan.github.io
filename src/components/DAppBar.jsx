import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useLocation, useNavigate } from 'react-router-dom';
import colors from '../constants/colors';
import SizedBox from './SizedBox';

const pages = ['Home', 'News', 'Team', 'Research', 'Publications', 'Opportunities', 'Resources'];
const paths = ['/', '/news', '/team', '/research', '/publications', '/opportunities', '/resources'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function DAppBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState('Home');

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page, index) => {
        navigate(paths[index]);
        setCurrentPage(page);
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static"
            elevation={0}
            sx={{ backgroundColor: '#eee', color: '#444' }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src="https://a-narayan.github.io/assets/img/favicon.ico" style={{ maxWidth: '20px', maxHeight: '20px' }} />
                    <SizedBox width={'8px'} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: colors.dColor2,
                            textDecoration: 'none',
                        }}
                    >
                        IDSL
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page, index) => (
                                <MenuItem key={page} onClick={() => {
                                    handleCloseNavMenu(page, index)
                                }}>
                                    <Typography textTransform={'none'} textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ display: 'flex', height: '4.5rem', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page, index) => (
                            <Button
                                key={page}
                                onClick={() => {
                                    handleCloseNavMenu(page, index);
                                }}
                                sx={location.pathname.length <= 2 && index === 0 ? { color: colors.dColor1, textTransform: 'none', fontWeight: 'bold', height: '100%', borderRadius: 0, backgroundColor: '#ddd' } :
                                    paths[index].length > 2 && location.pathname.startsWith(paths[index]) ? { color: colors.dColor1, textTransform: 'none', fontWeight: 'bold', height: '100%', borderRadius: 0, backgroundColor: '#ddd' } :
                                        { color: '#444', textTransform: 'none', fontWeight: 'bold', height: '100%', borderRadius: 0 }}
                            >
                                <Typography sx={{ px: '1rem', fontSize: '16px', fontWeight: 'bold' }}>{page}</Typography>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default DAppBar;
