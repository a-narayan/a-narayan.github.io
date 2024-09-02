import React, { useEffect, useState } from 'react'
import { DButton, DText, DTextField, SectionWrapper, SizedBox } from '../../../components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { Timestamp } from 'firebase/firestore';
import { useAlerts } from '../../../hooks/useAlerts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

const AdminNewsDetails = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const userData = useSelector((states) => states.user.value);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [date, setDate] = useState(dayjs(new Date()));
    const [content, setContent] = useState('');
    const showDialog = useAlerts('dialog');

    const fetchNews = async () => {
        await getDoc(doc(db, 'news', params.id)).then(docSnapshot => {
            if (docSnapshot.exists) {
                setTitle(docSnapshot.data().title);
                setSubtitle(docSnapshot.data().subtitle);
                setDate(docSnapshot.data().date);
                setContent(docSnapshot.data().content);
            }
        }).catch(err => {
            console.log(err);
        });
    };

    const saveNews = async () => {
        const timestamp = Timestamp.fromDate(date.toDate());
        await updateDoc(doc(db, 'news', params.id), {
            title,
            subtitle,
            date: timestamp,
            content,
        }).then(() => {
            showDialog('', 'News saved successfully!', 'Ok');
        }).catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
        //     navigate('/login');
        // }

        if (location.state === undefined || location.state === null || Object.keys(location.state).length === 0) {
            fetchNews();
        } else {
            setTitle(location.state.title);
            setSubtitle(location.state.subtitle);
            setDate(dayjs(Date.parse(location.state.date)));
            setContent(location.state.content);
        }
    }, []);

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='body1' weight='bold'>Title</DText>
            <SizedBox height={'8px'} />
            <DTextField helperText={'Title'} value={title} onChange={setTitle} />
            <SizedBox height={'1rem'} />
            <DText variant='body1' weight='bold'>Subtitle</DText>
            <SizedBox height={'8px'} />
            <DTextField helperText={'Subtitle'} value={subtitle} onChange={setSubtitle} />
            <SizedBox height={'1rem'} />
            <DText variant='body1' weight='bold'>Date</DText>
            <DatePicker format='DD-MM-YYYY' value={date} onChange={(newValue) => setDate(newValue)} />
            <SizedBox height={'1rem'} />
            <DText variant='body1' weight='bold'>Content</DText>
            <SizedBox height={'8px'} />
            <ReactQuill theme='snow' value={content} onChange={setContent} />
            <SizedBox height={'2rem'} />
            <DButton fullWidth onClick={saveNews}>Save</DButton>
        </SectionWrapper>
    )
}

export default AdminNewsDetails
