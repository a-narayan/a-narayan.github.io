import { Box, Button, Container, Divider } from '@mui/material'
import React from 'react'
import DText from './DText'
import SizedBox from './SizedBox'
import LinkdinIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import DButton from './DButton';

const InfoBanner = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                backgroundColor: '#eee'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '5px',
                    height: '100%',
                    backgroundColor: '#ccc',
                }}
            />
            <Box
                sx={{
                    paddingLeft: '8px',
                    px: '2rem',
                    py: '1rem'
                }}
            >
                <DText>Dr. Apurva Narayan leads the IDSL research group. He is an assistant professor in the Department of Computer Science at Western University and affiliate assistant professor in the Department of Computer Science and School of Engineering at the University of British Columbia, as well as an adjunct assistant professor in the Department of Systems Design Engineering at the University of Waterloo (UW).</DText>
                <SizedBox height={'1rem'} />
                <div style={{ display: 'flex' }}>
                    <LinkdinIcon />
                    <SizedBox width={'8px'}/>
                    <XIcon />
                </div>
                <SizedBox height={'8px'} />
                {/* <Button variant='text' sx={{p: '0'}}>Read More</Button> */}
            </Box>
        </Box>
    )
}

export default InfoBanner