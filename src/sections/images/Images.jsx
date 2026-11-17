import { Grid, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const Images = ({ links = [] }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div>
      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {links.map((link, index) => (
          <Grid item key={link + index} style={{ position: 'relative' }}>
            <img
              src={link}
              alt={`Lab display item ${index + 1}`}
              style={{
                width: isSmall ? '10rem' : '20rem',
                height: isSmall ? '10rem' : '20rem',
                objectFit: 'cover',
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Images;
