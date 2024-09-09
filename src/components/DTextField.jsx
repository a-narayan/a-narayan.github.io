import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const DTextField = ({
  helperText,
  prefix,
  value,
  onChange,
  inputMode = 'text',
  maxWidth,
  isPassword = false,
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      onChange={(event) => {
        onChange(event.target.value);
      }}
      label={helperText}
      fullWidth
      inputMode={inputMode}
      type={inputMode === 'password' ? showPassword ? 'text' : 'password' : 'text'}
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position="start">{prefix}</InputAdornment>,
        endAdornment: isPassword && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: maxWidth }}
    />
  )
}

export default DTextField
