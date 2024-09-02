import React, { useEffect, useState } from 'react'
import { DText, Description, PublicationBanner, SectionWrapper, SizedBox } from '../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updatePublications } from '../../../features/publications';
import { parseBibTeX } from '../../../utils/bibTexUtils';
import Images from '../../../sections/images/Images';

const Publications = () => {

  const dispatch = useDispatch();
  const [publications, setPublications] = useState([]);
  const [data, setData] = useState([]);

  const pubs = useSelector((states) => states.publications.value);

  const fetchPublications = async () => {
    let p = [];
    const q = query(collection(db, 'publications'), orderBy('year'));
    await getDocs(q).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        doc.data().publications.forEach(pub => {
          p.push(pub);
        })
      });
    });
    const pReverse = p.reverse();
    dispatch(updatePublications(pReverse));
    parsePublications(pReverse);
  };

  const parsePublications = (p) => {
    if (publications.length === 0) {
      const tempPubs = [];
      p.forEach(pub => {
        const data = parseBibTeX(pub.bibText);
        tempPubs.push({
          publicationType: pub.publicationType,
          title: data.title,
          author: data.author,
          booktitle: data.booktitle,
          ppText: data.pages !== undefined ? `pp. ${data.pages}. ${data.year}` : data.year,
          links: pub.links
        });
      });
      setPublications(tempPubs);
    }
  };

  useEffect(() => {
    if (pubs === undefined || pubs.length === 0) {
      fetchPublications();
    } else {
      parsePublications(pubs);
    }
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
  }, [])

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
      {/* <DText weight='bold'>Publication list under construction.</DText>
      <Description
        data={[[
          'Please see Google Scholar for a full list of publications.',
          'Videos and presentations are available in our YouTube page.',
          'Posters, data and other documents are also available in our Figshare page.',
        ]]} /> */}
      <SizedBox height={'2rem'} />
      {publications !== undefined && publications.length > 0 && publications.map((publication, index) => <PublicationBanner
        key={publication.title}
        index={publications.length - index}
        publicationType={publication.publicationType}
        title={publication.title}
        authors={publication.authors}
        booktitle={publication.booktitle}
        ppText={publication.ppText}
        links={publication.links}
      />)}
    </SectionWrapper>
  )
}

export default Publications
