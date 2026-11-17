import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AlumnusDialog from './AlumnusDialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

const AdminAlumniManager = ({ alumni = [], onRefresh }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const showDialog = useAlerts('dialog');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [alumnusDialogOpen, setAlumnusDialogOpen] = useState(false);
  const [editingAlumnus, setEditingAlumnus] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alumnusToDelete, setAlumnusToDelete] = useState(null);

  // Group alumni by year
  const groupedAlumni = useMemo(() => {
    if (!alumni || alumni.length === 0) return {};
    const groups = {};
    alumni.forEach((item) => {
      const year = item.year || 'Other';
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(item);
    });
    return groups;
  }, [alumni]);

  const years = useMemo(() => {
    const list = Object.keys(groupedAlumni);
    return list.sort((a, b) => Number(b) - Number(a));
  }, [groupedAlumni]);

  // Filtered alumni
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const result = {};

    years.forEach((yr) => {
      if (selectedYear !== 'All' && selectedYear !== yr.toString()) {
        return;
      }
      const list = (groupedAlumni[yr] || []).filter((item) => {
        if (!q) return true;
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const degreeMatch = (item.degree || '').toLowerCase().includes(q);
        const destMatch = (item.positionAfterLeaving || '').toLowerCase().includes(q);
        return nameMatch || degreeMatch || destMatch;
      });

      if (list.length > 0) {
        result[yr] = list;
      }
    });

    return result;
  }, [groupedAlumni, years, selectedYear, searchQuery]);

  const handleEditClick = (item) => {
    setEditingAlumnus(item);
    setAlumnusDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setAlumnusToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!alumnusToDelete) return;
    try {
      const docRef = doc(db, 'alumni', alumnusToDelete.year.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const list = (docSnap.data().alumnus || []).filter(
          (item) => !(item.name === alumnusToDelete.name && item.degree === alumnusToDelete.degree)
        );
        await updateDoc(docRef, { alumnus: list });
        showDialog('Removed', `${alumnusToDelete.name} has been removed from the alumni directory.`, 'OK');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Error removing alumnus:', err);
      showDialog('Error', `Failed to remove alumnus record: ${err.message}`, 'OK');
    } finally {
      setDeleteDialogOpen(false);
      setAlumnusToDelete(null);
    }
  };

  return (
    <Box>
      {/* Search & Actions Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, maxWidth: { md: 500 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search alumni by name, degree, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: isDark ? 'rgba(15, 21, 35, 0.6)' : '#FFFFFF',
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => {
            setEditingAlumnus(null);
            setAlumnusDialogOpen(true);
          }}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2.5,
            py: 1,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          Add Alumnus Record
        </Button>
      </Box>

      {/* Year Filter Chips */}
      {years.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip
            label={`All Years (${alumni.length})`}
            onClick={() => setSelectedYear('All')}
            color={selectedYear === 'All' ? 'primary' : 'default'}
            variant={selectedYear === 'All' ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700, borderRadius: '9999px', fontSize: '0.8rem' }}
          />
          {years.map((yr) => (
            <Chip
              key={yr}
              label={`Class of ${yr} (${groupedAlumni[yr]?.length || 0})`}
              onClick={() => setSelectedYear(yr.toString())}
              color={selectedYear === yr.toString() ? 'primary' : 'default'}
              variant={selectedYear === yr.toString() ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600, borderRadius: '9999px', fontSize: '0.8rem' }}
            />
          ))}
        </Box>
      )}

      {/* Alumni Tables by Graduating Class */}
      {Object.keys(filteredGroups).length === 0 ? (
        <Card
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '16px',
            backgroundColor: isDark ? 'rgba(15, 21, 35, 0.5)' : '#FFFFFF',
            border: '1px dashed',
            borderColor: theme.palette.divider,
          }}
        >
          <SchoolOutlinedIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1.5, opacity: 0.6 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            No Alumni Records Found
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            {searchQuery
              ? `No alumni match "${searchQuery}". Try clearing the search query.`
              : 'No alumni recorded in the database yet. Click "Add Alumnus Record" to add past lab scholars.'}
          </Typography>
          {searchQuery && (
            <Button variant="outlined" size="small" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {Object.keys(filteredGroups).map((year) => {
            const list = filteredGroups[year] || [];
            return (
              <TableContainer
                key={year}
                component={Paper}
                sx={{
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  overflow: 'hidden',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 15px rgba(0,0,0,0.04)',
                }}
              >
                {/* Header for this class */}
                <Box
                  sx={{
                    px: 3,
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
                    <Chip
                      label={`Class of ${year}`}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        borderRadius: '9999px',
                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(29, 78, 216, 0.12)',
                        color: isDark ? '#93C5FD' : '#1D4ED8',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                      {list.length} {list.length === 1 ? 'Scholar' : 'Scholars'}
                    </Typography>
                  </Box>
                </Box>

                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
                      <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Alumnus Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Degree
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Destination / Current Role
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item, index) => (
                      <TableRow
                        key={`${item.name}-${index}`}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.015)',
                          },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 34,
                                height: 34,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                                color: isDark ? '#60A5FA' : '#1D4ED8',
                              }}
                            >
                              {(item.name || 'A').charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.degree || 'Alumnus'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              borderRadius: '9999px',
                              backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                              color: isDark ? '#C084FC' : '#7C3AED',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessCenterOutlinedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              {item.positionAfterLeaving || '—'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="Edit Record">
                              <IconButton size="small" onClick={() => handleEditClick(item)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Record">
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(item)}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          })}
        </Box>
      )}

      {/* Add / Edit Dialog */}
      {alumnusDialogOpen && (
        <AlumnusDialog
          open={alumnusDialogOpen}
          handleClose={() => setAlumnusDialogOpen(false)}
          onSuccess={onRefresh}
          isEdit={Boolean(editingAlumnus)}
          alumnus={editingAlumnus}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
            Delete Alumnus Record?
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to remove <strong>{alumnusToDelete?.name}</strong> (Class of {alumnusToDelete?.year}) from the alumni directory?
          </Typography>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleConfirmDelete}
            startIcon={<DeleteOutlineIcon />}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAlumniManager;

