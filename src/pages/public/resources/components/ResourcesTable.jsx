import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTheme } from '@mui/material/styles';

export default function ResourcesTable({ data = [] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <TableContainer
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
      <Table sx={{ minWidth: 650 }} aria-label="resources table">
        <TableHead>
          <TableRow sx={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
            <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.88rem' }}>
              Resource Title
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.88rem' }}>
              Contributors
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.88rem' }}>
              Date
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.88rem' }}>
              Access / Download
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.title + index}
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
                {row.title}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', borderColor: theme.palette.divider }}>
                {row.authors}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', borderColor: theme.palette.divider }}>
                {row.date}
              </TableCell>
              <TableCell align="right" sx={{ borderColor: theme.palette.divider }}>
                {row.download ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
                    onClick={() => window.open(row.download, '_blank')}
                    sx={{
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      py: '3px',
                      px: '12px',
                    }}
                  >
                    Download
                  </Button>
                ) : row.link ? (
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<LaunchIcon sx={{ fontSize: '0.9rem' }} />}
                    onClick={() => window.open(row.link, '_blank')}
                    sx={{
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      py: '3px',
                      px: '12px',
                    }}
                  >
                    Open Link
                  </Button>
                ) : (
                  <span style={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}>—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
