import { Grid, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { DButton, SizedBox } from '../../../../components'
import AddImageDialog from './AddImageDialog';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageEditor = ({ index, links, addImage, removeImage, addText, addImages, removeImages }) => {

    const [hover, setHover] = useState(false);
    const [addImageDialogOpen, setAddImageDialogOpen] = useState(false);

    return (
        <div>
            <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {links !== undefined && links.length > 0 &&
                    links.map(link =>
                        <Grid item style={{ position: 'relative' }}>
                            <img src={link} style={{ width: '10rem', height: '10rem', objectFit: 'cover', borderRadius: '5px' }} />
                            <IconButton style={{
                                position: 'absolute',
                                display: 'block',
                                top: '16px',
                                right: '2px',
                                cursor: 'pointer'
                            }}
                                onClick={() => removeImage(index, link)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    )
                }
                <Grid item>
                    <div
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            width: '10rem',
                            height: '10rem',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '5px',
                            border: 'solid 1px #aaa',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            backgroundColor: hover ? '#eee' : '#fff'
                        }}
                        onClick={() => {
                            setAddImageDialogOpen(true);
                        }}>
                        Add Image
                    </div>
                </Grid>
            </Grid>
            <SizedBox height={'8px'} />
            <div style={{ display: 'flex' }}>
                <DButton onClick={addText}>Add Text</DButton>
                <SizedBox width={'8px'} />
                <DButton onClick={addImages}>Add Images</DButton>
                <SizedBox width={'8px'} />
                <DButton onClick={() => removeImages(index)} variant='outlined' color='#444'>Remove Images</DButton>
            </div>
            <SizedBox height={'2rem'} />

            <AddImageDialog open={addImageDialogOpen} setOpen={setAddImageDialogOpen} index={index} addImage={addImage} />
        </div>
    )
}

export default ImageEditor
