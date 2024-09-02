import React, { useEffect, useState } from 'react'
import { DButton, DText, DTextField, SectionWrapper, SizedBox } from '../../../components'
import TextEditor from './components/TextEditor';
import ImageEditor from './components/ImageEditor';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-setup/firebase';
import { useAlerts } from '../../../hooks/useAlerts';

const WebsiteEditor = ({ data, setData, handleSaveData }) => {

    const addText = (index) => {
        const newData = [...data];
        newData.splice(index, 0, {
            type: 'html',
            content: ''
        })
        setData(newData);
    };

    const addImages = (index) => {
        const newData = [...data];
        newData.splice(index, 0, {
            type: 'image',
            links: []
        })
        setData(newData);
    };

    const removeElement = (index) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const updateHtml = (index, html) => {
        let newData = [...data];
        newData[index].content = html;
        setData(newData);
    };

    const addImage = (index, imageUrl) => {
        const newData = [...data];
        newData[index].links.push(imageUrl);
        setData(newData);
    }

    const removeImage = (index, imageUrl) => {
        const newData = [...data];
        const idx = newData[index].links.indexOf(imageUrl);
        if (idx > -1) {
            newData[index].links.splice(idx, 1);
            setData(newData);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <DButton onClick={addText}>Add Text</DButton>
                <SizedBox width={'8px'} />
                <DButton onClick={addImages}>Add Images</DButton>
            </div>
            <SizedBox height={'2rem'} />
            {data.map((item, index) =>
                item.type === 'html' ?
                    <TextEditor index={index} value={item.content} setValue={(value) => updateHtml(index, value)} addText={() => addText(index + 1)} addImages={() => addImages(index + 1)} removeText={removeElement} />
                    :
                    <ImageEditor index={index} links={item.links} addImage={addImage} removeImage={removeImage} addText={() => addText(index + 1)} addImages={() => addImages(index + 1)} removeImages={removeElement} />
            )}
            <SizedBox height={'2rem'} />
            {data.length > 0 &&
                <DButton fullWidth onClick={handleSaveData}>Save</DButton>
            }
        </div>
    )
}

export default WebsiteEditor
