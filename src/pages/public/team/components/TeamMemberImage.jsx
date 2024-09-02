import React from 'react'

const TeamMemberImage = ({ imageLink, diameter = '100px' }) => {
    const link = 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';
    return (
        <img
            src={imageLink !== undefined && imageLink.length > 0 ? imageLink : link}
            style={{
                width: '100%',
                height: '100%',
                width: diameter,
                height: diameter,
                borderRadius: diameter,
                objectFit: 'cover'
            }}
        />
    )
}

export default TeamMemberImage
