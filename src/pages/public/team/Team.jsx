import React, { useEffect, useState } from 'react'
import { DText, Description, SectionWrapper, SizedBox } from '../../../components'
import TeamMember from './components/TeamMember'
import { Grid } from '@mui/material'
import AlumniTable from './components/AlumniTable';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateAlumni, updateScholarshipsAndAwards, updateTeam } from '../../../features/team';
import { useDispatch, useSelector } from 'react-redux';
import Images from '../../../sections/images/Images';


const Team = () => {

  const dispatch = useDispatch();
  const team = useSelector((states) => states.team.team);
  const alumni = useSelector((states) => states.team.alumni);
  const scholarshipsAndAwards = useSelector((states) => states.team.scholarshipsAndAwards);
  const degrees = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];
  const [data, setData] = useState([]);
  const [scholarshipsAndAwardsData, setScholarshipsAndAwardsData] = useState([]);

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
  };

  useEffect(() => {
    if (alumni === undefined || alumni.length === 0) {
      getAlumni();
    }

    getScholarshipsAndAwards();

    if (team === undefined || team.length === 0) {
      getTeam();
    } else {
      setTeam(team);
    }

  }, []);

  const [availableDegrees, setAvailableDegrees] = useState([]);

  return (
    <SectionWrapper showBottomLine={false}>
      {data.map((item, index) =>
        <div>
          {item.type === 'html' ?
            <div
              style={{ lineHeight: '1.5' }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            :
            <Images links={item.links} />}
          <SizedBox height={'4px'} />
        </div>
      )}
      {/* <Description
        heading={'Faculty & Staff'}
        data={[[
          'Apurva Narayan, Principal Investigator',
          'Link to UBC Staff Directory',
          'Link to UW Staff Directory'
        ]]}
      /> */}
      <SizedBox height={'2rem'} />
      {team !== undefined && team.length > 0 && availableDegrees.map(degree => <div key={degree}>
        <DText variant='subHeading'>{degree}</DText>
        <SizedBox height={'1rem'} />
        <Grid container>
          {team.map(member => member.name !== undefined && member.name.length > 0 && member.degree === degree && <Grid key={member.name} item xs={12} sm={6} md={4}>
            <TeamMember
              id={member.id}
              imageLink={member.imageUrl}
              name={member.name}
              researchArea={member.researchArea}
              coSupervisor={member.coSupervisor}
              degree={member.degree}
              description={member.description}
              emailId={member.emailId}
              yearJoined={member.yearJoined}
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

      {scholarshipsAndAwardsData.map((item, index) =>
        <div>
          {item.type === 'html' ?
            <div
              style={{ lineHeight: '1.5' }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            :
            <Images links={item.links} />}
          <SizedBox height={'4px'} />
        </div>
      )}
      {/* {scholarshipsAndAwards !== undefined && scholarshipsAndAwards.length > 0 && <Description
        heading={'Scholarships and Awards'}
        data={[scholarshipsAndAwards]}
      />} */}
    </SectionWrapper>
  )
}

export default Team
