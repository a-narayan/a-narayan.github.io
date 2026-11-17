import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import TeamMemberImage from './TeamMemberImage';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TeamMember = ({
  id,
  imageLink,
  name,
  researchArea,
  coSupervisor,
  degree,
  description,
  emailId,
  yearJoined,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      onClick={() => {
        navigate(`/team/${id}`, {
          state: {
            id,
            imageLink,
            name,
            researchArea,
            coSupervisor,
            degree,
            description,
            emailId,
            yearJoined,
          },
        });
      }}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        backgroundColor: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(29, 78, 216, 0.35)',
          boxShadow: isDark
            ? '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px -3px rgba(59, 130, 246, 0.15)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
          '& .member-arrow': {
            transform: 'translateX(3px)',
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <TeamMemberImage imageLink={imageLink} diameter="72px" alt={name} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: theme.palette.text.primary,
            }}
          >
            {name}
          </Typography>
          {degree && (
            <Chip
              label={degree}
              size="small"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '9999px',
                height: '20px',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.08)',
                color: isDark ? '#60A5FA' : '#1D4ED8',
              }}
            />
          )}
        </Box>

        {researchArea && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.86rem',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {researchArea}
          </Typography>
        )}

        {yearJoined && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              display: 'block',
              mt: 0.5,
            }}
          >
            Since {yearJoined}
          </Typography>
        )}
      </Box>

      <ArrowForwardIcon
        className="member-arrow"
        sx={{
          fontSize: '1.1rem',
          color: theme.palette.text.secondary,
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      />
    </Box>
  );
};

export default TeamMember;
