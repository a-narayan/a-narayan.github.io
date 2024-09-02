import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { DText, SectionWrapper, SizedBox } from '../../../components';
import { Grid } from '@mui/material';
import TeamMemberImage from './components/TeamMemberImage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';

const TeamMemberDetails = () => {

    const params = useParams();
    const location = useLocation();
    const [dataAvailable, setDataAvailable] = useState(false);

    const [imageLink, setImageLink] = useState('');
    const [name, setName] = useState('');
    const [researchArea, setResearchArea] = useState('');
    const [coSupervisor, setCoSupervisor] = useState('');
    const [degree, setDegree] = useState('');
    const [description, setDescription] = useState('');
    const [emailId, setEmailId] = useState('');
    const [yearJoined, setYearJoined] = useState('');

    const fetchTeamMemberDetails = async () => {
        await getDoc(doc(db, 'team', params.id)).then(docSnapshot => {
            if (docSnapshot.exists) {
                setImageLink(docSnapshot.data().imageUrl);
                setName(docSnapshot.data().name);
                setResearchArea(docSnapshot.data().researchArea);
                setCoSupervisor(docSnapshot.data().coSupervisor);
                setDegree(docSnapshot.data().degree);
                setDescription(docSnapshot.data().description);
                setEmailId(docSnapshot.data().emailId);
                setYearJoined(docSnapshot.data().yearJoined);
                setDataAvailable(true);
            } else {
                setDataAvailable(false);
            }
        }).catch(err => {
            console.log(err);
            setDataAvailable(false);
        });
    };

    useEffect(() => {
        if (location.state === undefined || location.state === null || Object.keys(location.state) === 0) {
            fetchTeamMemberDetails();
        } else {
            setImageLink(location.state.imageLink);
            setName(location.state.name);
            setResearchArea(location.state.researchArea);
            setCoSupervisor(location.state.coSupervisor);
            setDegree(location.state.degree);
            setDescription(location.state.description);
            setEmailId(location.state.emailId);
            setYearJoined(location.state.yearJoined);
            setDataAvailable(true);
        }
    }, []);

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='heading'>{name}</DText>
            <SizedBox height={'2rem'} />
            {dataAvailable && <Grid container spacing={2}>
                <Grid item xs={12} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <TeamMemberImage imageLink={imageLink} diameter='150px' />
                    <SizedBox height={'8px'} />
                    <DText textAlign='center'>{name}</DText>
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <DText>{description}</DText>
                    <SizedBox height={'4rem'} />
                    <Grid container>
                        <Grid item xs={12} sm={5} md={4} lg={3} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <img src="https://cdn-icons-png.freepik.com/128/4011/4011160.png" style={{ width: '20px', height: '20px' }} />
                            <SizedBox width={'1rem'} />
                            <DText weight='bold'>Program/Degree</DText>
                        </Grid>
                        <Grid item xs={12} sm={7} md={8} lg={9} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <DText>{degree}, since {yearJoined}</DText>
                        </Grid>
                    </Grid>

                    <SizedBox height={'1rem'} />

                    <Grid container>
                        <Grid item xs={12} sm={5} md={4} lg={3} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <img src="https://cdn-icons-png.freepik.com/128/9391/9391261.png" style={{ width: '20px', height: '20px' }} />
                            <SizedBox width={'1rem'} />
                            <DText weight='bold'>Research</DText>
                        </Grid>
                        <Grid item xs={12} sm={7} md={8} lg={9} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <DText>{researchArea}</DText>
                        </Grid>
                    </Grid>

                    <SizedBox height={'1rem'} />

                    <Grid container>
                        <Grid item xs={12} sm={5} md={4} lg={3} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <img src="https://cdn-icons-png.freepik.com/256/11468/11468150.png" style={{ width: '20px', height: '20px' }} />
                            <SizedBox width={'1rem'} />
                            <DText weight='bold'>Co-supervisor(s)</DText>
                        </Grid>
                        <Grid item xs={12} sm={7} md={8} lg={9} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <DText>{coSupervisor.length > 0 ? coSupervisor : 'none'}</DText>
                        </Grid>
                    </Grid>

                    <SizedBox height={'1rem'} />

                    <Grid container>
                        <Grid item xs={12} sm={5} md={4} lg={3} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <img src="https://cdn-icons-png.freepik.com/128/12623/12623441.png" style={{ width: '20px', height: '20px' }} />
                            <SizedBox width={'1rem'} />
                            <DText weight='bold'>Contact</DText>
                        </Grid>
                        <Grid item xs={12} sm={7} md={8} lg={9} sx={{ display: 'flex', alignItems: 'center', height: '30px' }}>
                            <DText>{emailId}</DText>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>}
        </SectionWrapper>
    )
}

export default TeamMemberDetails
