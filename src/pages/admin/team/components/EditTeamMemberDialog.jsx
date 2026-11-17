import React, { useEffect, useState } from 'react';
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
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';
import { hashPassword } from '../../../../utils/encryptionUtils';

const DEGREES = ['PhD', 'Postdoc', 'Research Associate', 'MASc', 'MSc', 'MEng', 'Undergraduate', 'Visiting Scholar'];

const EditTeamMemberDialog = ({
  dialogOpen,
  handleDialogClose,
  onSuccess,
  isEdit = false,
  id = '',
  imageLink = '',
  name = '',
  researchArea = '',
  coSupervisor = '',
  degree = '',
  description = '',
  emailId = '',
  yearJoined = '',
  currentPassword = '',
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [memberImageLink, setMemberImageLink] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberResearchArea, setMemberResearchArea] = useState('');
  const [memberCoSupervisor, setMemberCoSupervisor] = useState('');
  const [memberDegree, setMemberDegree] = useState('PhD');
  const [memberDescription, setMemberDescription] = useState('');
  const [memberEmailId, setMemberEmailId] = useState('');
  const [memberYearJoined, setMemberYearJoined] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (dialogOpen) {
      if (isEdit) {
        setMemberImageLink(imageLink != null ? String(imageLink) : '');
        setMemberName(name != null ? String(name) : '');
        setMemberResearchArea(researchArea != null ? String(researchArea) : '');
        setMemberCoSupervisor(coSupervisor != null ? String(coSupervisor) : '');
        setMemberDegree(degree != null ? String(degree) : 'PhD');
        setMemberDescription(description != null ? String(description) : '');
        setMemberEmailId(emailId != null ? String(emailId) : '');
        setMemberYearJoined(yearJoined != null ? String(yearJoined) : '');
        setPassword('');
      } else {
        setMemberImageLink('');
        setMemberName('');
        setMemberResearchArea('');
        setMemberCoSupervisor('');
        setMemberDegree('PhD');
        setMemberDescription('');
        setMemberEmailId('');
        setMemberYearJoined(new Date().getFullYear().toString());
        setPassword('');
      }
    }
  }, [dialogOpen, isEdit, id, imageLink, name, researchArea, coSupervisor, degree, description, emailId, yearJoined]);

  const handleSave = async () => {
    const email = String(memberEmailId || '').trim();
    const memName = String(memberName || '').trim();
    const memDegree = String(memberDegree || 'PhD').trim();
    const pwd = String(password || '').trim();
    const imgLink = String(memberImageLink || '').trim();
    const rArea = String(memberResearchArea || '').trim();
    const coSup = String(memberCoSupervisor || '').trim();
    const desc = String(memberDescription || '').trim();
    const yrJoined = String(memberYearJoined || '').trim();

    if (!email) {
      showDialog('Validation Error', 'Email ID is required.', 'OK');
      return;
    }
    if (!memName) {
      showDialog('Validation Error', 'Member name is required.', 'OK');
      return;
    }
    if (!memDegree) {
      showDialog('Validation Error', 'Please select a degree level.', 'OK');
      return;
    }
    if (!isEdit && !pwd) {
      showDialog('Validation Error', 'Password is required to create a new student account.', 'OK');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const updatePayload = {
          imageUrl: imgLink,
          name: memName,
          researchArea: rArea,
          coSupervisor: coSup,
          degree: memDegree,
          description: desc,
          emailId: email,
          yearJoined: yrJoined,
          userType: 'student',
        };

        if (pwd.length > 0) {
          updatePayload.password = await hashPassword(pwd);
        } else if (currentPassword) {
          updatePayload.password = currentPassword;
        }

        await updateDoc(doc(db, 'team', id), updatePayload);
        showDialog('Updated', `Details for ${memName} updated successfully.`, 'OK');
      } else {
        const encryptedPassword = await hashPassword(pwd);
        await addDoc(collection(db, 'team'), {
          imageUrl: imgLink,
          name: memName,
          researchArea: rArea,
          coSupervisor: coSup,
          degree: memDegree,
          description: desc,
          emailId: email,
          yearJoined: yrJoined,
          password: encryptedPassword,
          userType: 'student',
          isAlumni: false,
        });
        showDialog('Created', `New member ${memName} has been added successfully.`, 'OK');
      }

      if (onSuccess) onSuccess();
      handleDialogClose();
    } catch (err) {
      console.error('Error saving team member:', err);
      showDialog('Error', `Failed to save member details: ${err.message}`, 'OK');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={submitting ? undefined : handleDialogClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: isDark ? '#0F1523' : '#FFFFFF',
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: theme.palette.divider,
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
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.08)',
              color: isDark ? '#60A5FA' : '#1D4ED8',
            }}
          >
            {isEdit ? <EditOutlinedIcon /> : <PersonAddOutlinedIcon />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>
              {isEdit ? `Edit Member: ${name || 'Details'}` : 'Add New Lab Member'}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {isEdit ? 'Update profile, research details, or credentials' : 'Create an active student/researcher account'}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleDialogClose} disabled={submitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Top Header Card with Avatar Preview */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            p: 2,
            mb: 3,
            borderRadius: '12px',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: theme.palette.divider,
          }}
        >
          <Avatar
            src={memberImageLink}
            alt={memberName}
            sx={{
              width: 64,
              height: 64,
              border: '2px solid',
              borderColor: isDark ? '#3B82F6' : '#2563EB',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }} noWrap>
              {memberName || 'Member Name'}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#60A5FA' : '#1D4ED8', fontWeight: 600, display: 'block' }}>
              {memberDegree} {memberYearJoined ? `• Joined ${memberYearJoined}` : ''}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} noWrap>
              {memberEmailId || 'Enter email below for dashboard login'}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          {/* Identity & Contact */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              placeholder="e.g., Alex Chen"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              disabled={submitting}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="team-member-degree-label">Degree / Role</InputLabel>
              <Select
                labelId="team-member-degree-label"
                label="Degree / Role"
                value={memberDegree}
                onChange={(e) => setMemberDegree(e.target.value)}
                disabled={submitting}
              >
                {DEGREES.map((deg) => (
                  <MenuItem key={deg} value={deg}>
                    {deg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Email ID (Login Username)"
              placeholder="e.g., alex.chen@uwo.ca"
              type="email"
              value={memberEmailId}
              onChange={(e) => setMemberEmailId(e.target.value)}
              disabled={submitting}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required={!isEdit}
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
          </Grid>

          {/* Research & Lab Details */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Research Area"
              placeholder="e.g., Safety & Verification of Autonomous Cyber-Physical Systems"
              value={memberResearchArea}
              onChange={(e) => setMemberResearchArea(e.target.value)}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Year Joined"
              placeholder="e.g., 2023"
              value={memberYearJoined}
              onChange={(e) => setMemberYearJoined(e.target.value)}
              disabled={submitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Co-Supervisor(s)"
              placeholder="e.g., Dr. Jane Smith"
              helperText="Optional co-supervisor or academic advisor"
              value={memberCoSupervisor}
              onChange={(e) => setMemberCoSupervisor(e.target.value)}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Profile Image URL"
              placeholder="https://..."
              helperText="Direct image URL for member avatar photo"
              value={memberImageLink}
              onChange={(e) => setMemberImageLink(e.target.value)}
              disabled={submitting}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Bio / Research Summary"
              placeholder="Brief summary of research focus, prior degrees, or ongoing projects..."
              value={memberDescription}
              onChange={(e) => setMemberDescription(e.target.value)}
              disabled={submitting}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleDialogClose}
          disabled={submitting}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          }}
        >
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeamMemberDialog;
