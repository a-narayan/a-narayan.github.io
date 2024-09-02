import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DButton, DSelect, DText, DTextField, SizedBox } from '../../../../components';
import { parseBibTeX } from '../../../../utils/bibTexUtils';
import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useSelector } from 'react-redux';

const PublicationDialog = ({
    open,
    setOpen,
    isEdit,
    index,
    fetchPublications,
    publicationType,
    setPublicationType,
    bibText,
    setBibText,
    addedLinkTypes,
    setAddedLinkTypes,
    addedLinks,
    setAddedLinks,
    year,
    setYear
}) => {


    const publicationTypes = ['Conference', 'Journal', 'Patent'];
    const linkTypes = ['PDF', 'Slides', 'Bib', 'Video', 'Thesis', 'Code', 'Poster', 'Supplementary Info'];

    const handleClose = () => {
        setOpen(false);
    };

    const savePublication = async () => {
        const links = {};
        for (var i = 0; i < addedLinks.length; i++) {
            links[addedLinkTypes[i]] = addedLinks[i];
        }
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(doc(db, 'publications', year));
                if (!sfDoc.exists()) {
                    transaction.set(doc(db, 'publications', year), {
                        year: Number(year),
                        publications: [{
                            publicationType,
                            bibText,
                            links,
                        }]
                    });
                } else {
                    let publications = [...sfDoc.data().publications];
                    console.log(publications);
                    if (isEdit) {
                        publications[index] = {
                            publicationType,
                            bibText,
                            links,
                        };
                    } else {
                        // if the order is reversed then first reverse publications, then push the new publication and then reverse publications again
                        publications.push({
                            publicationType,
                            bibText,
                            links,
                        });
                    }
                    console.log(index);
                    console.log(publications);
                    transaction.update(doc(db, 'publications', year), {
                        publications: publications
                    })
                }
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>{isEdit ? 'Edit Publication' : 'Add New Publication'}</DialogTitle>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <DSelect
                    label={'Publication Type'}
                    values={publicationTypes}
                    selectedValue={publicationType}
                    onChange={(val) => {
                        setPublicationType(val);
                    }}
                />
                <SizedBox height={'1rem'} />
                <TextField
                    label="BibTeX"
                    multiline
                    rows={4}
                    value={bibText}
                    onChange={(event) => {
                        setBibText(event.target.value);
                        try {
                            const bib = parseBibTeX(event.target.value);
                            if (bib.year !== undefined || bib.year !== null) {
                                setYear(bib.year);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }}
                />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Year'} inputMode='numeric' value={year} onChange={(val) => { setYear(val) }} />

                <SizedBox height={'1rem'} />
                <DText variant='body1' weight='bold'>Links</DText>
                <SizedBox height={'1rem'} />
                {addedLinkTypes.map((type, idx) =>
                    <div key={type}>
                        <div style={{ display: 'flex' }}>
                            <DSelect
                                key={idx}
                                label={'Link to'}
                                values={linkTypes}
                                selectedValue={type}
                                onChange={(val) => {
                                    let currentTypes = [...addedLinkTypes];
                                    currentTypes[idx] = val;
                                    setAddedLinkTypes(currentTypes);
                                }}
                            />
                            <SizedBox width={'8px'} />
                            <DButton variant='outlined' color='red' onClick={() => {
                                const currentAddedTypes = [...addedLinkTypes];
                                const currentAddedLinks = [...addedLinks];
                                currentAddedTypes.splice(idx, 1);
                                currentAddedLinks.splice(idx, 1);
                                setAddedLinkTypes(currentAddedTypes);
                                setAddedLinks(currentAddedLinks);
                            }}>Remove Link</DButton>
                        </div>
                        <SizedBox height={'1rem'} />
                        <DTextField
                            helperText={'Link'}
                            value={addedLinks[idx]}
                            onChange={(val) => {
                                const currentAddedLinks = [...addedLinks];
                                currentAddedLinks[idx] = val;
                                setAddedLinks(currentAddedLinks);
                            }}
                        />
                        <SizedBox height={'1rem'} />
                    </div>
                )}
                <SizedBox height={'0.5rem'} />
                <DButton onClick={() => {
                    const currentAddedTypes = [...addedLinkTypes];
                    const currentAddedLinks = [...addedLinks];
                    currentAddedTypes.push('');
                    currentAddedLinks.push('')
                    setAddedLinkTypes(currentAddedTypes);
                    setAddedLinks(currentAddedLinks);
                }}>Add Link</DButton>
                <SizedBox height={'1rem'} />
                <DButton onClick={async () => {
                    await savePublication();
                    await fetchPublications();
                }}>Save</DButton>
            </div>
        </Dialog>
    )
}

export default PublicationDialog
