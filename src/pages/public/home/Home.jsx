import React, { useEffect, useState } from 'react'
import TopHeading from './sections/TopHeading'
import Welcome from './sections/Welcome'
import IDSLResearch from './sections/IDSLResearch'
import Recruitment from './sections/Recruitment'
import Highlights from './sections/Highlights'
import News from './sections/News'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase-setup/firebase'
import Images from '../../../sections/images/Images'
import { SectionWrapper, SizedBox } from '../../../components'

const Home = () => {

    const [data, setData] = useState([]);

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
        <div>
            <TopHeading />
            <Welcome />
            <IDSLResearch />
            <SectionWrapper>
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
            </SectionWrapper>
            
            {/* <Recruitment /> */}
            <Highlights />
            <News />
        </div>
    )
}

export default Home
