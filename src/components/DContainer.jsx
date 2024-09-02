import { Container } from '@mui/material'
import React from 'react'

const DContainer = ({ children, maxWidth = 'xl', flexDirection = 'column', justifyContent = 'start', alignItems = 'start', }) => {
    return (
        <Container maxWidth={maxWidth} sx={{ display: 'flex', flexDirection, justifyContent, alignItems, }}>
            {children}
        </Container>
    )
}

export default DContainer
