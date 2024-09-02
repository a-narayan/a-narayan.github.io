import React, { useEffect, useState } from 'react'
import { DButton, DText, SectionWrapper, SizedBox } from '../../../components'
import { updateResources } from '../../../features/resources';
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { formatTimestamp } from '../../../utils/dateUtils';
import AdminResourcesTable from './components/AdminResourcesTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlerts } from '../../../hooks/useAlerts';
import WebsiteEditor from '../admin-components/WebsiteEditor';

const AdminResources = () => {

  const params = useParams();
  const navigate = useNavigate();
  const userData = useSelector((states) => states.user.value);
  const showDialog = useAlerts('dialog');
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const resources = useSelector((states) => states.resources.value);

  const fetchResources = async () => {
    const r = [];
    const q = query(collection(db, 'resources'), orderBy('date'));
    await getDocs(q).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        const docData = { ...doc.data(), id: doc.id };
        docData.date = formatTimestamp(docData.date);
        r.push(docData);
      });
    });
    dispatch(updateResources(r));
  };

  useEffect(() => {
    // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
    //   navigate('/login');
    // }

    if (resources === undefined || resources.length === 0) {
      fetchResources();
    }
    const getData = async () => {
      await getDoc(doc(db, 'resourcesContent', 'resourcesContent')).then(docSnapshot => {
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
      <DText variant='subHeading'>Resources</DText>
      <SizedBox height={'2rem'} />
      <WebsiteEditor
        data={data}
        setData={setData}
        handleSaveData={async () => {
          await updateDoc(doc(db, 'resourcesContent', 'resourcesContent'), { data }).then(() => {
            showDialog('', 'Data saved successfully', 'Ok');
          }).catch(err => {
            showDialog('', 'An error occurred while saving the data', 'Ok');
          });
        }}
      />
      <SizedBox height={'2rem'} />
      {resources !== undefined && resources.length > 0 && <AdminResourcesTable data={resources} fetchResources={fetchResources} />}
    </SectionWrapper>
  )
}

export default AdminResources
