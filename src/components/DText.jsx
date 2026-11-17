import { Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const DText = ({
  variant = 'body',
  color,
  children,
  weight = 'normal',
  textAlign = 'start',
  sx = {},
}) => {
  const theme = useTheme();

  // Determine variant mapping
  let muiVariant = 'body1';
  let defaultWeight = weight;
  let defaultColor = theme.palette.text.primary;

  if (variant === 'heading') {
    muiVariant = 'h3';
    defaultWeight = 'bold';
  } else if (variant === 'subHeading') {
    muiVariant = 'h4';
    defaultWeight = 'bold';
  } else if (variant === 'body1') {
    muiVariant = 'body1';
    defaultWeight = weight;
  } else if (variant === 'body2') {
    muiVariant = 'body2';
    defaultWeight = weight;
    defaultColor = theme.palette.text.secondary;
  }

  // If user explicitly passed a color string that isn't the old legacy '#444'
  const resolvedColor = color && color !== '#444' ? color : defaultColor;

  return (
    <Typography
      variant={muiVariant}
      fontWeight={defaultWeight}
      color={resolvedColor}
      textAlign={textAlign}
      sx={{
        letterSpacing: variant.includes('Heading') ? '-0.02em' : 'inherit',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

DText.propTypes = {
  variant: PropTypes.string,
  weight: PropTypes.string,
  color: PropTypes.string,
  textAlign: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default DText;
