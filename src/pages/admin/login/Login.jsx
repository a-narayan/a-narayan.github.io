import React, { useState } from 'react';
import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { comparePasswords } from '../../../utils/encryptionUtils';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../../../hooks/useAlerts';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../features/user';
import { useTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../../../assets/images/favicon.ico';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!emailId || !password) {
      showDialog('', 'Please enter both email and password', 'Ok');
      return;
    }

    try {
      setLoading(true);
      const q = query(collection(db, 'team'), where('emailId', '==', emailId.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const isMatch = await comparePasswords(password, querySnapshot.docs[0].data().password);
        if (isMatch) {
          const userData = querySnapshot.docs[0].data();
          const userId = querySnapshot.docs[0].id;
          if (userData.userType === 'admin') {
            dispatch(
              loginUser({
                id: userId,
                name: userData.name,
                userType: 'admin',
              })
            );
            navigate(`/admin/${userId}/dashboard`);
          } else if (userData.userType === 'student') {
            dispatch(
              loginUser({
                id: userId,
                name: userData.name,
                userType: 'student',
              })
            );
            navigate(`/student/${userId}/dashboard`);
          } else {
            showDialog('', 'Account role not recognized', 'Ok');
          }
        } else {
          showDialog('', 'Invalid password entered', 'Ok');
        }
      } else {
        showDialog('', 'The email address is not registered', 'Ok');
      }
    } catch (err) {
      console.error('Login error:', err);
      showDialog('', 'An error occurred during authentication', 'Ok');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        background: isDark
          ? 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(59, 130, 246, 0.12), transparent 70%)'
          : 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(37, 99, 235, 0.06), transparent 70%)',
      }}
    >
      <Container maxWidth="xs">
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            p: 4,
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.85)' : '#FFFFFF',
            backdropFilter: 'blur(16px)',
            border: '1px solid',
            borderColor: theme.palette.divider,
            boxShadow: isDark
              ? '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px -2px rgba(59, 130, 246, 0.15)'
              : '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: '1.6rem',
              letterSpacing: '-0.02em',
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Lab Portal
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              textAlign: 'center',
              mb: 3,
            }}
          >
            Sign in to manage IDSL research, publications, and profiles.
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            margin="normal"
            size="small"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            size="small"
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              borderRadius: '9999px',
              py: 1.25,
              fontWeight: 700,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
