import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

export default function AlumniTable({ data = [] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Group alumni by year
  const groupedAlumni = React.useMemo(() => {
    if (!data || data.length === 0) return {};
    const groups = {};
    data.forEach((alumnus) => {
      const year = alumnus.year || 'Alumni';
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(alumnus);
    });
    return groups;
  }, [data]);

  const years = Object.keys(groupedAlumni);

  if (years.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        No alumni records available.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {years.map((year) => (
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
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 4px 15px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Year Header Banner */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(29, 78, 216, 0.05)',
              borderBottom: '1px solid',
              borderColor: theme.palette.divider,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Chip
              label={year}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.82rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(29, 78, 216, 0.12)',
                color: isDark ? '#93C5FD' : '#1D4ED8',
              }}
            />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
              Graduating Class of {year}
            </Typography>
          </Box>

          <Table sx={{ minWidth: 600 }} aria-label={`Alumni ${year}`}>
            <TableHead>
              <TableRow sx={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                  Degree
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                  Destination / Current Position
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedAlumni[year].map((row, idx) => (
                <TableRow
                  key={row.name + idx}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                    },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: 600,
                      color: isDark ? '#60A5FA' : '#1D4ED8',
                      fontSize: '0.92rem',
                      borderColor: theme.palette.divider,
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', borderColor: theme.palette.divider }}>
                    {row.degree}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontSize: '0.88rem', fontWeight: 500, borderColor: theme.palette.divider }}>
                    {row.positionAfterLeaving || row.currentPosition || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}
