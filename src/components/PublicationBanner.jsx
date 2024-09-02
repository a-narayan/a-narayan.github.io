import { Container, Grid } from '@mui/material'
import React from 'react'
import SizedBox from './SizedBox'
import DText from './DText'
import colors from '../constants/colors'
import DButton from './DButton'

const PublicationBanner = ({ index, publicationType, title, authors, booktitle, ppText, links }) => {

    const linkColors = {
        'PDF': [colors.dColor3, '#fff'],
        'Slides': ['#FCD12A', '#444'],
        'Bib': [colors.dColor3, '#fff'],
        'Video': ['#149C88', '#fff'],
        'Thesis': ['#FCD12A', '#444'],
        'Code': ['#03AC13', '#fff'],
        'Poster': ['#FCD12A', '#444'],
        'Supplementary Info': ['#FCD12A', '#444']
    };

    return (
        <Container maxWidth={'xl'} sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            px: '1rem',
            py: '1rem',
            mb: '1.5rem',
            borderRadius: '5px',
            boxShadow: '0 5px 10px 0 #ddd',
        }}>
            <DText>{index}. {publicationType}</DText>
            <DText variant='body1' color={colors.dColor2} weight={'bold'}>{title}</DText>
            <SizedBox height={'8px'} />
            <DText variant='body2'>{authors}</DText>
            <SizedBox height={'8px'} />
            <DText variant='body2'>{booktitle}</DText>
            <SizedBox height={'8px'} />
            <Grid container>
                <Grid item>
                    <DText>{ppText}</DText>
                </Grid>
                <SizedBox width={'8px'} />
                {Object.keys(linkColors).map(link =>
                    Object.keys(links).includes(link) && <div style={{ display: 'flex', marginBottom: '4px' }}>
                        <DButton
                            fontSize='12px'
                            padding={0}
                            backgroundColor={linkColors[link][0]}
                            color={linkColors[link][1]}
                            onClick={() => {
                                window.open(links[link], "_blank", "noreferrer");
                            }}
                        >
                            {link}
                        </DButton>
                        <SizedBox width={'4px'} />
                    </div>
                )}
            </Grid>
            <div style={{ display: 'flex' }}>

                {/* <SizedBox width={'1rem'} />
                <DButton fontSize='12px' padding={0}>PDF</DButton>
                <SizedBox width={'4px'} />
                <DButton fontSize='12px' padding={0} backgroundColor='#FCD12A' color='#444'>Slides</DButton>
                <SizedBox width={'4px'} />
                <DButton fontSize='12px' padding={0}>Bib</DButton>
                <SizedBox width={'4px'} />
                <DButton fontSize='12px' padding={0} backgroundColor='#149C88'>Video</DButton> */}
            </div>
        </Container>
    )
}

export default PublicationBanner
