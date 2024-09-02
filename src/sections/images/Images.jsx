import { Grid, IconButton, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'

const Images = ({ links }) => {

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {
                    links.map(link =>
                        <Grid item style={{ position: 'relative' }}>
                            <img src={link} style={{ width: isSmall ? '10rem' : '20rem', height: isSmall ? '10rem' : '20rem', objectFit: 'cover', borderRadius: '5px' }} />
                        </Grid>
                    )
                }
            </Grid>
        </div>
    )
}

export default Images
