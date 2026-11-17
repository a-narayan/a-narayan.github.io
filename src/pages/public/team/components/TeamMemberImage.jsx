import React from 'react';
import { Box } from '@mui/material';

const TeamMemberImage = ({ imageLink, diameter = '80px', alt = 'Team member' }) => {
  const fallback = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
  const src = imageLink && imageLink.trim().length > 0 ? imageLink : fallback;

  return (
    <Box
      sx={{
        width: diameter,
        height: diameter,
        minWidth: diameter,
        minHeight: diameter,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(59, 130, 246, 0.25)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        transition: 'all 0.25s ease',
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default TeamMemberImage;
