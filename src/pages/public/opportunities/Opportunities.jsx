import React, { useEffect, useState } from 'react'
import { DText, Description, SectionWrapper, SizedBox } from '../../../components'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import Images from '../../../sections/images/Images';

const Opportunities = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await getDoc(doc(db, 'opportunities', 'opportunities')).then(docSnapshot => {
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
        heading={'Opportunities'}
        data={[
          'IDSL is looking for motivated students (undergrads and grads) interested in working in the domain of Data Science, Machine Learning, Artificial Intelligence, and Safety and Security of Cyber Physical Systems. All admitted students will receive a stipend.',
          'If you are interested in pursuing research or graduate studies in these lines of work, please email Dr. Apurva Narayan a copy of your ',
          [
            'CV',
            'Research Statement',
            'Sample work (if applicable)'
          ]
        ]}
      /> */}
      {/* <SizedBox height={'2rem'} /> */}
    </SectionWrapper>
  )
}

export default Opportunities
