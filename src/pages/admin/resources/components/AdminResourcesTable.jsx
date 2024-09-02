import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import colors from '../../../../constants/colors';
import { DButton, DText, DTextField, SizedBox } from '../../../../components';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import AdminResourceDialog from './AdminResourceDialog';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase-setup/firebase';
import { useAlerts } from '../../../../hooks/useAlerts';

function createData(id, title, authors, date, download, link) {
    return { id, title, authors, date, download, link };
}

export default function AdminResourcesTable({ data, fetchResources }) {

    const [rows, setRows] = React.useState([]);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const showDialog = useAlerts('dialog');

    const [id, setId] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [authors, setAuthors] = React.useState('');
    const [link, setLink] = React.useState('');
    const [date, setDate] = React.useState(dayjs(new Date()));
    const [isEdit, setIsEdit] = React.useState(false);

    const handleDeleteResource = async (docId) => {
        await deleteDoc(doc(db, 'resources', docId)).then(() => {
            showDialog('', 'Resource deleted successfully!', 'Ok');
        }).catch(err => {
            showDialog('', 'An error occurred while deleting the resource', 'Ok');
        });
        // await fetchResources();
    };

    React.useEffect(() => {
        const resources = [];
        data.forEach(resource => {
            resources.push(createData(resource.id, resource.title, resource.authors, resource.date, resource.download, resource.link));
        });
        setRows(resources);
    }, []);

    return (
        <div>
            <DButton onClick={() => {
                setIsEdit(false);
                setDialogOpen(true);
            }}>Add Resource</DButton>
            <SizedBox height={'2rem'} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#fff' }}>
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Author(s)</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Download</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.title}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ color: colors.dColor2 }}>
                                    {row.title}
                                </TableCell>
                                <TableCell align="right">{row.authors}</TableCell>
                                <TableCell align="right">{row.date}</TableCell>
                                <TableCell align="right">{row.download}</TableCell>
                                <TableCell align="right">
                                    <DButton onClick={() => {
                                        setId(row.id);
                                        setTitle(row.title);
                                        setAuthors(row.authors);
                                        setDate(dayjs(Date.parse(row.date)));
                                        setLink(row.link);
                                        setIsEdit(true);
                                        setDialogOpen(true);
                                    }}>Edit</DButton>
                                </TableCell>
                                <TableCell align="right">
                                    <DButton variant='outlined' color='red' onClick={() => handleDeleteResource(row.id)}>Delete</DButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {dialogOpen && <AdminResourceDialog
                    open={dialogOpen}
                    handleClose={() => setDialogOpen(false)}
                    isEdit={isEdit}
                    id={id}
                    title={title}
                    authors={authors}
                    link={link}
                    date={date}
                    fetchResources={fetchResources}
                />}
            </TableContainer>
        </div>
    );
}