import React, { useEffect, useState } from 'react'
import { DButton, DText, SectionWrapper, SizedBox } from '../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { updatePublications } from '../../../features/publications';
import { parseBibTeX } from '../../../utils/bibTexUtils';
import AdminPublication from './components/AdminPublication';
import PublicationDialog from './components/PublicationDialog';
import { useNavigate, useParams } from 'react-router-dom';
import WebsiteEditor from '../admin-components/WebsiteEditor';
import { useAlerts } from '../../../hooks/useAlerts';

const AdminPublications = () => {

  const params = useParams();
  const navigate = useNavigate();
  const userData = useSelector((states) => states.user.value);
  const showDialog = useAlerts('dialog');

  const dispatch = useDispatch();
  const [publications, setPublications] = useState([]);
  const [publicationDialogOpen, setPublicationDialogOpen] = useState(false);
  const [publicationDialogIsEdit, setPublicationDialogIsEdit] = useState(false);
  const [publicationDialogIndex, setPublicationDialogIndex] = useState(-1);
  const [data, setData] = useState([]);

  // Dialog states
  const [publicationType, setPublicationType] = useState('');
  const [bibText, setBibText] = useState('');
  const [addedLinkTypes, setAddedLinkTypes] = useState(['']);
  const [addedLinks, setAddedLinks] = useState(['']);
  const [year, setYear] = useState('');

  const pubs = useSelector((states) => states.publications.value);

  const fetchPublications = async () => {
    let p = [];
    const q = query(collection(db, 'publications'), orderBy('year', 'desc'));
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
      const newPubs = [];
      p.forEach(pub => {
        const data = parseBibTeX(pub.bibText);
        newPubs.push(
          {
            publicationType: pub.publicationType,
            title: data.title,
            author: data.author,
            booktitle: data.booktitle,
            ppText: data.pages !== undefined ? `pp. ${data.pages}. ${data.year}` : data.year,
            links: pub.links
          }
        );
      })
      setPublications(newPubs);
    }
  };

  useEffect(() => {
    // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
    //   navigate('/login');
    // }

    if (pubs === undefined || pubs.length === 0) {
      fetchPublications();
    } else {
      parsePublications(pubs);
    }
    const getData = async () => {
      console.log('Getting data');
      await getDoc(doc(db, 'publicationsContent', 'publicationsContent')).then(docSnapshot => {
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
      <DText variant='subHeading'>Publications</DText>
      <SizedBox height={'2rem'} />
      <WebsiteEditor
        data={data}
        setData={setData}
        handleSaveData={async () => {
          await updateDoc(doc(db, 'publicationsContent', 'publicationsContent'), { data }).then(() => {
            showDialog('', 'Data saved successfully', 'Ok');
          }).catch(err => {
            showDialog('', 'An error occurred while saving the data', 'Ok');
          });
        }}
      />
      <SizedBox height={'1rem'} />
      <DButton
        onClick={() => {
          setPublicationType('');
          setBibText('');
          setAddedLinkTypes(['']);
          setAddedLinks(['']);
          setYear('');
          setPublicationDialogIsEdit(false);
          setPublicationDialogOpen(true);
        }}
      >
        Add New Publication
      </DButton>
      <SizedBox height={'2rem'} />
      {publications !== undefined && publications.length > 0 && publications.map((publication, index) => <AdminPublication
        key={publication.title}
        index={index}
        publicationType={publication.publicationType}
        title={publication.title}
        authors={publication.authors}
        booktitle={publication.booktitle}
        ppText={publication.ppText}
        links={publication.links}
        year={publication.year}
        setPublicationDialogIsEdit={setPublicationDialogIsEdit}
        setPublicationDialogOpen={setPublicationDialogOpen}
        setPublicationDialogIndex={setPublicationDialogIndex}
        setPublicationType={setPublicationType}
        setBibText={setBibText}
        setAddedLinkTypes={setAddedLinkTypes}
        setAddedLinks={setAddedLinks}
        setYear={setYear}
      />)}

      <PublicationDialog
        open={publicationDialogOpen}
        setOpen={setPublicationDialogOpen}
        isEdit={publicationDialogIsEdit}
        index={publicationDialogIndex}
        fetchPublications={fetchPublications}
        publicationType={publicationType}
        setPublicationType={setPublicationType}
        bibText={bibText}
        setBibText={setBibText}
        addedLinkTypes={addedLinkTypes}
        setAddedLinkTypes={setAddedLinkTypes}
        addedLinks={addedLinks}
        setAddedLinks={setAddedLinks}
        year={year}
        setYear={setYear}
      />
    </SectionWrapper>
  )
}

export default AdminPublications
