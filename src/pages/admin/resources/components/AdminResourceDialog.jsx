import React, { useEffect, useState } from 'react'
import { DButton, DText, DTextField, SizedBox } from '../../../../components';
import { Dialog, DialogTitle } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { addDoc, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

const AdminResourceDialog = ({ open, handleClose, isEdit, id, title, authors, link, date, fetchResources }) => {

    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceAuthors, setResourceAuthors] = useState('');
    const [resourceLink, setResourceLink] = useState('');
    const [resourceDate, setResourceDate] = useState(dayjs(new Date()));
    const [updatedStates, setUpdatedStates] = useState(false);
    const showDialog = useAlerts('dialog');

    const handleSaveResource = async () => {
        if (isEdit) {
            await updateDoc(doc(db, 'resources', id), {
                authors: resourceAuthors,
                date: Timestamp.fromDate(resourceDate.toDate()),
                link: resourceLink,
                title: resourceTitle
            }).then(async () => {
                showDialog('', 'Resource updated succesfully!', 'Ok');
                // await fetchResources();
            }).catch(() => {
                showDialog('', 'An error occurred while updating the resource', 'Ok');
            });
        } else {
            await addDoc(collection(db, 'resources'), {
                authors: resourceAuthors,
                date: Timestamp.fromDate(resourceDate.toDate()),
                download: '-',
                link: resourceLink,
                title: resourceTitle
            }).then(async () => {
                showDialog('', 'Resource added succesfully!', 'Ok');
                // await fetchResources();
            }).catch(() => {
                showDialog('', 'An error occurred while adding the resource', 'Ok');
            });
            
        }
        handleClose();
    };

    useEffect(() => {
        if (isEdit && !updatedStates) {
            setResourceTitle(title);
            setResourceAuthors(authors);
            setResourceLink(link);
            setResourceDate(date);
            setUpdatedStates(true);
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                <DText variant='body1' weight='bold'>{isEdit ? 'Edit' : 'Add'} Resource</DText>
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Title'} value={resourceTitle} onChange={(val) => setResourceTitle(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Authors'} value={resourceAuthors} onChange={(val) => setResourceAuthors(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Link'} value={resourceLink} onChange={(val) => setResourceLink(val)} />
                <SizedBox height={'1rem'} />
                <DatePicker format='DD-MM-YYYY' value={resourceDate} onChange={(newValue) => setResourceDate(newValue)} />
                <SizedBox height={'1rem'} />
                <DButton fullWidth onClick={handleSaveResource}>Save</DButton>
            </DialogTitle>
        </Dialog>
    )
}

export default AdminResourceDialog
