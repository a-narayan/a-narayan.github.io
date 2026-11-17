import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAlerts } from '../../../../hooks/useAlerts';
import { updateFacultyPassword } from '../../../../services/teamContentService';

const ChangeFacultyPasswordDialog = ({
  open,
  handleClose,
  facultyName = 'Dr. Apurva Narayan',
  facultyEmail = 'apurva.narayan@uwo.ca',
  facultyImage = '',
  adminUserId = '',
  onSuccess,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg('');
  };

  const handleModalClose = () => {
    if (!submitting) {
      handleResetForm();
      handleClose();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const trimmedPwd = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedPwd) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (trimmedPwd.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (trimmedPwd !== trimmedConfirm) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      await updateFacultyPassword({
        newPassword: trimmedPwd,
        email: facultyEmail,
        name: facultyName,
        currentAdminId: adminUserId,
      });

      showDialog(
        'Password Updated Successfully',
        `The login password for ${facultyName} (${facultyEmail}) has been updated. You can now use this password to sign in to the Admin Console.`,
        'OK'
      );

      handleResetForm();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error('Failed to change faculty password:', err);
      setErrorMsg(err.message || 'Failed to update password. Please try again.');
      showDialog('Error', `Failed to update password: ${err.message}`, 'OK');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          backgroundColor: isDark ? '#0F1523' : '#FFFFFF',
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: theme.palette.divider,
          boxShadow: isDark
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.1)',
              color: isDark ? '#34D399' : '#059669',
            }}
          >
            <LockResetIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.2 }}>
              Change Faculty Password
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Update Admin Console login credentials for {facultyName}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleModalClose} disabled={submitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Faculty Profile Summary Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            mb: 3,
            borderRadius: '14px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
          <Avatar
            src={facultyImage}
            alt={facultyName}
            sx={{
              width: 52,
              height: 52,
              border: '2px solid',
              borderColor: isDark ? '#34D399' : '#059669',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }} noWrap>
              {facultyName}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#34D399' : '#059669', fontWeight: 600, display: 'block' }}>
              Principal Investigator • Administrator
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} noWrap>
              Login Username: <strong>{facultyEmail}</strong>
            </Typography>
          </Box>
        </Box>

        {errorMsg && (
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              borderRadius: '10px',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <ErrorOutlineIcon fontSize="small" sx={{ color: '#EF4444' }} />
            <Typography variant="body2" sx={{ color: isDark ? '#FCA5A5' : '#DC2626', fontSize: '0.86rem' }}>
              {errorMsg}
            </Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            size="small"
            label="New Password"
            placeholder="Enter at least 6 characters"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={submitting}
            autoFocus
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            size="small"
            label="Confirm New Password"
            placeholder="Re-enter the new password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={submitting}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.2,
              borderRadius: '8px',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 16, color: isDark ? '#60A5FA' : '#2563EB' }} />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Password will be encrypted using bcrypt and saved to the Firestore authentication database.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleModalClose}
          disabled={submitting}
          sx={{ borderRadius: '8px', textTransform: 'none', color: theme.palette.text.secondary }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <LockResetIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2.5,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669, #047857)',
            },
          }}
        >
          {submitting ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeFacultyPasswordDialog;

