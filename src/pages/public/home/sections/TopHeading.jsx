import React from 'react'
import { SectionWrapper, SizedBox } from '../../../../components'
import { Typography } from '@mui/material'
import colors from '../../../../constants/colors'

const TopHeading = () => {
  return (
    <SectionWrapper>
      <SizedBox height={'1rem'} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="https://a-narayan.github.io/assets/img/favicon.ico" style={{ maxWidth: '40px', maxHeight: '40px' }} />
        <SizedBox width={'1rem'} />
        <Typography variant='h4' fontSize={'40px'} fontWeight={'bold'} sx={{ color: colors.dColor1 }}>Intelligent Data Science Lab</Typography>
      </div>
      <Typography variant='h5' color={colors.dColor2}>Empowering the next generation of Cyber Physical Systems through the power of Data and AI</Typography>
    </SectionWrapper>
  )
}

export default TopHeading
