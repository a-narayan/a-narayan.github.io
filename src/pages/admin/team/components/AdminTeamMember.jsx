import React, { useState } from 'react'
import TeamMember from '../../../public/team/components/TeamMember'
import { DButton, DText, DTextField, SizedBox } from '../../../../components'
import { Dialog, DialogActions, DialogTitle } from '@mui/material'
import EditTeamMemberDialog from './EditTeamMemberDialog'
import colors from '../../../../constants/colors'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../../firebase-setup/firebase'
import { useAlerts } from '../../../../hooks/useAlerts'

const AdminTeamMember = ({ id, imageLink, name, researchArea, coSupervisor, degree, description, emailId, yearJoined, password }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const showDialog = useAlerts('dialog');

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleRemoveDialogClose = () => {
        setRemoveDialogOpen(false);
    };

    const handleRemoveStudent = async () => {
        await deleteDoc(doc(db, 'team', id)).then(() => {
            showDialog('', 'Removed the student successfully!', 'Ok');
            handleRemoveDialogClose();
        }).catch(err => {
            showDialog('', 'An error occurred while removing the student', 'Ok');
        });
    };

    return (
        <div>
            <TeamMember
                id={id}
                imageLink={imageLink}
                name={name}
                researchArea={researchArea}
                coSupervisor={coSupervisor}
                degree={degree}
                description={description}
                emailId={emailId}
                yearJoined={yearJoined}
            />
            <SizedBox height={'8px'} />
            <div style={{ display: 'flex' }}>
                <DButton onClick={() => {
                    setDialogOpen(true);
                }}>Edit</DButton>
                <SizedBox width={'8px'} />
                <DButton variant='outlined' color='red' onClick={() => {
                    setRemoveDialogOpen(true);
                }}>Remove</DButton>
            </div>

            {dialogOpen && <EditTeamMemberDialog
                dialogOpen={dialogOpen}
                handleDialogClose={handleDialogClose}
                isEdit={true}
                id={id}
                imageLink={imageLink}
                name={name}
                researchArea={researchArea}
                coSupervisor={coSupervisor}
                degree={degree}
                description={description}
                emailId={emailId}
                yearJoined={yearJoined}
                currentPassword={password}
            />}

            <Dialog open={removeDialogOpen} onClose={handleRemoveDialogClose}>
                <DialogTitle>
                    <DText>Are you sure you want to remove {name} from the students list?</DText>
                </DialogTitle>
                <DialogActions>
                    <DButton variant='text' color={colors.dColor3} onClick={handleRemoveStudent}>Yes</DButton>
                    <DButton variant='text' color={colors.dColor3} onClick={handleRemoveDialogClose}>Cancel</DButton>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminTeamMember
