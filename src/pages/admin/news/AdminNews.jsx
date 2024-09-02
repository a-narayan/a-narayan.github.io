import React, { useEffect } from 'react'
import { DButton, DText, NewsArticleBanner, SectionWrapper, SizedBox } from '../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updateNews } from '../../../features/news';
import AdminNewsBanner from './components/AdminNewsBanner';
import { formatTimestamp } from '../../../utils/dateUtils';
import { useNavigate, useParams } from 'react-router-dom';

const AdminNews = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const userData = useSelector((states) => states.user.value);
  const navigate = useNavigate();
  const newsArticles = useSelector((states) => states.news.value);

  useEffect(() => {
    // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
    //   navigate('/login');
    // }

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
        <SizedBox height={'1rem'} />
        <DButton onClick={() => { navigate(`/admin/${userData.id}/news/add-news`); }}>Add News</DButton>
        <SizedBox height={'2rem'} />
        {newsArticles !== undefined && newsArticles.map((newsArticle, index) =>
          <AdminNewsBanner
            key={newsArticle.id}
            id={newsArticle.id}
            index={newsArticles.length - index}
            title={newsArticle.title}
            subtitle={newsArticle.subtitle}
            date={newsArticle.date}
            content={newsArticle.content}
            userData={userData}
          />
        )}
      </SectionWrapper>
    </div>
  )
}

export default AdminNews
