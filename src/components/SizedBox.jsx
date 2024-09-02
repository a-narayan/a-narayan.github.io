import React from 'react';

const SizedBox = ({ width, height, backgroundColor }) => {
  return (
    <div style={{ width: width, height: height, backgroundColor: backgroundColor !== undefined ? backgroundColor : 'transparent' }}></div>
  )
}

export default SizedBox
