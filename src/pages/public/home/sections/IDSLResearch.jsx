import React from 'react'
import { DButton, DText, Description, SectionWrapper, SizedBox } from '../../../../components'
import { Grid } from '@mui/material'
import DCard from '../../../../components/DCard'
import { useNavigate } from 'react-router-dom'

const IDSLResearch = () => {

    // const navigate = useNavigate();

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='subHeading'>IDSL Research</DText>
            <SizedBox height={'1rem'} />
            <DText variant='body1'>Our research bridges together intelligent systems, data science, software engineering, and decision making under uncertainty.</DText>
            <SizedBox height={'1rem'} />
            <DText>Check out some of our recent publications in various domains:</DText>
            <SizedBox height={'1rem'} />
            <Grid container spacing={4}>
                <Grid item xs={6} sm={6} md={3}>
                    <DCard imageUrl={'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/img/da.png?raw=true'} text={'Data Analytics'} />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <DCard imageUrl={'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/img/swe.png?raw=true'} text={'Software Engineering'} />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <DCard imageUrl={'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/img/ml.png?raw=true'} text={'Machine Learning'} />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                    <DCard imageUrl={'https://github.com/a-narayan/a-narayan-old.github.io/blob/master/assets/img/ai.png?raw=true'} text={'Trustworthy and Safe AI'} />
                </Grid>
            </Grid>
            {/* <SizedBox height={'3rem'} />
            <Description
                heading={'Research Themes'}
                data={[
                    'We are witnessing exponential advancements in development and deployment of IoT systems, smart infrastructures, and our dependency on these systems. The overall vision of IDSL is to develop tools that will help resolve software issues much faster, and advance toward better system safety, security, and resiliency. Automated reasoning of these systems play a key role in understanding system behavior, verification, run-time monitoring, anomaly detection, and intrusion detection.',
                    'Computational research in the domain of data driven software engineering gets complicated with the amount of data that one needs to process to reach an outcome. IDSL conducts data mining, software engineering, and machine learning research with a focus on safety-critical software systems to ensure that modern day safety-critical systems are safe, secure, and resilient. Behavior of software systems is modelled using formal specifications. Formal specifications are used to develop monitoring systems that ensure system safety and security, debugging, program comprehension, and other software engineering applications. Verification of artificial intelligence based software that are beginning to be a new standard for a large number of safety-critical applications is shown to be a NP-complete problem',
                    'We often collaborate with industry partners and other academic researchers for problem-solving in specific domains. For a list of our projects and collaborators, please visit our Research page:'
                ]} />
            <DButton onClick={() => {
                navigate('/research');
            }}>IDSL Research</DButton> */}
        </SectionWrapper>
    )
}

export default IDSLResearch
