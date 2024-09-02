import React, { useEffect, useState } from 'react'
import { SectionWrapper, SizedBox } from '../../../components'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import Images from '../../../sections/images/Images';

const Research = () => {

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

      {/* <DText>The IDSL Lab that hosts students jointly at the University of British Columbia and University of Waterloo conducts research at the intersection of software engineering, data analytics, machine learning, and safety and security of cyber-physical systems.</DText>
      <SizedBox height={'1rem'} />
      <DText>On the applied research side, we develop novel algorithms and computational tools to solve industrial problems in safety, security, and robustness of automation processes. We also explore fundamental problems in AI and machine learning for theoretical insights.</DText>
      <SizedBox height={'1.5rem'} />
      <Description
        heading={'Research Topics:'}
        data={[
          'We are interested in the development of smart plants and intelligent processes, which can be distinguished from traditional industrial plants by:',
          [
            'Robustness certification of AI models',
            'Data mining for complex cyber physical systems',
            'Automatic detection and diagnosis of faults',
            'Predictive analytics'
          ]
        ]}
      />
      <SizedBox height={'1.5rem'} />
      <Description
        heading={'Past Projects:'}
        data={[
          'Please see our publications list for more information on our past projects on:',
          [
            'Anomaly Detection',
            'Fault Detection and Diagnosis',
            'Sepcification Mining',
            'Robustness of AI',
            'AI in Healthcare',
            'AI in Manufacturing',
          ]
        ]}
      />
      <SizedBox height={'1.5rem'} />
      <Description
        heading={'Domains'}
        data={[
          'A big subset of our research projects have an applied flavour with useful and immediate applications in industry. We often collaborate with industry partners and other academic researchers for problem-solving in specific domains.',
        ]}
      />
      <SizedBox height={'1.5rem'} />
      <Description
        heading={'Industry Partners'}
        data={[
          [
            'Scotia Bank',
            'Troj AI Inc.',
            'Loblaw Inc.',
            'General Motors',
            'Microsoft',
            'Palitronica',
          ]
        ]}
      /> */}
    </SectionWrapper>
  )
}

export default Research
