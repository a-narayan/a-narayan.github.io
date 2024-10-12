import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DButton, DSelect, DText, DTextField, SizedBox } from '../../../../components';
import { parseBibTeX } from '../../../../utils/bibTexUtils';
import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';

const MultiplePublicationsDialog = ({
    open,
    setOpen,
    fetchPublications,
}) => {

    const [multiplePublicationsBibTex, setMultiiplePublicationsBibTex] = useState('');
    const [multiplePublications, setMultiplePublications] = useState([]);
    const [summaryString, setSummaryString] = useState('Total publications: 0');
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const savePublication = async () => {
        setIsLoading(true);
        if (multiplePublications.length > 0) {
            try {
                multiplePublications.forEach(async publication => {
                    const bib = parseBibTeX(publication.bibText);
                    if (bib.year !== undefined || bib.year !== null) {
                        const year = bib.year;
                        await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(doc(db, 'publications', year));
                            if (!sfDoc.exists()) {
                                transaction.set(doc(db, 'publications', year), {
                                    year: Number(year),
                                    publications: [publication]
                                });
                            } else {
                                let publications = [...sfDoc.data().publications];
                                publications.push(publication);
                                transaction.update(doc(db, 'publications', year), {
                                    publications: publications
                                })
                            }
                        });
                    }
                });
                setIsLoading(false);
                setOpen(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
            }
        }
        try {

            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    };

    const formatType = (type) => {
        switch (type.toLowerCase()) {
            case 'article':
                return 'Journal';
            case 'inproceedings':
                return 'Conference';
            case 'book':
                return 'Book';
            case 'techreport':
                return 'Technical Report';
            case 'mastersthesis':
                return 'Master’s Thesis';
            case 'phdthesis':
                return 'PhD Thesis';
            case 'misc':
                return 'Miscellaneous';
            default:
                return '';
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>{'Add Multiple Publications'}</DialogTitle>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <TextField
                    label="BibTeX"
                    multiline
                    rows={6}
                    value={multiplePublicationsBibTex}
                    onChange={(event) => {
                        setMultiiplePublicationsBibTex(event.target.value);
                        const entries = event.target.value.split('@').filter(entry => entry.trim() !== '');
                        const formattedEntries = entries.map(entry => {
                            const entryType = entry.split('{')[0].trim();
                            const fullEntry = '@' + entry.trim();
                            return { publicationType: formatType(entryType), bibText: fullEntry, links: {} };
                        });
                        setMultiplePublications(formattedEntries);
                        setSummaryString(`Total publications: ${formattedEntries.length}`);
                        console.log(formattedEntries);
                    }}
                />
                <SizedBox height={'1rem'} />
                <DText>{summaryString}</DText>
                <SizedBox height={'1rem'} />
                <DButton isLoading={isLoading} onClick={async () => {
                    await savePublication();
                    await fetchPublications();
                }}>Save</DButton>
            </div>
        </Dialog>
    )
}

export default MultiplePublicationsDialog
