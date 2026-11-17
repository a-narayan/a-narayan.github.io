import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditTeamMemberDialog from './EditTeamMemberDialog';
import MoveToAlumniDialog from './MoveToAlumniDialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

// Color map for degree levels
const DEGREE_CONFIG = {
  'PhD': { label: 'PhD', colorLight: '#1D4ED8', colorDark: '#60A5FA', bgLight: 'rgba(37, 99, 235, 0.1)', bgDark: 'rgba(96, 165, 250, 0.15)' },
  'Postdoc': { label: 'Postdoc', colorLight: '#059669', colorDark: '#34D399', bgLight: 'rgba(5, 150, 105, 0.1)', bgDark: 'rgba(52, 211, 153, 0.15)' },
  'Research Associate': { label: 'Research Associate', colorLight: '#0D9488', colorDark: '#2DD4BF', bgLight: 'rgba(13, 148, 136, 0.1)', bgDark: 'rgba(45, 212, 191, 0.15)' },
  'MASc': { label: 'MASc', colorLight: '#7C3AED', colorDark: '#A78BFA', bgLight: 'rgba(124, 58, 237, 0.1)', bgDark: 'rgba(167, 139, 250, 0.15)' },
  'MSc': { label: 'MSc', colorLight: '#9333EA', colorDark: '#C084FC', bgLight: 'rgba(147, 51, 234, 0.1)', bgDark: 'rgba(192, 132, 252, 0.15)' },
  'MEng': { label: 'MEng', colorLight: '#D97706', colorDark: '#FBBF24', bgLight: 'rgba(217, 119, 6, 0.1)', bgDark: 'rgba(251, 191, 36, 0.15)' },
  'Undergraduate': { label: 'Undergraduate', colorLight: '#E11D48', colorDark: '#FB7185', bgLight: 'rgba(225, 29, 72, 0.1)', bgDark: 'rgba(251, 113, 133, 0.15)' },
};

const AdminTeamMember = ({
  id,
  imageLink,
  name,
  researchArea,
  coSupervisor,
  degree,
  description,
  emailId,
  yearJoined,
  password,
  onRefresh,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [alumniDialogOpen, setAlumniDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const degreeTheme = DEGREE_CONFIG[degree] || {
    label: degree || 'Member',
    colorLight: '#4B5563',
    colorDark: '#9CA3AF',
    bgLight: 'rgba(107, 114, 128, 0.1)',
    bgDark: 'rgba(156, 163, 175, 0.15)',
  };

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    if (emailId) {
      navigator.clipboard.writeText(emailId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveStudent = async () => {
    try {
      await deleteDoc(doc(db, 'team', id));
      showDialog('Removed', `${name} has been removed from the active team.`, 'OK');
      setRemoveDialogOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error removing student:', err);
      showDialog('Error', `Failed to remove student: ${err.message}`, 'OK');
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: theme.palette.divider,
          transition: 'all 0.25s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.3)',
            boxShadow: isDark
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              : '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
          {/* Top Identity Row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              src={imageLink}
              alt={name}
              sx={{
                width: 60,
                height: 60,
                borderRadius: '14px',
                border: '2px solid',
                borderColor: isDark ? '#3B82F6' : '#2563EB',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: theme.palette.text.primary,
                    lineHeight: 1.3,
                  }}
                  noWrap
                >
                  {name}
                </Typography>
                <Tooltip title="View Public Profile">
                  <IconButton
                    size="small"
                    component="a"
                    href={`/team/${id}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': { color: theme.palette.primary.main },
                    }}
                  >
                    <LaunchIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={degreeTheme.label}
                  size="small"
                  sx={{
                    height: '22px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    backgroundColor: isDark ? degreeTheme.bgDark : degreeTheme.bgLight,
                    color: isDark ? degreeTheme.colorDark : degreeTheme.colorLight,
                  }}
                />
                {yearJoined && (
                  <Chip
                    label={`Joined ${yearJoined}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: '22px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.secondary,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5, opacity: 0.6 }} />

          {/* Details & Metadata */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {emailId && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlinedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography
                  variant="caption"
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                  noWrap
                >
                  {emailId}
                </Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy email'}>
                  <IconButton size="small" onClick={handleCopyEmail} sx={{ p: 0.5 }}>
                    <ContentCopyIcon sx={{ fontSize: 13, color: copied ? '#10B981' : theme.palette.text.secondary }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {researchArea && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <ScienceOutlinedIcon sx={{ fontSize: 16, color: isDark ? '#60A5FA' : '#2563EB', mt: 0.3 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.82rem',
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4,
                  }}
                >
                  {researchArea}
                </Typography>
              </Box>
            )}

            {coSupervisor && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SupervisorAccountOutlinedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }} noWrap>
                  Co-supervised by: <strong>{coSupervisor}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        <Divider />

        {/* Action Controls */}
        <CardActions
          sx={{
            px: 2,
            py: 1.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.015)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlinedIcon fontSize="small" />}
              onClick={() => setEditDialogOpen(true)}
              sx={{
                borderRadius: '8px',
                fontSize: '0.78rem',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Edit
            </Button>
            <Tooltip title="Mark graduated & transfer to Alumni directory">
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<SchoolOutlinedIcon fontSize="small" />}
                onClick={() => setAlumniDialogOpen(true)}
                sx={{
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                To Alumni
              </Button>
            </Tooltip>
          </Box>

          <Tooltip title="Remove student from lab">
            <IconButton
              size="small"
              color="error"
              onClick={() => setRemoveDialogOpen(true)}
              sx={{
                borderRadius: '8px',
                '&:hover': { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)' },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      {/* Edit Dialog */}
      {editDialogOpen && (
        <EditTeamMemberDialog
          dialogOpen={editDialogOpen}
          handleDialogClose={() => setEditDialogOpen(false)}
          onSuccess={onRefresh}
          isEdit={true}
          id={id}
          imageLink={imageLink}
          name={name}
          researchArea={researchArea}
          coSupervisor={coSupervisor}
          degree={degree}
          description={description}
          emailId={emailId}
          yearJoined={yearJoined}
          currentPassword={password}
        />
      )}

      {/* Move To Alumni Dialog */}
      {alumniDialogOpen && (
        <MoveToAlumniDialog
          open={alumniDialogOpen}
          handleClose={() => setAlumniDialogOpen(false)}
          onSuccess={onRefresh}
          id={id}
          degree={degree}
          name={name}
        />
      )}

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        maxWidth="xs"
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
        <DialogTitle sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            Remove Lab Member?
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to remove <strong>{name}</strong> from the active team? This action permanently removes their member record.
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setRemoveDialogOpen(false)}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleRemoveStudent}
            startIcon={<DeleteOutlineIcon />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
          >
            Yes, Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminTeamMember;
