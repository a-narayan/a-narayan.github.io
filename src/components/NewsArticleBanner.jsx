import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import SizedBox from './SizedBox'
import DText from './DText'
import colors from '../constants/colors'
import { formatTimestamp } from '../utils/dateUtils'
import { useNavigate } from 'react-router-dom'

const NewsArticleBanner = ({ id, index, title, subtitle, date, content }) => {

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
            <Container key={id} maxWidth={'xl'} sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                px: '1rem',
                py: '1rem',
                mb: '1.5rem',
                borderRadius: '5px',
                boxShadow: '0 5px 10px 0 #ddd',
                ':hover': {
                    cursor: 'pointer'
                }
            }}>

                <DText>{index}. News Article</DText>
                <DText variant='body1' color={colors.dColor2} weight={'bold'}>{title}</DText>
                <SizedBox height={'8px'} />
                <DText variant='body2'>{date}</DText>
                <SizedBox height={'8px'} />
                <DText variant='body2'>{subtitle}</DText>
                {/* <DText variant='body2' sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    WebkitLineClamp: 2,
                    textOverflow: 'ellipsis',
                }}>{content}</DText> */}
            </Container>
        </div>

    )
}

export default NewsArticleBanner
