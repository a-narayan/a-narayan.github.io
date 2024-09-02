import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'

const DSelect = ({ label, values, selectedValue, onChange, fullWidth = true }) => {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    label={label}
                    fullWidth={fullWidth}
                    onChange={(event) => {onChange(event.target.value);}}
                >
                    {values.map(element => <MenuItem key={element} value={element}>{element}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
}

export default DSelect
