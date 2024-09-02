import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import colors from '../../../../constants/colors';

function createData(name, calories, fat, backgroundColor, color) {
    return { name, calories, fat, backgroundColor, color };
}

export default function AlumniTable({ data }) {

    React.useEffect(() => {
        console.log('data');
        console.log(data);
    }, []);

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        const alumnus = [];
        let previousYear = 0;
        data.forEach(alumni => {
            if (alumni.year !== previousYear) {
                previousYear = alumni.year;
                alumnus.push(createData(alumni.year, '', '', '#eee', '#444'));
                alumnus.push(createData(alumni.name, alumni.degree, alumni.positionAfterLeaving, '#fff', colors.dColor2));
            } else {
                alumnus.push(createData(alumni.name, alumni.degree, alumni.positionAfterLeaving, '#fff', colors.dColor2));
            }
        });
        setRows(alumnus);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff' }}>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Degree</TableCell>
                        <TableCell align="right">Position After Leaving/Now At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row.backgroundColor }}
                        >
                            <TableCell component="th" scope="row" sx={{ color: row.color }}>
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}