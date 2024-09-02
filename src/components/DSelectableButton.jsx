import { Button } from '@mui/material'
import React from 'react'
import colors from '../constants/colors'

const DSelectableButton = ({
    children,
    onClick = () => { },
    isSelected = false,
}) => {
    return (
        <Button
            variant={isSelected ? 'contained' : 'outlined'}
            disableElevation
            onClick={onClick}
            sx={{
                padding: '0.6rem 3rem 0.6rem 3rem',
                textTransform: 'none',
                fontSize: '16px',
                backgroundColor: isSelected ? colors.dColor3 : 'white',
                color: colors.dColor1,
                borderColor: colors.dColor3,
                ':hover': {
                    backgroundColor: colors.dColor3,
                    borderColor: colors.dColor3,
                }
            }}
        >{children}</Button>
    )
}

export default DSelectableButton
