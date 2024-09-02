import { Box, Button, Container } from '@mui/material'
import React from 'react';
import AnnouncementIcon from '@mui/icons-material/AnnouncementOutlined';
import SizedBox from './SizedBox';
import DText from './DText';
import DButton from './DButton';

const HighlightBanner = ({ date, text, link }) => {
    return (
        <Container maxWidth={'xl'} sx={{
            backgroundColor: 'lightGreen',
            px: '1rem',
            py: '1rem',
            borderRadius: '5px',
            boxShadow: '0 8px 10px 0 #ddd'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <AnnouncementIcon />
                <SizedBox width={'1rem'} />
                <Box sx={{ backgroundColor: 'white', px: '8px', py: '4px', borderRadius: '5px' }}>
                    {date}
                </Box>
            </div>
            <SizedBox height={'8px'} />
            <DText variant='body2'>{text}</DText>
            <SizedBox height={'8px'} />
            <Button variant='text' sx={{ px: '0px' }} onClick={() => {
                // Open the link
                try {
                    var win = window.open(link, '_blank');
                    win.focus();
                } catch (err) {
                    console.log('Could not open the link');
                }

            }}>Link</Button>
        </Container>
    )
}

export default HighlightBanner
