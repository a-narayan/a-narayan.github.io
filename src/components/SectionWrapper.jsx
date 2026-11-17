import { Container, Divider, Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

const SectionWrapper = ({
  id,
  maxWidth = 'xl',
  showBottomLine = true,
  children,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box id={id} component="section" sx={{ width: '100%', py: { xs: 3, md: 4.5 }, ...sx }}>
      <Container maxWidth={maxWidth}>
        {children}
        {showBottomLine && (
          <Divider
            sx={{
              mt: { xs: 4, md: 5 },
              borderColor: theme.palette.divider,
            }}
          />
        )}
      </Container>
    </Box>
  );
};

export default SectionWrapper;
