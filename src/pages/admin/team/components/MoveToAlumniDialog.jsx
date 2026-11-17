import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

const MoveToAlumniDialog = ({ open, handleClose, onSuccess, id, degree = '', name = '' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [alumniDegree, setAlumniDegree] = useState(degree);
  const [alumniName, setAlumniName] = useState(name);
  const [positionAfterLeaving, setPositionAfterLeaving] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAlumniDegree(degree != null ? String(degree) : '');
      setAlumniName(name != null ? String(name) : '');
      setPositionAfterLeaving('');
      setYear(new Date().getFullYear());
    }
  }, [open, degree, name]);

  const handleConfirm = async () => {
    const aName = String(alumniName || '').trim();
    const aDegree = String(alumniDegree || 'Alumnus').trim();
    const aDest = String(positionAfterLeaving || 'IDSL Lab Alumnus').trim();

    if (!aName) {
      showDialog('Validation Error', 'Please specify the alumnus name.', 'OK');
      return;
    }
    const graduationYear = Number(year) || new Date().getFullYear();

    setSubmitting(true);
    try {
      if (id) {
        await updateDoc(doc(db, 'team', id), {
          isAlumni: true,
        });
      }

      await runTransaction(db, async (transaction) => {
        const alumniDocRef = doc(db, 'alumni', graduationYear.toString());
        const sfDoc = await transaction.get(alumniDocRef);

        const newRecord = {
          degree: aDegree || 'Alumnus',
          name: aName,
          positionAfterLeaving: aDest || 'IDSL Lab Alumnus',
        };

        if (!sfDoc.exists()) {
          transaction.set(alumniDocRef, {
            year: graduationYear,
            alumnus: [newRecord],
          });
        } else {
          const currentAlumni = sfDoc.data().alumnus || [];
          transaction.update(alumniDocRef, {
            alumnus: [...currentAlumni, newRecord],
          });
        }
      });

      showDialog('Success', `${alumniName} has been successfully moved to the Alumni directory (Class of ${graduationYear}).`, 'OK');
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error marking as alumni:', err);
      showDialog('Error', `Failed to transition to alumni: ${err.message}`, 'OK');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : handleClose}
      maxWidth="sm"
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
            <SchoolOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              Move to Lab Alumni
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Transition {name || 'member'} from active researchers to alumni
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={submitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2.5, p: 2, borderRadius: '12px', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.06)' : 'rgba(37, 99, 235, 0.04)', border: '1px solid', borderColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem' }}>
            Moving this member will update their profile status to <strong>Alumni</strong> and record their graduation details in the public Alumni directory.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Alumnus Name"
              value={alumniName}
              onChange={(e) => setAlumniName(e.target.value)}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Graduation Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Degree Conferred"
              placeholder="e.g., PhD, MASc, Postdoc"
              value={alumniDegree}
              onChange={(e) => setAlumniDegree(e.target.value)}
              disabled={submitting}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Destination / Position After Leaving"
              placeholder="e.g., Software Engineer at Google, Assistant Professor at UBC"
              helperText="Organization, university, or current industry role"
              value={positionAfterLeaving}
              onChange={(e) => setPositionAfterLeaving(e.target.value)}
              disabled={submitting}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={submitting}
          sx={{ borderRadius: '8px', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SchoolOutlinedIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          }}
        >
          {submitting ? 'Moving...' : 'Confirm Move to Alumni'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveToAlumniDialog;
