import React, { useEffect } from 'react'
import { DAppBar, DText, NewsArticleBanner, SectionWrapper, SizedBox } from '../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateNews } from '../../../features/news';
import { formatTimestamp } from '../../../utils/dateUtils';

const News = () => {

  const dispatch = useDispatch();
  const newsArticles = useSelector((states) => states.news.value);

  useEffect(() => {
    const fetchNews = async () => {
      const n = [];
      const q = query(collection(db, 'news'), orderBy('date'));
      await getDocs(q).then(querySnapshot => {
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
    }
  }, []);

  return (
    <div>
      <SectionWrapper showBottomLine={false}>
        <DText variant='subHeading'>News</DText>
        <SizedBox height={'1rem'}/>
        {newsArticles !== undefined && newsArticles.map((newsArticle, index) =>
          <NewsArticleBanner
            id={newsArticle.id}
            index={newsArticles.length - index}
            title={newsArticle.title}
            subtitle={newsArticle.subtitle}
            date={newsArticle.date}
            content={newsArticle.content}
          />
        )}
      </SectionWrapper>
    </div>
  )
}

export default News
