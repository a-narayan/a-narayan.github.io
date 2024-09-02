import React, { useEffect, useState } from 'react'
import { DButton, DText, PublicationBanner, SizedBox } from '../../../../components'
import { parseBibTeX } from '../../../../utils/bibTexUtils';
import { useSelector } from 'react-redux';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import colors from '../../../../constants/colors';

const AdminPublication = ({
    index,
    publicationType,
    title,
    authors,
    booktitle,
    ppText,
    year,
    links,
    setPublicationDialogIsEdit,
    setPublicationDialogOpen,
    setPublicationDialogIndex,
    setPublicationType,
    setBibText,
    setAddedLinkTypes,
    setAddedLinks,
    setYear
}) => {

    const [localYear, setLocalYear] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const pubs = useSelector((states) => states.publications.value);

    const handleDeletePublication = async () => {
        await runTransaction(db, async (transaction) => {
            console.log(year);
            const sfDoc = await transaction.get(doc(db, 'publications', localYear));
            console.log(sfDoc.data);
            if (!sfDoc.exists()) {
                console.log('document does not exist');
                return;
            }
            let publications = [...sfDoc.data().publications];

            publications.splice(index, 1);
            console.log(publications);
            transaction.update(doc(db, 'publications', localYear), {
                publications: publications
            });
        });
        console.log("Transaction successfully committed!");
    };

    useEffect(() => {
        const bib = parseBibTeX(pubs[index].bibText);
        if (bib.year !== undefined || bib.year !== null) {
            setLocalYear(bib.year);
        }
    });

    return (
        <div>
            <PublicationBanner
                index={pubs.length - index}
                publicationType={publicationType}
                title={title}
                authors={authors}
                booktitle={booktitle}
                ppText={ppText}
                links={links}
            />
            <div style={{ display: 'flex' }}>
                <DButton onClick={() => {
                    setPublicationDialogIndex(index);
                    setPublicationDialogIsEdit(true);
                    setPublicationDialogOpen(true);

                    try {
                        const publication = pubs[index];
                        setPublicationType(publication.publicationType);
                        setBibText(publication.bibText);
                        setAddedLinkTypes(Object.keys(publication.links));
                        setAddedLinks(Object.values(publication.links));
                        setYear(localYear);
                    } catch (err) {
                        console.log(err);
                    }
                }}>Edit</DButton>
                <SizedBox width={'1rem'} />
                <DButton variant='outlined' color='red' onClick={async () => {
                    setDeleteDialogOpen(true);
                }}>Delete</DButton>
            </div>
            <SizedBox height={'2rem'} />

            <Dialog open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); }}>
                <DialogTitle>
                    <DText>Are you sure you want to delete this publication?</DText>
                </DialogTitle>
                <DialogActions>
                    <DButton variant='text' color={colors.dColor3} onClick={handleDeletePublication}>Yes</DButton>
                    <DButton variant='text' color={colors.dColor3} onClick={() => {
                        setDeleteDialogOpen(false);
                    }}>Cancel</DButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminPublication
