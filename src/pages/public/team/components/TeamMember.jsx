import React from 'react'
import { DText, SizedBox } from '../../../../components'
import colors from '../../../../constants/colors'
import TeamMemberImage from './TeamMemberImage'
import { useNavigate } from 'react-router-dom'

const TeamMember = ({ id, imageLink, name, researchArea, coSupervisor, degree, description, emailId, yearJoined }) => {

    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
        }} onClick={() => {
            navigate(`/team/${id}`, {
                state: { id, imageLink, name, researchArea, coSupervisor, degree, description, emailId, yearJoined }
            });
        }}>
            <TeamMemberImage imageLink={imageLink} />
            <SizedBox width={'1rem'} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DText weight='bold' color={colors.dColor2}>{name}</DText>
                <DText>{researchArea}</DText>
            </div>
        </div>
    )
}

export default TeamMember
