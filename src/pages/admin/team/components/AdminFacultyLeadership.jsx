import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InfoBanner from '../../../../components/InfoBanner';
import { useAlerts } from '../../../../hooks/useAlerts';
import {
  DEFAULT_FACULTY_CONTENT,
  getFacultyContent,
  saveFacultyContent,
  updateFacultyPassword,
} from '../../../../services/teamContentService';
import ChangeFacultyPasswordDialog from './ChangeFacultyPasswordDialog';

const AdminFacultyLeadership = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');
  const params = useParams();
  const userData = useSelector((state) => state.user.value);
  const currentAdminId = params?.userId || userData?.id || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faculty, setFaculty] = useState(DEFAULT_FACULTY_CONTENT);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // Inline Password States
  const [inlinePassword, setInlinePassword] = useState('');
  const [inlineConfirmPassword, setInlineConfirmPassword] = useState('');
  const [showInlinePassword, setShowInlinePassword] = useState(false);
  const [showInlineConfirm, setShowInlineConfirm] = useState(false);
  const [updatingInlinePassword, setUpdatingInlinePassword] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getFacultyContent().then((data) => {
      if (isMounted && data) {
        setFaculty(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFaculty((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAffiliationChange = (index, field, value) => {
    setFaculty((prev) => {
      const list = [...(prev.affiliations || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, affiliations: list };
    });
  };

  const handleAddAffiliation = () => {
    setFaculty((prev) => ({
      ...prev,
      affiliations: [...(prev.affiliations || []), { label: 'New Institution', sub: 'Department' }],
    }));
  };

  const handleRemoveAffiliation = (index) => {
    setFaculty((prev) => ({
      ...prev,
      affiliations: (prev.affiliations || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateInlinePassword = async () => {
    const pwd = inlinePassword.trim();
    const confirmPwd = inlineConfirmPassword.trim();
    if (!pwd) {
      showDialog('Validation Error', 'Please enter a new password.', 'OK');
      return;
    }
    if (pwd.length < 6) {
      showDialog('Validation Error', 'Password must be at least 6 characters long.', 'OK');
      return;
    }
    if (pwd !== confirmPwd) {
      showDialog('Validation Error', 'Passwords do not match. Please re-enter.', 'OK');
      return;
    }

    setUpdatingInlinePassword(true);
    try {
      await updateFacultyPassword({
        newPassword: pwd,
        email: faculty.email,
        name: faculty.directorName,
        currentAdminId,
      });
      showDialog(
        'Password Updated Successfully',
        `Login password for ${faculty.directorName || 'Dr. Apurva Narayan'} (${faculty.email}) has been updated.`,
        'OK'
      );
      setInlinePassword('');
      setInlineConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      showDialog('Error', `Failed to update password: ${err.message}`, 'OK');
    } finally {
      setUpdatingInlinePassword(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If an inline password was entered, update password as well
      if (inlinePassword.trim().length > 0) {
        if (inlinePassword.trim().length < 6) {
          showDialog('Validation Error', 'New password must be at least 6 characters long.', 'OK');
          setSaving(false);
          return;
        }
        if (inlinePassword.trim() !== inlineConfirmPassword.trim()) {
          showDialog('Validation Error', 'Passwords do not match. Please ensure both password fields match.', 'OK');
          setSaving(false);
          return;
        }
        await updateFacultyPassword({
          newPassword: inlinePassword.trim(),
          email: faculty.email,
          name: faculty.directorName,
          currentAdminId,
        });
        setInlinePassword('');
        setInlineConfirmPassword('');
      }

      await saveFacultyContent(faculty);
      showDialog(
        'Saved Successfully',
        'Faculty and Principal Investigator profile has been saved to Firestore and synchronized with the Home page!',
        'OK'
      );
    } catch (err) {
      console.error('Error saving faculty content:', err);
      showDialog('Error', `Failed to save faculty profile: ${err.message}`, 'OK');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset faculty and PI profile back to default IDSL lab information?')) {
      setFaculty(DEFAULT_FACULTY_CONTENT);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Header & Save Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem', color: theme.palette.text.primary }}>
            Faculty & Principal Investigator Content
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Edit Dr. Apurva Narayan's leadership profile and manage admin account credentials.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<LockResetIcon />}
            onClick={() => setPasswordDialogOpen(true)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              color: isDark ? '#34D399' : '#059669',
              borderColor: isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(5, 150, 105, 0.4)',
              '&:hover': {
                borderColor: isDark ? '#34D399' : '#059669',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.05)',
              },
            }}
          >
            Change Password
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleResetDefaults}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Reset Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            }}
          >
            {saving ? 'Saving...' : 'Save to Firestore'}
          </Button>
        </Box>
      </Box>

      {/* Faculty Member Roster & Credentials Card */}
      <Card
        sx={{
          p: 2.5,
          mb: 3.5,
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(15, 21, 35, 0.85)' : '#FFFFFF',
          border: '1px solid',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)',
          boxShadow: isDark
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
            : '0 10px 25px -5px rgba(37, 99, 235, 0.06)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              src={faculty.directorImage || DEFAULT_FACULTY_CONTENT.directorImage}
              alt={faculty.directorName || 'Dr. Apurva Narayan'}
              sx={{
                width: 64,
                height: 64,
                border: '2px solid',
                borderColor: isDark ? '#3B82F6' : '#2563EB',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 36 }} />
            </Avatar>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.15rem', color: theme.palette.text.primary }}>
                  {faculty.directorName || 'Dr. Apurva Narayan'}
                </Typography>
                <Chip
                  label="Principal Investigator"
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    borderRadius: '9999px',
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.1)',
                    color: isDark ? '#60A5FA' : '#1D4ED8',
                  }}
                />
                <Chip
                  label="Admin Account"
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    borderRadius: '9999px',
                    borderColor: isDark ? '#10B981' : '#059669',
                    color: isDark ? '#34D399' : '#059669',
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem' }}>
                {faculty.directorTitle || 'Principal Investigator & Lab Director'} •{' '}
                <strong style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>{faculty.email || 'apurva.narayan@uwo.ca'}</strong>
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<LockResetIcon />}
            onClick={() => setPasswordDialogOpen(true)}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669, #047857)',
              },
            }}
          >
            Change Password
          </Button>
        </Box>
      </Card>

      <Grid container spacing={3.5}>
        {/* Editor Form Column */}
        <Grid item xs={12} lg={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Identity & Basic Info */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <PersonOutlineIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Principal Investigator Identity & Titles
                </Typography>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Director / PI Full Name"
                      value={faculty.directorName || ''}
                      onChange={(e) => handleChange('directorName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Director Title / Role Chip"
                      value={faculty.directorTitle || ''}
                      onChange={(e) => handleChange('directorTitle', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Eyebrow Badge"
                      value={faculty.eyebrow || ''}
                      onChange={(e) => handleChange('eyebrow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Section Title"
                      value={faculty.sectionTitle || ''}
                      onChange={(e) => handleChange('sectionTitle', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Profile Photo URL"
                      helperText="Direct image URL for the circular photo"
                      value={faculty.directorImage || ''}
                      onChange={(e) => handleChange('directorImage', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Account Security & Password Card */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.25)',
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LockOutlinedIcon sx={{ color: isDark ? '#34D399' : '#059669' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Account Security & Login Password
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Admin console credentials for {faculty.directorName || 'Dr. Apurva Narayan'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Admin Login Username / Email"
                      value={faculty.email || 'apurva.narayan@uwo.ca'}
                      disabled
                      helperText="Username used to authenticate with IDSL Admin Console"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="New Password"
                      placeholder="Leave blank to keep current"
                      type={showInlinePassword ? 'text' : 'password'}
                      value={inlinePassword}
                      onChange={(e) => setInlinePassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowInlinePassword(!showInlinePassword)}
                              edge="end"
                            >
                              {showInlinePassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Confirm New Password"
                      placeholder="Re-enter new password"
                      type={showInlineConfirm ? 'text' : 'password'}
                      value={inlineConfirmPassword}
                      onChange={(e) => setInlineConfirmPassword(e.target.value)}
                      disabled={!inlinePassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowInlineConfirm(!showInlineConfirm)}
                              edge="end"
                            >
                              {showInlineConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {inlinePassword && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={updatingInlinePassword}
                          onClick={handleUpdateInlinePassword}
                          startIcon={updatingInlinePassword ? <CircularProgress size={14} color="inherit" /> : <LockResetIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                          }}
                        >
                          {updatingInlinePassword ? 'Updating...' : 'Update Password Only'}
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Academic Affiliations */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BusinessOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Academic Affiliations ({faculty.affiliations?.length || 0})
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddAffiliation}
                  sx={{ borderRadius: '8px', textTransform: 'none', fontSize: '0.75rem' }}
                >
                  Add Affiliation
                </Button>
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {(faculty.affiliations || []).map((aff, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <TextField
                        size="small"
                        label="Institution Name"
                        placeholder="e.g., Western University"
                        value={aff.label || ''}
                        onChange={(e) => handleAffiliationChange(idx, 'label', e.target.value)}
                        sx={{ flex: 1.2 }}
                      />
                      <TextField
                        size="small"
                        label="Department / Subtext"
                        placeholder="e.g., CS & ECE"
                        value={aff.sub || ''}
                        onChange={(e) => handleAffiliationChange(idx, 'sub', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <Tooltip title="Remove affiliation">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveAffiliation(idx)}
                          disabled={faculty.affiliations.length <= 1}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Biography */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <DescriptionOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Director Biography & Research Vision
                </Typography>
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  size="small"
                  label="Biography"
                  value={faculty.directorBio || ''}
                  onChange={(e) => handleChange('directorBio', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Profile Links & Contact */}
            <Card
              sx={{
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                border: '1px solid',
                borderColor: theme.palette.divider,
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.04)',
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                }}
              >
                <LinkOutlinedIcon sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Contact, Social & Directory Links
                </Typography>
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Contact Email"
                      value={faculty.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="LinkedIn Profile URL"
                      value={faculty.linkedin || ''}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Google Scholar URL"
                      value={faculty.googleScholar || ''}
                      onChange={(e) => handleChange('googleScholar', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Faculty Directory URL"
                      value={faculty.facultyDirectory || ''}
                      onChange={(e) => handleChange('facultyDirectory', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Live Public Preview Column */}
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              border: '1px solid',
              borderColor: theme.palette.divider,
              position: 'sticky',
              top: 24,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <VisibilityOutlinedIcon fontSize="small" sx={{ color: isDark ? '#60A5FA' : '#2563EB' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Live Public Preview (As Seen on Team & Home Pages)
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
              {/* Circular Photo with Gradient Ring */}
              <Box
                sx={{
                  position: 'relative',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  p: '4px',
                  background: isDark
                    ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
                    : 'linear-gradient(135deg, #1D4ED8 0%, #0284C7 100%)',
                  boxShadow: isDark
                    ? '0 0 30px -5px rgba(59, 130, 246, 0.4)'
                    : '0 10px 25px -5px rgba(29, 78, 216, 0.25)',
                }}
              >
                <Box
                  component="img"
                  src={faculty.directorImage || DEFAULT_FACULTY_CONTENT.directorImage}
                  alt={faculty.directorName || 'Dr. Apurva Narayan'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: isDark ? '#0F1523' : '#FFFFFF',
                  }}
                />
              </Box>

              {/* InfoBanner */}
              <Box sx={{ width: '100%' }}>
                <InfoBanner
                  directorName={faculty.directorName}
                  directorTitle={faculty.directorTitle}
                  directorBio={faculty.directorBio}
                  affiliations={faculty.affiliations}
                  email={faculty.email}
                  linkedin={faculty.linkedin}
                  googleScholar={faculty.googleScholar}
                  facultyDirectory={faculty.facultyDirectory}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      {passwordDialogOpen && (
        <ChangeFacultyPasswordDialog
          open={passwordDialogOpen}
          handleClose={() => setPasswordDialogOpen(false)}
          facultyName={faculty.directorName || 'Dr. Apurva Narayan'}
          facultyEmail={faculty.email || 'apurva.narayan@uwo.ca'}
          facultyImage={faculty.directorImage || DEFAULT_FACULTY_CONTENT.directorImage}
          adminUserId={currentAdminId}
        />
      )}
    </Box>
  );
};

export default AdminFacultyLeadership;
