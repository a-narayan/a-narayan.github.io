import React from 'react'
import { DButton } from '../../../../components'

const AdminDashboardButton = ({ children, onClick }) => {
    return (
        <DButton
            fullWidth
            padding={'2rem 0 2rem 0'}
            fontSize='18px'
            onClick={onClick}
        >
            {children}
        </DButton>
    )
}

export default AdminDashboardButton
