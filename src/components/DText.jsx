import { Divider, Typography } from '@mui/material';
import React from 'react';
import PropTypes from "prop-types";
import colors from '../constants/colors';

const DText = ({ variant = 'body', color = '#444', children, weight = 'normal', textAlign = 'start', sx }) => {
    return (
        <div>
            <Typography
                variant={variant === 'heading' ? 'h4' : variant === 'subHeading' ? 'h5' : 'body1'}
                fontWeight={variant.startsWith('body') ? weight : 'bold'}
                fontSize={variant === 'body1' && '20px'}
                color={color}
                textAlign={textAlign}
                sx={sx}
            >{children}</Typography>
            {/* {variant === 'heading' && <div style={{width: '2.5rem', height: '6px', backgroundColor: colors.dColor5, borderRadius: '2px'}}/>}
            {variant === 'subHeading' && <div style={{width: '2rem', height: '4px', backgroundColor: colors.dColor5, borderRadius: '2px'}}/>} */}
        </div>

    )
}

DText.propTypes = {
    variant: PropTypes.oneOf(['heading', 'subHeading', 'body1', 'body2']),
    fontWeight: PropTypes.string,
    color: PropTypes.string,
};

export default DText
