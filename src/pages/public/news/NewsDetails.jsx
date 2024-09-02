import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { DText, SectionWrapper, SizedBox } from '../../../components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';

const NewsDetails = () => {

    const params = useParams();
    const location = useLocation();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');

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

    useEffect(() => {
        console.log(location.state);
        if (location.state === undefined || location.state === null || Object.keys(location.state).length === 0) {
            // fetch news from firestore
            fetchNews();
        } else {
            setTitle(location.state.title);
            setSubtitle(location.state.subtitle);
            setDate(location.state.date);
            setContent(location.state.content);
        }
    }, []);

    return (
        <SectionWrapper showBottomLine={false}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {title !== undefined && title.length > 0 && <DText textAlign='center' variant='heading'>{title}</DText>}
                {date !== undefined && date.length > 0 && <DText variant='body2' weight='bold'>{date}</DText>}
                <SizedBox height={'2rem'} />
                {subtitle !== undefined && subtitle.length > 0 && <DText variant='body1'>{subtitle}</DText>}
                <SizedBox height={'2rem'} />
                {/* {content !== undefined && content.length > 0 && <DText>{content}</DText>} */}
                {content !== undefined && content.length > 0 && <div dangerouslySetInnerHTML={{ __html: content }} />}
            </div>
        </SectionWrapper>
    )
}

export default NewsDetails
