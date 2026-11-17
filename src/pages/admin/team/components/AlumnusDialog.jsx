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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { doc, getDoc, runTransaction, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

const DEGREES = ['PhD', 'Postdoc', 'MASc', 'MSc', 'MEng', 'Research Associate', 'Undergraduate', 'Visiting Scholar'];

const AlumnusDialog = ({ open, handleClose, onSuccess, isEdit = false, alumnus = null }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [name, setName] = useState('');
  const [degree, setDegree] = useState('PhD');
  const [year, setYear] = useState(new Date().getFullYear());
  const [positionAfterLeaving, setPositionAfterLeaving] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEdit && alumnus) {
        setName(alumnus.name != null ? String(alumnus.name) : '');
        setDegree(alumnus.degree != null ? String(alumnus.degree) : 'PhD');
        setYear(alumnus.year || new Date().getFullYear());
        setPositionAfterLeaving(alumnus.positionAfterLeaving != null ? String(alumnus.positionAfterLeaving) : '');
      } else {
        setName('');
        setDegree('PhD');
        setYear(new Date().getFullYear());
        setPositionAfterLeaving('');
      }
    }
  }, [open, isEdit, alumnus]);

  const handleSave = async () => {
    const aName = String(name || '').trim();
    const aDegree = String(degree || 'PhD').trim();
    const aDest = String(positionAfterLeaving || 'Alumnus').trim();

    if (!aName) {
      showDialog('Validation Error', 'Please enter the alumnus name.', 'OK');
      return;
    }
    const graduationYear = Number(year) || new Date().getFullYear();

    setSubmitting(true);
    try {
      const newRecord = {
        name: aName,
        degree: aDegree,
        positionAfterLeaving: aDest || 'Alumnus',
      };

      if (isEdit && alumnus) {
        const oldYear = Number(alumnus.year);
        if (oldYear === graduationYear) {
          // Update in same year doc
          const docRef = doc(db, 'alumni', graduationYear.toString());
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const list = [...(docSnap.data().alumnus || [])];
            const idx = list.findIndex(
              (item) => item.name === alumnus.name && item.degree === alumnus.degree
            );
            if (idx > -1) {
              list[idx] = newRecord;
            } else {
              list.push(newRecord);
            }
            await updateDoc(docRef, { alumnus: list });
          } else {
            await setDoc(docRef, { year: graduationYear, alumnus: [newRecord] });
          }
        } else {
          // Year changed: remove from old year doc, add to new year doc
          const oldDocRef = doc(db, 'alumni', oldYear.toString());
          const oldDocSnap = await getDoc(oldDocRef);
          if (oldDocSnap.exists()) {
            const oldList = (oldDocSnap.data().alumnus || []).filter(
              (item) => !(item.name === alumnus.name && item.degree === alumnus.degree)
            );
            await updateDoc(oldDocRef, { alumnus: oldList });
          }

          const newDocRef = doc(db, 'alumni', graduationYear.toString());
          const newDocSnap = await getDoc(newDocRef);
          if (newDocSnap.exists()) {
            const newList = [...(newDocSnap.data().alumnus || []), newRecord];
            await updateDoc(newDocRef, { alumnus: newList });
          } else {
            await setDoc(newDocRef, { year: graduationYear, alumnus: [newRecord] });
          }
        }
        showDialog('Updated', `Alumnus record for ${name} updated successfully.`, 'OK');
      } else {
        // Add new record
        const docRef = doc(db, 'alumni', graduationYear.toString());
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(docRef);
          if (!sfDoc.exists()) {
            transaction.set(docRef, {
              year: graduationYear,
              alumnus: [newRecord],
            });
          } else {
            const currentAlumni = sfDoc.data().alumnus || [];
            transaction.update(docRef, {
              alumnus: [...currentAlumni, newRecord],
            });
          }
        });
        showDialog('Success', `Alumnus ${name} added to Class of ${graduationYear}.`, 'OK');
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error saving alumnus record:', err);
      showDialog('Error', `Failed to save alumnus: ${err.message}`, 'OK');
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
              {isEdit ? 'Edit Alumnus Record' : 'Add Alumnus Record'}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Record graduating class details for public display
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={handleClose} disabled={submitting}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Alumnus Name"
              placeholder="e.g., Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              required
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
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="alumnus-degree-select">Degree</InputLabel>
              <Select
                labelId="alumnus-degree-select"
                label="Degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                disabled={submitting}
              >
                {DEGREES.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Destination / Current Role"
              placeholder="e.g., Senior Research Engineer at DeepMind, Assistant Professor at Western"
              helperText="Organization, institution, or industry position after leaving IDSL"
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
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Alumnus'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlumnusDialog;

