import React, { useEffect, useState } from 'react'
import { DText, SectionWrapper, SizedBox } from '../../../components'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { useAlerts } from '../../../hooks/useAlerts';
import WebsiteEditor from '../admin-components/WebsiteEditor';


const AdminResearch = () => {

  const showDialog = useAlerts('dialog');
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      console.log('Getting data');
      await getDoc(doc(db, 'research', 'research')).then(docSnapshot => {
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
      <DText variant='subHeading'>Research</DText>
      <SizedBox height={'2rem'} />
      <WebsiteEditor
        data={data}
        setData={setData}
        handleSaveData={async () => {
          console.log(data);
          await updateDoc(doc(db, 'research', 'research'), { data }).then(() => {
            showDialog('', 'Data saved successfully', 'Ok');
          }).catch(err => {
            showDialog('', 'An error occurred while saving the data', 'Ok');
          });
        }}
      />
    </SectionWrapper>
  )
}

export default AdminResearch
