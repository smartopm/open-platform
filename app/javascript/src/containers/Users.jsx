import React, { Fragment, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import Nav from '../components/Nav'
import DateUtil from '../utils/dateutil'
import { Redirect, Link } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery } from '../graphql/queries'
import { CreateNote } from '../graphql/mutations'
import { makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Button,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Grid,
  FormControl,
  InputLabel,
  Input,
  Chip
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { ModalDialog } from '../components/Dialog'
import {
  StyledTableRow,
  StyledTableCell
} from '../components/TimeTracker/DataTable'
import { userType } from '../utils/constants'
import Paginate from '../components/Paginate'

export const useStyles = makeStyles(theme => ({
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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  }
}))

const limit = 50

export default function UsersList() {
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [type, setType] = useState([])
  const [offset, setOffset] = useState(0)

  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const { loading, error, data, refetch } = useQuery(UsersQuery, {
    variables: {
      userType: type.join(' OR '),
      limit,
      offset
    },
    fetchPolicy: 'cache-and-network'
  })

  const [note, setNote] = useState('')
  const [userId, setId] = useState('')
  const [userName, setName] = useState('')

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
    setId(userId)
    setName(username)
    setIsDialogOpen(!isDialogOpen)
  }

  function inputToSearch() {
    setRedirect('/search')
  }
  function handleInputChange(event) {
    setType(event.target.value)
  }
  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else {
      setOffset(offset + limit)
    }
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
      <Nav navName="Users" menuButton="back" backTo="/" />
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

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-chip-label">Filter by Role</InputLabel>
          <Select
            labelId="select-by-role"
            id="role-chip"
            multiple
            value={type}
            onChange={handleInputChange}
            input={<Input id="select-by-role" />}
            renderValue={selected => (
              <div>
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            {Object.entries(userType).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <br />
        <br />

        <Table stickyHeader className={classes.table} aria-label="user table">
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
            {data.users.map(user => (
              <StyledTableRow key={user.id}>
                <StyledTableCell component="th" scope="row">
                  <Link to={`/user/${user.id}`} key={user.id}>
                    {' '}
                    {user.name}{' '}
                  </Link>
                </StyledTableCell>

                <StyledTableCell align="right">{user.roleName}</StyledTableCell>
                <StyledTableCell align="right">
                  {user.phoneNumber || 'None'}
                </StyledTableCell>
                <StyledTableCell align="right">{user.email}</StyledTableCell>
                <StyledTableCell align="right">
                  {user.notes && user.notes[0]
                    ? DateUtil.formatDate(user.notes[0].createdAt)
                    : 'N/A'}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {user.notes && user.notes[0] ? user.notes[0].body : 'None'}
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
        <Grid container direction="row" justify="center" alignItems="center">
          <Paginate
            count={data.users.length}
            active={false}
            offset={offset}
            handlePageChange={paginate}
            limit={limit}
          />
        </Grid>
      </div>
    </Fragment>
  )
}
