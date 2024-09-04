import React from 'react'
import { DText, InfoBanner, SectionWrapper, SizedBox } from '../../../../components'
import { Grid } from '@mui/material'

const Welcome = () => {
    return (
        <SectionWrapper>
            <SizedBox height={'1rem'} />
            <DText variant='heading'>Welcome to IDSL</DText>
            <SizedBox height={'1rem'} />
            <DText variant='body1'>We develop novel algorithms and machine learning models to solve complex problems in the fields of data science and artificial intelligence.</DText>
            <SizedBox height={'2rem'} />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={2} sx={{display: 'flex', alignItems: 'start', justifyContent: 'center'}}>
                    <img src='https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/profile/apurva.jpg?raw=true' style={{ width: '150px', height: '150px', borderRadius: '150px' }} />
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                    <InfoBanner />
                </Grid>
            </Grid>
        </SectionWrapper>
    )
}

export default Welcome
