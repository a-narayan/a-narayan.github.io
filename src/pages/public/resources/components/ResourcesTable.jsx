import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import colors from '../../../../constants/colors';

function createData(title, authors, date, download, link) {
    return { title, authors, date, download, link };
}

export default function ResourcesTable({ data }) {

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        const resources = [];
        data.forEach(resource => {
            resources.push(createData(resource.title, resource.authors, resource.date, resource.download, resource.link));
        });
        setRows(resources);
    }, []);

    return (
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}