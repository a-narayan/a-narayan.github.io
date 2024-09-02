import { Container, Divider } from '@mui/material'
import React from 'react'
import SizedBox from './SizedBox'

const SectionWrapper = ({
    id,
    flexDirection = 'column',
    maxWidth = 'xl',
    showBottomLine = true,
    children
}) => {
    return (
        <Container maxWidth={maxWidth} sx={{ pt: '2rem', pb: '1rem', }}>
            {children}
            <SizedBox height={'1.5rem'} />
            {showBottomLine && <div style={{ width: '100%', height: '2px', backgroundColor: '#eee' }} />}
        </Container>
    )
}

export default SectionWrapper
