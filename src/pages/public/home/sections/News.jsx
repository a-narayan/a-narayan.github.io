import React, { useEffect } from 'react'
import { DText, NewsBanner, SectionWrapper, SizedBox } from '../../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { updateNews } from '../../../../features/news';
import { formatTimestamp } from '../../../../utils/dateUtils';

const News = () => {

  const dispatch = useDispatch();
  const newsArticles = useSelector((states) => states.news.value);

  useEffect(() => {
    const fetchNews = async () => {
      const n = [];
      await getDocs(collection(db, 'news')).then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          const docData = doc.data();
          docData.date = formatTimestamp(docData.date);
          n.push({ ...docData, id: doc.id })
        });
      });
      dispatch(updateNews(n));
    };
    if (newsArticles === undefined || newsArticles.length === 0) {
      fetchNews();
      console.log('fetching news from firestore')
    }
  }, []);

  return (
    <SectionWrapper showBottomLine={false}>
      <DText variant='subHeading'>News</DText>
      <SizedBox height={'1rem'} />
      {newsArticles.map(article =>
        <div>
          <NewsBanner id={article.id} index={article.index} title={article.title} subtitle={article.subtitle} date={article.date} content={article.content} />
          <SizedBox height={'1.5rem'} />
        </div>
      )}
    </SectionWrapper>
  )
}

export default News
