import React, { useEffect } from 'react'
import { DText, HighlightBanner, SectionWrapper, SizedBox } from '../../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { updateHighlights } from '../../../../features/highlights';

const Highlights = () => {

  const dispatch = useDispatch();
  const highlights = useSelector((states) => states.highlights.value);

  useEffect(() => {
    const fetchHighlights = async () => {
      const n = [];
      await getDoc(doc(db, 'highlights', 'highlights')).then(docSnapshot => {
        if (docSnapshot.exists) {
          docSnapshot.data().highlights.forEach(highlight => {
            n.push(highlight);
          });
        }
      });
      dispatch(updateHighlights(n));
    };
    if (highlights === undefined || highlights.length === 0) {
      fetchHighlights();
    }
  })

  return (
    <SectionWrapper>
      <DText variant='subHeading'>Highlights</DText>
      <SizedBox height={'1rem'} />
      {highlights.map(highlight => <HighlightBanner
        date={highlight.date}
        text={highlight.text}
        link={highlight.link}
      />)}
    </SectionWrapper>
  )
}

export default Highlights
