import React, { Fragment, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import Nav from '../components/Nav'
import DateUtil from '../utils/dateutil'
import { Redirect, Link } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery } from '../graphql/queries'
import { CreateNote } from '../graphql/mutations'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Divider,
    IconButton,
    InputBase
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { ModalDialog } from '../components/Dialog'



const useStyles = makeStyles(theme => ({
    table: {
        display: 'block',
        width: '100%',
        overflowX: 'auto'
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'right',
        width: '100%'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
    },
    iconButton: {
        padding: 10
    },
    divider: {
        height: 28,
        margin: 4
    }
}))

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
}))(TableCell)

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow)

export default function UsersList() {
    const classes = useStyles()
    const limit = 50
    const [offset, setOffSet] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
    const { loading, error, data, refetch } = useQuery(UsersQuery, {
        variables: { limit, offset }
    })

    const [page, setPage] = React.useState(0)
    const [note, setNote] = useState('')
    const [userId, setId] = useState('')
    const [userName, setName] = useState('')

    const [rowsPerPage, setRowsPerPage] = React.useState(5)

    const handleChangePage = (event, newPage) => {

        if (data.users.length > offset) {
            setOffSet(limit + offset)
        }
        setPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value)
        if (rowsPerPage > limit) {
            setOffSet(limit + offset);
        }
        setPage(0)
    }

    //Creates new note and updates the tables
    function handleClick() {
        noteCreate({
            variables: { userId, body: note, flagged: false }
        }).then(() => {
            refetch()
            setIsDialogOpen(!isDialogOpen)
            setNote('')
        })
    }

    function handleModal(userId = '', username = '') {
        // setModalAction('Create Note')
        setId(userId)
        setName(username)
        setIsDialogOpen(!isDialogOpen)
    }

    function inputToSearch() {
        setRedirect('/search')
    }

    if (loading) return <Loading />
    if (error) return <ErrorPage error={error.message} />

    if (redirect) {
        return (
            <Redirect
                push
                to={{
                    pathname: redirect,
                    state: { from: '/users' }
                }}
            />
        )
    }
    return (
        <Fragment>
            <Nav navName="Users" menuButton="back" />
            <div className="container">
                <ModalDialog
                    handleClose={handleModal}
                    handleConfirm={handleClick}
                    open={isDialogOpen}
                >
                    <div className="form-group">
                        <h6>
                            Add note for <strong>{userName}</strong>{' '}
                        </h6>
                        <input
                            className="form-control"
                            type="text"
                            value={note}
                            onChange={event => setNote(event.target.value)}
                            name="note"
                            placeholder="Type action note here"
                        />
                        {mutationLoading && <p className="text-center">Saving note ...</p>}
                    </div>
                </ModalDialog>

                <div className={classes.root}>
                    <Fragment>
                        <InputBase
                            className={classes.input}
                            type="text"
                            placeholder="Search User"
                            onFocus={inputToSearch}
                            inputProps={{ 'aria-label': 'search User' }}
                        />
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton
                            type="submit"
                            className={classes.iconButton}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Fragment>
                </div>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Role</StyledTableCell>
                            <StyledTableCell align="right">Phone Number</StyledTableCell>
                            <StyledTableCell align="right">Email</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell>
                            <StyledTableCell align="right">Note</StyledTableCell>
                            <StyledTableCell align="right">Add Note</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>


                        {data.users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                            <StyledTableRow key={user.id}>

                                <StyledTableCell component="th" scope="row">
                                    <Link to={`/user/${user.id}`}
                                        key={user.id}> {user.name} </Link>
                                </StyledTableCell>

                                <StyledTableCell align="right">{user.roleName}</StyledTableCell>
                                <StyledTableCell align="right">
                                    {user.phoneNumber || 'None'}
                                </StyledTableCell>
                                <StyledTableCell align="right">{user.email}</StyledTableCell>
                                <StyledTableCell align="right">
                                    {user.notes[0]
                                        ? DateUtil.formatDate(user.notes[0].createdAt)
                                        : 'N/A'}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {user.notes[0] ? user.notes[0].body : 'None'}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Button
                                        color="secondary"
                                        onClick={() => handleModal(user.id, user.name)}
                                    >
                                        +
                  </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={data.users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </Fragment>
    )
}
