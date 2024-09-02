import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PageWrapper = ({ children }) => {

    const userData = useSelector((states) => states.user.value);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData.isLoggedIn) {
            navigate('/login');
        }
    });

    return (
        <div>{children}</div>
    )
}

export default PageWrapper
