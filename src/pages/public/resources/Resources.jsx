import React, { useEffect, useState } from 'react'
import { DText, SectionWrapper, SizedBox } from '../../../components'
import ResourcesTable from './components/ResourcesTable'
import { updateResources } from '../../../features/resources';
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { formatTimestamp } from '../../../utils/dateUtils';
import Images from '../../../sections/images/Images';

const Resources = () => {

  const dispatch = useDispatch();
  const resources = useSelector((states) => states.resources.value);
  const [data, setData] = useState([]);

  const fetchResources = async () => {
    const r = [];
    const q = query(collection(db, 'resources'), orderBy('date'));
    await getDocs(q).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        const docData = { ...doc.data() };
        docData.date = formatTimestamp(docData.date);
        r.push(docData);
      });
    });
    dispatch(updateResources(r));
  };

  useEffect(() => {
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
      {/* <DText variant='body2'>Videos and presentations are available in our YouTube page.</DText> */}
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
      <SizedBox height={'2rem'} />
      {resources !== undefined && resources.length > 0 && <ResourcesTable data={resources} />}
    </SectionWrapper>
  )
}

export default Resources
