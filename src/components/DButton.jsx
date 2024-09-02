import { Button } from '@mui/material'
import React from 'react'
import colors from '../constants/colors'

const DButton = ({
  children,
  onClick,
  variant = 'contained',
  isLoading = false,
  fullWidth = false,
  fontSize = '16px',
  padding = undefined,
  backgroundColor = colors.dColor3,
  color = '#fff',
}) => {
  return (
    <Button
      variant={variant}
      disableElevation
      onClick={onClick}
      fullWidth={fullWidth}
      disabled={isLoading}
      sx={{
        p: padding,
        textTransform: 'none',
        fontSize: fontSize,
        backgroundColor: variant === 'contained' ? backgroundColor : 'white',
        color: color,
        borderRadius: '10px',
        border: variant === 'outlined' && `1px ${colors.dColor4} solid`,
        ':hover': {
          backgroundColor: variant === 'outlined' ? '' : '#eee',
          color: '#444',
        }
      }}
    >
      {children}
    </Button>
  )
}

export default DButton
