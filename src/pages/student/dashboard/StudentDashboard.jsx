import React, { useEffect, useState } from 'react'
import { DButton, DSelect, DText, DTextField, SectionWrapper, SizedBox } from '../../../components'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAlerts } from '../../../hooks/useAlerts';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { comparePasswords, hashPassword } from '../../../utils/encryptionUtils';

const StudentDashboard = () => {

  const params = useParams();
  const navigate = useNavigate();
  const userData = useSelector((states) => states.user.value);

  const showDialog = useAlerts('dialog');
  const [memberImageLink, setMemberImageLink] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberResearchArea, setMemberResearchArea] = useState('');
  const [memberCoSupervisor, setMemberCoSupervisor] = useState('');
  const [memberDegree, setMemberDegree] = useState('');
  const [memberDescription, setMemberDescription] = useState('');
  const [memberEmailId, setMemberEmailId] = useState('');
  const [memberYearJoined, setMemberYearJoined] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fetchedData, setFetchedData] = useState(false);
  const degrees = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];

  const fetchUserData = async () => {
    await getDoc(doc(db, 'team', userData.id)).then(docSnapshot => {
      const data = docSnapshot.data();
      setMemberImageLink(data.imageUrl);
      setMemberName(data.name);
      setMemberResearchArea(data.researchArea);
      setMemberCoSupervisor(data.coSupervisor);
      setMemberDegree(data.degree);
      setMemberDescription(data.description);
      setMemberEmailId(data.emailId);
      setMemberYearJoined(data.yearJoined);
      setPassword(data.password);
    }).catch(err => {
      showDialog('', 'An error occurred while fetching data', 'Ok');
    });
  };

  const saveMemberDetails = async () => {
    await updateDoc(doc(db, 'team', userData.id), {
      imageUrl: memberImageLink,
      name: memberName,
      researchArea: memberResearchArea,
      coSupervisor: memberCoSupervisor,
      degree: memberDegree,
      description: memberDescription,
      emailId: memberEmailId,
      yearJoined: memberYearJoined,
    }).then(() => {
      showDialog('', 'Details updated succesfully', 'Ok');
    }).catch(err => {
      showDialog('', 'An error occurred while updating details', 'Ok');
    });
  };

  const changePassword = async () => {
    const isMatch = await comparePasswords(currentPassword, password);
    if (isMatch) {
      const hashedPassword = await hashPassword(newPassword);;
      await updateDoc(doc(db, 'team', userData.id), {
        password: hashedPassword
      }).then(() => {
        showDialog('', 'Password changed succesfully', 'Ok');
        setPassword(hashedPassword);
      }).catch(err => {
        showDialog('', 'An error occurred while changing the password', 'Ok');
      });
    } else {
      showDialog('', 'Wrong password', 'Ok');
    }
  };

  useEffect(() => {
    if (userData.id !== params.userId || userData.userType !== 'student' || !userData.isLoggedIn) {
      navigate('/login');
    }
    if (!fetchedData) {
      fetchUserData();
      setFetchedData(true);
    }
  });

  return (
    <SectionWrapper showBottomLine={false}>
      <DText variant='subHeading'>Welcome</DText>
      <SizedBox height={'2rem'} />

      <DText variant='body1' weight='bold'>{'Edit Details'}</DText>
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Email ID'} value={memberEmailId} onChange={(val) => setMemberEmailId(val)} />
      <SizedBox height={'1rem'} />
      <DSelect label={'Degree'} values={degrees} selectedValue={memberDegree} onChange={(val) => setMemberDegree(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Name'} value={memberName} onChange={(val) => setMemberName(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Image URL'} value={memberImageLink} onChange={(val) => setMemberImageLink(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Research Area'} value={memberResearchArea} onChange={(val) => setMemberResearchArea(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Description'} value={memberDescription} onChange={(val) => setMemberDescription(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Co-supervisor(s)'} value={memberCoSupervisor} onChange={(val) => setMemberCoSupervisor(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Year Joined'} value={memberYearJoined} onChange={(val) => {
        const intVal = Number(val);
        if (Number.isInteger(intVal)) {
          setMemberYearJoined(intVal);
        }
      }} />
      <SizedBox height={'1rem'} />
      <DButton fullWidth onClick={saveMemberDetails}>Save Details</DButton>
      <SizedBox height={'2rem'} />

      <DText variant='body1' weight='bold'>Change Password</DText>
      <SizedBox height={'1rem'} />
      <DTextField helperText={'Password'} value={currentPassword} onChange={(val) => setCurrentPassword(val)} />
      <SizedBox height={'1rem'} />
      <DTextField helperText={'New Password'} value={newPassword} onChange={(val) => setNewPassword(val)} />
      <SizedBox height={'1rem'} />
      <DButton fullWidth onClick={changePassword}>Change Password</DButton>
    </SectionWrapper>
  )
}

export default StudentDashboard
