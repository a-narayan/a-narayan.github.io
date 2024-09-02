import React, { useEffect, useState } from 'react'
import { DText, SectionWrapper, SizedBox } from '../../../components'
import WebsiteEditor from '../admin-components/WebsiteEditor';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { useAlerts } from '../../../hooks/useAlerts';

const AdminHome = () => {

    const [data, setData] = useState([]);
    const showDialog = useAlerts('dialog');

    useEffect(() => {
        const getData = async () => {
            console.log('Getting data');
            await getDoc(doc(db, 'homeContent', 'homeContent')).then(docSnapshot => {
                if (docSnapshot.exists) {
                    setData(docSnapshot.data().data);
                }
            }).catch(err => {
                console.log(err);
            });
        };
        getData()
    }, []);

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='subHeading'>Home</DText>
            <SizedBox height={'2rem'} />
            <WebsiteEditor
                data={data}
                setData={setData}
                handleSaveData={async () => {
                    await updateDoc(doc(db, 'homeContent', 'homeContent'), { data }).then(() => {
                        showDialog('', 'Data saved successfully', 'Ok');
                    }).catch(err => {
                        showDialog('', 'An error occurred while saving the data', 'Ok');
                    });
                }}
            />
        </SectionWrapper>
    )
}

export default AdminHome
