import { Dialog, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DButton, DText, DTextField, SizedBox } from '../../../../components';
import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';

const MoveToAlumniDialog = ({ open, handleClose, id, degree, name }) => {

    const [alumniDegree, setAlumniDegree] = useState('');
    const [alumniName, setAlumniName] = useState('');
    const [positionAfterLeaving, setPositionAfterLeaving] = useState('');
    const [year, setYear] = useState(0);

    const markAsAlumni = async () => {
        try {
            await updateDoc(doc(db, 'team', id), {
                isAlumni: true,
            });
            await runTransaction(db, async (transaction) => {
                console.log('here...');
                console.log(year);
                const sfDoc = await transaction.get(doc(db, 'alumni', year.toString()));
                console.log(sfDoc);
                if (!sfDoc.exists()) {
                    transaction.set(doc(db, 'alumni', year.toString()), {
                        year,
                        alumnus: [{
                            degree: alumniDegree,
                            name: alumniName,
                            positionAfterLeaving
                        }]
                    });
                } else {
                    let alumnus = [...sfDoc.data().alumnus];
                    alumnus.push({
                        degree: alumniDegree,
                        name: alumniName,
                        positionAfterLeaving
                    });
                    transaction.update(doc(db, 'alumni', year), {
                        alumnus
                    })
                }
            });
            console.log("Transaction successfully committed!");
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    };

    useEffect(() => {
        setAlumniDegree(degree);
        setAlumniName(name);
        setYear(Number(new Date().getFullYear().toString()));
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                <DText variant='body1' weight='bold'>Mark as Alumni</DText>
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Name'} value={alumniName} onChange={(val) => setAlumniName(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Degree'} value={alumniDegree} onChange={(val) => setAlumniDegree(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Position after leaving'} value={positionAfterLeaving} onChange={(val) => setPositionAfterLeaving(val)} />
                <SizedBox height={'1rem'} />
                <DTextField helperText={'Year'} value={year} onChange={(val) => setYear(val)} />
                <SizedBox height={'1rem'} />
                <DButton fullWidth onClick={markAsAlumni}>Mark as Alumni</DButton>
            </DialogTitle>
        </Dialog>
    )
}

export default MoveToAlumniDialog
