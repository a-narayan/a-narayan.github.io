import { InputAdornment, TextField } from '@mui/material'
import React from 'react'

const DTextField = ({
  helperText,
  prefix,
  value,
  onChange,
  inputMode = 'text',
  maxWidth,
}) => {
  return (
    <TextField
      onChange={(event) => {
        onChange(event.target.value);
      }}
      label={helperText}
      fullWidth
      inputMode={inputMode}
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
      }}
      sx={{ maxWidth: maxWidth }}
    />
  )
}

export default DTextField
