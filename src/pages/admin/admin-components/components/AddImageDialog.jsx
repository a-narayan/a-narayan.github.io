import { Dialog, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import { DButton, DText, DTextField, SizedBox } from '../../../../components'

const AddImageDialog = ({ open, setOpen, index, addImage }) => {

    const [imageUrl, setImageUrl] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>
                <DText>Add Image</DText>
                <SizedBox height={'1rem'} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DTextField helperText={'Image URL'} value={imageUrl} onChange={(val) => setImageUrl(val)} />
                    <SizedBox width={'8px'} />
                    <DButton>Upload Image</DButton>
                </div>
                <SizedBox height={'1rem'} />
                <DButton fullWidth onClick={() => {
                    addImage(index, imageUrl);
                    setImageUrl('');
                    handleClose();
                }}>Add Image</DButton>
                <SizedBox height={'8px'} />
                <DButton fullWidth>Select from existing images</DButton>
            </DialogTitle>
        </Dialog>
    )
}

export default AddImageDialog
