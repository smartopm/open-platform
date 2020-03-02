import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import Nav from '../components/Nav'
import DateUtil from '../utils/dateutil'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery } from '../graphql/queries'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table'
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';


const useStyles = makeStyles({
    table: {
        minWidth: 500
    }
});
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#25c0b0',
        color: theme.palette.common.white,
        fontSize: 15,
        textAlign: 'center'
    },
    body: {
        fontSize: 14,
        textAlign: 'center'
    }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow);

export default function UsersList() {
    const classes = useStyles();
    const { loading, error, data } = useQuery(UsersQuery)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = event => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />

    return (
        <Fragment>
            <Nav navName='Users' menuButton='back' />

            <div className="container">


                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Role</StyledTableCell>
                            <StyledTableCell align="right">Phone Number</StyledTableCell>
                            <StyledTableCell align="right">Email</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell>
                            <StyledTableCell align="right">Note</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.users.map(user => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell component="th" scope="row">
                                    {user.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">{user.roleName}</StyledTableCell>
                                <StyledTableCell align="right">{user.phoneNumber || "None"}</StyledTableCell>
                                <StyledTableCell align="right">{user.email}</StyledTableCell>
                                <StyledTableCell align="right">{user.notes[0] ? DateUtil.formatDate(user.notes[0].createdAt) : "N/A"}</StyledTableCell>
                                <StyledTableCell align="right">{user.notes[0] ? user.notes[0].body : "None"}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5,10, 25, 50, 100]}
                    component="div"
                    count={data.users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />


            </div>
        </Fragment >
    )
}

