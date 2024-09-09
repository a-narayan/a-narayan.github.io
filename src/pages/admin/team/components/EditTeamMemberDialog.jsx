import React, { useEffect, useState } from 'react';
import { DButton, DSelect, DText, DTextField, SizedBox } from '../../../../components'
import { Dialog, DialogTitle } from '@mui/material'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';
import { hashPassword } from '../../../../utils/encryptionUtils';
import MoveToAlumniDialog from './MoveToAlumniDialog';

const EditTeamMemberDialog = ({ dialogOpen, handleDialogClose, isEdit, id, imageLink, name, researchArea, coSupervisor, degree, description, emailId, yearJoined, currentPassword }) => {

    const showDialog = useAlerts('dialog');
    const [updatedData, setUpdatedData] = useState(false);
    const [memberId, setMemberId] = useState('');
    const [memberImageLink, setMemberImageLink] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberResearchArea, setMemberResearchArea] = useState('');
    const [memberCoSupervisor, setMemberCoSupervisor] = useState('');
    const [memberDegree, setMemberDegree] = useState('');
    const [memberDescription, setMemberDescription] = useState('');
    const [memberEmailId, setMemberEmailId] = useState('');
    const [memberYearJoined, setMemberYearJoined] = useState('');
    const [password, setPassword] = useState('');
    const degrees = ['Research Associate', 'Postdoc', 'PhD', 'MASc', 'MSc', 'MEng', 'Undergraduate'];

    const [MoveToAlumniDialogOpen, setMoveToAlumniDialogOpen] = useState(false);
    const handleMoveToAlumniDialogClose = () => {
        setMoveToAlumniDialogOpen(false);
    };

    const saveMemberDetails = async () => {
        if (isEdit) {
            const encryptedPassword = await hashPassword(password);
            await updateDoc(doc(db, 'team', id), {
                imageUrl: memberImageLink,
                name: memberName,
                researchArea: memberResearchArea,
                coSupervisor: memberCoSupervisor,
                degree: memberDegree,
                description: memberDescription,
                emailId: memberEmailId,
                yearJoined: memberYearJoined,
                password: password.length > 0 ? encryptedPassword : currentPassword,
                userType: 'student',
            }).then(() => {
                showDialog('', 'Details updated succesfully', 'Ok');
                handleDialogClose();
            }).catch(err => {
                showDialog('', 'An error occurred while updating details', 'Ok');
            });
        } else {
            if (memberEmailId.length > 0 && password.length > 0 && memberDegree.length > 0) {
                const encryptedPassword = await hashPassword(password);
                await addDoc(collection(db, 'team'), {
                    imageUrl: memberImageLink,
                    name: memberName,
                    researchArea: memberResearchArea,
                    coSupervisor: memberCoSupervisor,
                    degree: memberDegree,
                    description: memberDescription,
                    emailId: memberEmailId,
                    yearJoined: memberYearJoined,
                    password: encryptedPassword,
                    userType: 'student',
                    isAlumni: false,
                }).then(() => {
                    showDialog('', 'New Member added succesfully', 'Ok');
                    handleDialogClose();
                }).catch(err => {
                    showDialog('', 'An error occurred while adding new member', 'Ok');
                });
            } else {
                showDialog('', 'Please enter the email ID, password and degree', 'Ok');
            }

        }
    };

    useEffect(() => {
        if (isEdit && !updatedData) {
            setMemberId(id);
            setMemberImageLink(imageLink);
            setMemberName(name);
            setMemberResearchArea(researchArea);
            setMemberCoSupervisor(coSupervisor);
            setMemberDegree(degree);
            setMemberDescription(description);
            setMemberEmailId(emailId);
            setMemberYearJoined(yearJoined);
            setUpdatedData(true);
        }
    });

    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
            <DialogTitle>
                <DText variant='body1' weight='bold'>{isEdit ? 'Edit Details' : 'Add New Student'}</DText>
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Email ID'} value={memberEmailId} onChange={(val) => setMemberEmailId(val)} />
                <SizedBox height={'1rem'} />
                {!isEdit && <div>
                    <DTextField
                        helperText={'Password'}
                        value={password}
                        onChange={(val) => setPassword(val)}
                        inputMode='password'
                        isPassword={true}
                    />
                    <SizedBox height={'1rem'} />
                </div>}

                <DSelect label={'Degree'} values={degrees} selectedValue={memberDegree} onChange={(val) => setMemberDegree(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Name' : 'Name (Optional)'} value={memberName} onChange={(val) => setMemberName(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Image URL' : 'Image URL (Optional)'} value={memberImageLink} onChange={(val) => setMemberImageLink(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Research Area' : 'Research Area (Optional)'} value={memberResearchArea} onChange={(val) => setMemberResearchArea(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Description' : 'Description (Optional)'} value={memberDescription} onChange={(val) => setMemberDescription(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Co-supervisor(s)' : 'Co-supervisor(s) (Optional)'} value={memberCoSupervisor} onChange={(val) => setMemberCoSupervisor(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={isEdit ? 'Year Joined' : 'Year Joined (Optional)'} value={memberYearJoined} onChange={(val) => setMemberYearJoined(val)} />
                <SizedBox height={'1rem'} />
                {isEdit && <div>
                    <DText variant='body1' weight='bold'>Reset Password</DText>
                    <SizedBox height={'1rem'} />
                    <DTextField
                        helperText={'New Password'}
                        value={password}
                        onChange={(val) => setPassword(val)}
                        inputMode='password'
                        isPassword={true}
                    />
                    <SizedBox height={'1rem'} />
                </div>}
                <DButton fullWidth onClick={saveMemberDetails}>Save</DButton>
                <SizedBox height={'1rem'} />
                <DButton fullWidth variant='outlined' color='red' onClick={() => setMoveToAlumniDialogOpen(true)}>Mark as alumni</DButton>
            </DialogTitle>

            <MoveToAlumniDialog
                open={MoveToAlumniDialogOpen}
                handleClose={handleMoveToAlumniDialogClose}
                id={id}
                degree={memberDegree}
                name={memberName}
            />
        </Dialog>
    )
}

export default EditTeamMemberDialog
