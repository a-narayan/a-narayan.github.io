import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { closeMessageDialog, setMessageDialog } from '../features/messageDialog.js';

const MessageDialog = () => {
    const dispatch = useDispatch();
    const messageDialogData = useSelector((states) => states.messageDialog.value);

    const closeDialog = () => {
        dispatch(closeMessageDialog());
    };

    useEffect(() => {
        console.log(messageDialogData);
    });

    return (
        <div style={{ zIndex: 10 }}>
            <Dialog open={messageDialogData.isOpen} onClose={() => { closeDialog(); }}>
                {messageDialogData.messageTitle.length > 0 && <DialogTitle>{messageDialogData.messageTitle}</DialogTitle>}
                <DialogContent>
                    <Typography>{messageDialogData.messageText}</Typography>
                </DialogContent>
                <DialogActions>
                    {messageDialogData.hasPositiveButton && <Button onClick={messageDialogData.positiveButtonOnClick}>{messageDialogData.positiveButtonText}</Button>}
                    <Button onClick={closeDialog}>{messageDialogData.negativeButtonText}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MessageDialog
