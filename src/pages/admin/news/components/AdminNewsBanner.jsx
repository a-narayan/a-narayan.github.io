import React, { useState } from 'react'
import { DButton, DText, NewsArticleBanner, SizedBox } from '../../../../components'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import colors from '../../../../constants/colors';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';

const AdminNewsBanner = ({ id, index, title, subtitle, date, content, userData }) => {

    const navigate = useNavigate();
    const [deleteNewsDialogOpen, setDeleteNewsDialogOpen] = useState(false);

    const deleteNews = async () => {
        await deleteDoc(doc(db, 'news', id)).catch(err => { console.log(err) });
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setDeleteNewsDialogOpen(false);
    };

    return (
        <div>
            <NewsArticleBanner
                id={id}
                index={index}
                title={title}
                subtitle={subtitle}
                date={date}
                content={content}
            />
            <div style={{ display: 'flex' }}>
                <DButton onClick={() => {
                    navigate(`/admin/${userData.id}/news/${id}`, {
                        state: {
                            id,
                            index,
                            title,
                            subtitle,
                            date,
                            content,
                        }
                    });
                }}>Edit</DButton>
                <SizedBox width={'8px'} />
                <DButton variant='outlined' color='red' onClick={() => {
                    setDeleteNewsDialogOpen(true);
                }}>Delete</DButton>
            </div>
            <SizedBox height={'2rem'} />
            <Dialog open={deleteNewsDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>
                    <DText>Are you sure you want to delete this news?</DText>
                </DialogTitle>
                <DialogActions sx={{ display: 'flex' }}>
                    <DButton variant='text' color={colors.dColor3} onClick={deleteNews}>Yes</DButton>
                    <DButton variant='text' color={colors.dColor3} onClick={handleCloseDialog}>Cancel</DButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminNewsBanner
