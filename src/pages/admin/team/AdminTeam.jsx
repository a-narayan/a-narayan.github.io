import React, { useEffect, useState } from 'react'
import { DButton, DText, Description, SectionWrapper, SizedBox } from '../../../components'
import { Grid } from '@mui/material'
import AlumniTable from '../../public/team/components/AlumniTable';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateAlumni, updateScholarshipsAndAwards, updateTeam } from '../../../features/team';
import { useDispatch, useSelector } from 'react-redux';
import AdminTeamMember from './components/AdminTeamMember';
import EditTeamMemberDialog from './components/EditTeamMemberDialog';
import { useNavigate, useParams } from 'react-router-dom';
import WebsiteEditor from '../admin-components/WebsiteEditor';
import { useAlerts } from '../../../hooks/useAlerts';


const Team = () => {

  const params = useParams();
  const navigate = useNavigate();
  const userData = useSelector((states) => states.user.value);
  const showDialog = useAlerts('dialog');
  const dispatch = useDispatch();
  const team = useSelector((states) => states.team.team);
  const alumni = useSelector((states) => states.team.alumni);
  const scholarshipsAndAwards = useSelector((states) => states.team.scholarshipsAndAwards);
  const degrees = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState([]);
  const [scholarshipsAndAwardsData, setScholarshipsAndAwardsData] = useState([]);

  const handleDialogClose = () => setDialogOpen(false);

  const getTeam = async () => {
    const t = [];
    const q = query(collection(db, 'team'), where('isAlumni', '==', false));
    await getDocs(q).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        t.push({ ...doc.data(), id: doc.id });
      });
    });
    dispatch(updateTeam(t));
    setTeam(t);
  };


  const setTeam = (t) => {
    const availableDeg = [];
    degrees.forEach(degree => {
      t.forEach(member => {
        if (member.degree === degree && !availableDeg.includes(degree)) {
          availableDeg.push(degree);
        }
      });
    });
    setAvailableDegrees(availableDeg);
  };

  const getAlumni = async () => {
    let a = [];
    const q = query(collection(db, 'alumni'), orderBy('year'));
    await getDocs(q).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        doc.data().alumnus.forEach(al => {
          a.push({ ...al, year: doc.data().year });
        })
      });
    });
    dispatch(updateAlumni(a.reverse()));
  };

  const getScholarshipsAndAwards = async () => {
    await getDoc(doc(db, 'teamContent', 'teamContent')).then(docSnapshot => {
      if (docSnapshot.exists) {
        setData(docSnapshot.data().facultyAndStaffData);
        setScholarshipsAndAwardsData(docSnapshot.data().scholarshipsAndAwardsData);
        // dispatch(updateScholarshipsAndAwards(docSnapshot.data().scholarshipsAndAwardsData));
      }
    }).catch(err => {
      console.log(err);
    });
    // let s = [];
    // await getDoc(doc(db, 'scholarshipsAndAwards', 'scholarshipsAndAwards')).then(docSnapshot => {
    //   if (docSnapshot.exists) {
    //     s = docSnapshot.data().scholarshipsAndAwards;
    //   }
    // });
  };

  useEffect(() => {
    // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
    //   navigate('/login');
    // }

    // if (alumni === undefined || alumni.length === 0) {

    // }
    getAlumni();

    // if (scholarshipsAndAwards === undefined || scholarshipsAndAwards.length === 0) {

    // }

    getScholarshipsAndAwards();
    // if (team === undefined || team.length === 0) {

    // } else {
    //   setTeam(team);
    // }

    getTeam();
    console.log('useEffect');

  }, [dialogOpen]);

  const [availableDegrees, setAvailableDegrees] = useState([]);

  return (
    <SectionWrapper showBottomLine={false}>
      <SizedBox height={'2rem'} />
      <WebsiteEditor
        data={data}
        setData={setData}
        handleSaveData={async () => {
          await updateDoc(doc(db, 'teamContent', 'teamContent'), { facultyAndStaffData: data }).then(() => {
            showDialog('', 'Data saved successfully', 'Ok');
          }).catch(err => {
            showDialog('', 'An error occurred while saving the data', 'Ok');
          });
        }}
      />
      {/* <Description
        heading={'Faculty & Staff'}
        data={[[
          'Apurva Narayan, Principal Investigator',
          'Link to UBC Staff Directory',
          'Link to UW Staff Directory'
        ]]}
      /> */}
      <SizedBox height={'2rem'} />
      <DText variant='subHeading'>Team</DText>
      <SizedBox height={'1rem'} />
      <DButton onClick={() => {
        setDialogOpen(true);
      }}>Add New Student</DButton>
      <SizedBox height={'1rem'} />
      {team !== undefined && team.length > 0 && availableDegrees.map(degree => <div key={degree}>
        <DText variant='subHeading'>{degree}</DText>
        <SizedBox height={'1rem'} />
        <Grid container>
          {team.map(member => member.degree === degree && <Grid key={member.name} item xs={12} sm={6} md={4}>
            <AdminTeamMember
              id={member.id ?? ''}
              imageLink={member.imageUrl ?? ''}
              name={member.name ?? ''}
              researchArea={member.researchArea ?? ''}
              coSupervisor={member.coSupervisor ?? ''}
              degree={member.degree ?? ''}
              description={member.description ?? ''}
              emailId={member.emailId ?? ''}
              yearJoined={member.yearJoined ?? ''}
              password={member.password}
            />
          </Grid>)}
        </Grid>
        <SizedBox height={'2rem'} />
      </div>)}

      <SizedBox height={'2rem'} />

      <DText variant='subHeading'>Alumni</DText>
      <SizedBox height={'1rem'} />
      {alumni !== undefined && alumni.length > 0 && <AlumniTable data={alumni} />}
      <SizedBox height={'4rem'} />
      <WebsiteEditor
        data={scholarshipsAndAwardsData}
        setData={setScholarshipsAndAwardsData}
        handleSaveData={async () => {
          await updateDoc(doc(db, 'teamContent', 'teamContent'), { scholarshipsAndAwardsData }).then(() => {
            showDialog('', 'Data saved successfully', 'Ok');
          }).catch(err => {
            showDialog('', 'An error occurred while saving the data', 'Ok');
          });
        }}
      />
      {/* {scholarshipsAndAwards !== undefined && scholarshipsAndAwards.length > 0 && <Description
        heading={'Scholarships and Awards'}
        data={[scholarshipsAndAwards]}
      />} */}

      <EditTeamMemberDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
        isEdit={false}
      />
    </SectionWrapper>
  )
}

export default Team
