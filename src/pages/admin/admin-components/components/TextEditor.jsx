import React from 'react'
import { Editor } from '../../../../sections'
import { DButton, SizedBox } from '../../../../components'

const TextEditor = ({ index, value, setValue, addText, addImages, removeText }) => {
    return (
        <div>
            <Editor value={value} setValue={setValue} />
            <SizedBox height={'8px'} />
            <div style={{ display: 'flex', position: 'relative', zIndex: 0 }}>
                <DButton onClick={addText}>Add Text</DButton>
                <SizedBox width={'8px'} />
                <DButton onClick={addImages}>Add Images</DButton>
                <SizedBox width={'8px'} />
                <DButton onClick={() => removeText(index)} variant='outlined' color='#444'>Remove Text</DButton>
            </div>
            <SizedBox height={'2rem'}/>
        </div>
    )
}

export default TextEditor
