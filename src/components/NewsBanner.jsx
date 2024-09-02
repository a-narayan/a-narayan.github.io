import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import SizedBox from './SizedBox'
import DText from './DText'
import colors from '../constants/colors'
import { formatTimestamp } from '../utils/dateUtils'
import { useNavigate } from 'react-router-dom'

const NewsBanner = ({ id, index, title, subtitle, date, content }) => {

    const navigate = useNavigate();

    return (
        <div onClick={() => {
            navigate(`/news/${id}`, {
                state: {
                    id,
                    index,
                    title,
                    subtitle,
                    date,
                    content,
                }
            });
        }}>
            <Container maxWidth={'xl'} sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                px: '1rem',
                py: '1rem',
                borderRadius: '5px',
                boxShadow: '0 5px 10px 0 #ddd',
                ':hover': {
                    cursor: 'pointer'
                }
            }}>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ backgroundColor: '#444', px: '8px', py: '4px', borderRadius: '5px', }}>
                        <Typography color={'#fff'}>{date}</Typography>
                    </Box>
                </div>
                <SizedBox height={'8px'} />
                <DText variant='body2' color={colors.dColor1} weight={'bold'}>{title}</DText>
                <SizedBox height={'8px'} />
                <DText variant='body2'>{subtitle}</DText>
            </Container>
        </div>
    )
}

export default NewsBanner
