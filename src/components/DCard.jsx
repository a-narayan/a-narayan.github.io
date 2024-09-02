import { Container, Typography } from '@mui/material'
import React from 'react'

const DCard = ({ imageUrl, text }) => {
    return (
        <div style={{
            boxShadow: '0 5px 20px 0 #ccc',
            borderRadius: '5px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <img src={imageUrl} style={{
                maxHeight: '300px',
                width: '100%',
                aspectRatio: '2 / 2.1',
                objectFit: 'cover'
            }} />
            <Typography fontSize={'12px'} sx={{ px: '12px', py: '1rem' }}>{text}</Typography>
        </div>
    )
}

export default DCard
