import React from 'react'
import SectionWrapper from './SectionWrapper'
import { Button, Grid } from '@mui/material'
import DText from './DText'
import SizedBox from './SizedBox';
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/favicon.ico'
import colors from '../constants/colors';

const Footer = () => {

    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#eee' }}>
            <SectionWrapper>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <DText variant='subHeading'>Contact</DText>
                        <SizedBox height={'1rem'} />
                        <DText variant='body2' weight='bold'>Apurva Narayan</DText>
                        <DText variant='body2'>Assistant Professor</DText>
                        <DText>
                            <a style={{textDecoration: 'none', color: colors.dColor2}} href='https://www.csd.uwo.ca//'>Department of Computer Science</a> & 
                            <a style={{textDecoration: 'none', color: colors.dColor2}} href='https://www.eng.uwo.ca/electrical//index.html'> Department of Electrical and Computer Engineering</a>
                        </DText>
                        <DText>Western University</DText>
                        <SizedBox height={'1rem'} />
                        <DText>Affiliate Assistant Professor</DText>
                        <DText><a style={{textDecoration: 'none', color: colors.dColor2}} href='https://cmps.ok.ubc.ca/'>Department of Computer Science</a></DText>
                        <DText>University of British Columbia</DText>
                        <SizedBox height={'1rem'} />
                        <DText>Associate Faculty</DText>
                        <DText><a style={{textDecoration: 'none', color: colors.dColor2}} href='https://engineering.ok.ubc.ca/'>School of Engineering</a></DText>
                        <DText>University of British Columbia</DText>
                        <SizedBox height={'1rem'} />
                        <DText>Adjunct Assistant Professor</DText>
                        <DText><a style={{textDecoration: 'none', color: colors.dColor2}} href='https://uwaterloo.ca/systems-design-engineering/'>Department of Systems Design Engineering</a></DText>
                        <DText>University of Waterloo</DText>
                        <SizedBox height={'1rem'} />
                        <DText weight='bold'>Phone</DText>
                        <DText>+1 250.807.8272</DText>
                        <DText weight='bold'>Emails</DText>
                        <DText>apurva.narayan@uwo.ca, apurva.narayan@ubc.ca, apurva.narayan@uwaterloo.ca</DText>
                        <DText weight='bold'>Office</DText>
                        <DText>MC - 368</DText>
                        <DText weight='bold'>Address</DText>
                        <DText>1151 Richmond St, London, ON N6A 3K7</DText>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <DText variant='subHeading'>Navigation</DText>
                        <SizedBox height={'1rem'} />
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/')}>Home</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/news')}>News</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/team')}>Team</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/research')}>Research</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/publications')}>Publications</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/opportunities')}>Opportunities</Button>
                        <Button variant='text' sx={{ textTransform: 'none', fontSize: '16px' }} onClick={() => navigate('/resources')}>Resources</Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logo} style={{ maxWidth: '25px', maxHeight: '25px' }} />
                            <SizedBox width={'8px'} />
                            <DText variant='subHeading'>IDSL</DText>
                        </div>
                        <SizedBox height={'1rem'} />
                        <DText variant='body1' weight='bold'>Intelligent Data Science Lab</DText>
                        <DText variant='body2'>Research Group of Apurva Narayan at Western University, University of British Columbia and the University of Waterloo, Canada.</DText>
                    </Grid>
                </Grid>
            </SectionWrapper>
        </div>
    )
}

export default Footer
