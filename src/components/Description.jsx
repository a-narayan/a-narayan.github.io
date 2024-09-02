import React from 'react';
import Point from '@mui/icons-material/Circle';
import DText from './DText';
import SizedBox from './SizedBox';

const Description = ({ heading, data }) => {

    return (
        <div>
            <DText variant='subHeading'>{heading}</DText>
            <SizedBox height={'1.2rem'} />
            {data !== undefined && data.map((item, _) =>
                Array.isArray(item) ? item.map((item2, _) =>
                (
                    <div style={{ display: 'flex' }}>
                        <Point sx={{ scale: '0.3', color: '#444' }} />
                        <DText>{`${item2}`}</DText>
                    </div>
                )) :
                    (
                        <div>
                            <DText>{item}</DText>
                            <SizedBox height={'1rem'} />
                        </div>

                    ))}
        </div>
    )
}

export default Description
