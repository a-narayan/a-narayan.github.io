import React, { useEffect } from 'react'
import { DText, SectionWrapper, SizedBox } from '../../../components'
import { Grid } from '@mui/material';
import AdminDashboardButton from './components/AdminDashboardButton';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {

    const params = useParams();
    const navigate = useNavigate();
    const userData = useSelector((states) => states.user.value);
    const pages = ['Home', 'Publications', 'News', 'Team', 'Research', 'Resources', 'Opportunities'];
    const paths = [
        `/admin/${userData.id}/home`,
        `/admin/${userData.id}/publications`,
        `/admin/${userData.id}/news`,
        `/admin/${userData.id}/team`,
        `/admin/${userData.id}/research`,
        `/admin/${userData.id}/resources`,
        `/admin/${userData.id}/opportunities`,
    ]

    useEffect(() => {
        // if (userData.id !== params.userId || userData.userType !== 'admin' || !userData.isLoggedIn) {
        //     navigate('/login');
        // }
    });

    return (
        <SectionWrapper showBottomLine={false}>
            <DText variant='heading'>Dashboard</DText>
            <SizedBox height={'2rem'} />
            <Grid container spacing={2}>
                {pages.map((page, index) =>
                    <Grid
                        key={page}
                        item
                        xs={6} sm={4} md={3}
                    >
                        <AdminDashboardButton
                            onClick={() => {
                                navigate(paths[index]);
                            }}
                        >
                            {page}
                        </AdminDashboardButton>
                    </Grid>)}
            </Grid>
            <SizedBox height={'2rem'} />
        </SectionWrapper>
    )
}

export default AdminDashboard
