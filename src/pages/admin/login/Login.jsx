import React, { useState } from 'react'
import { DButton, DText, DTextField, SectionWrapper, SizedBox } from '../../../components';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../../firebase-setup/firebase';
import { comparePasswords } from '../../../utils/encryptionUtils';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../../../hooks/useAlerts';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../features/user';

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const showDialog = useAlerts('dialog');
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const q = query(collection(db, 'team'), where('emailId', '==', emailId.toLowerCase()));
        await getDocs(q).then(async querySnapshot => {
            if (!querySnapshot.empty) {
                const isMatch = await comparePasswords(password, querySnapshot.docs[0].data().password);
                if (isMatch) {
                    if (querySnapshot.docs[0].data().userType === 'admin') {
                        dispatch(loginUser({
                            id: querySnapshot.docs[0].id,
                            name: querySnapshot.docs[0].data().name,
                            userType: 'admin',
                        }));
                        navigate(`/admin/${querySnapshot.docs[0].id}/dashboard`);
                    } else if (querySnapshot.docs[0].data().userType === 'student') {
                        dispatch(loginUser({
                            id: querySnapshot.docs[0].id,
                            name: querySnapshot.docs[0].data().name,
                            userType: 'student',
                        }));
                        navigate(`/student/${querySnapshot.docs[0].id}/dashboard`);
                    } else {
                        showDialog('', 'Something went wrong', 'Ok');
                    }
                } else {
                    showDialog('', 'Wrong Password', 'Ok');
                }
            } else {
                showDialog('', 'The email ID is not registered', 'Ok');
            }
        });
    };

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='heading'>Login</DText>
            <SizedBox height={'2rem'} />
            <DTextField
                helperText={'Email ID'}
                maxWidth={'sm'}
                inputMode='email'
                onChange={(val) => setEmailId(val)}
            />
            <SizedBox height={'2rem'} />
            <DTextField
                helperText={'Password'}
                maxWidth={'sm'}
                inputMode='password'
                onChange={(val) => setPassword(val)}
            />
            <SizedBox height={'1rem'} />
            <DButton onClick={handleLogin}>Login</DButton>
        </SectionWrapper>
    )
}

export default Login
