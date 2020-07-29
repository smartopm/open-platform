import React, { Fragment, useState, useEffect, useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import Nav from '../components/Nav'
import { Redirect } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery, LabelsQuery } from '../graphql/queries'
import { CreateNote } from '../graphql/mutations'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  TextField,
  Divider,
  IconButton,
  Icon,
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
import { ModalDialog, CustomizedDialogs } from '../components/Dialog'
import { userType } from '../utils/constants'
import Paginate from '../components/Paginate'
import UserListCard from '../components/UserListCard'
import {Context as ThemeContext} from '../../Themes/Nkwashi/ThemeProvider'


const limit = 50
export default function UsersList() {
  const classes = useStyles()
  const theme = useContext(ThemeContext)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false)
  const [type, setType] = useState([])
  const [labels, setLabels] = useState([])
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [offset, setOffset] = useState(0)
  const [note, setNote] = useState('')
  const [searchType, setSearchType] = useState('type')
  const [userId, setId] = useState('')
  const [userName, setName] = useState('')
  const [modalAction, setModalAction] = useState('')
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)

  const search = {
    type,
    phone: phoneNumbers,
    label: labels
  }

  const { loading, error, data, refetch } = useQuery(UsersQuery, {
    variables: {
      query: joinSearchQuery(search[searchType], searchType),
      limit,
      offset
    },
    fetchPolicy: 'cache-and-network'
  })

  
 //TODO: @dennis, add pop up for notes 

  const { loading: labelsLoading, error: labelsError, data: labelsData } = useQuery(LabelsQuery)

  function joinSearchQuery(query, type) {
    const types = {
      phone: 'phone_number',
      label: 'labels',
      type: 'user_type'
    }
    const filterType = types[type]
    return query.map(query => `${filterType} = ${query}`).join(' OR ')
  }
  function handleFilterModal() {
    setOpen(!open)
    setSearchType('phone')
  }
  function handleBatchFilter() {
    setPhoneNumbers(searchValue.split('\n').join(',').split(','))
    setOpen(!open)
  }
  function handleSaveNote() {
    let noteType = ''
    if (modalAction === 'Answered') {
      noteType = "Outgoing Call Answered: "
    } else if (modalAction === 'Missed') {
      noteType = "Outgoing Call not Answered: "
    }
    noteCreate({
      variables: { userId, body: noteType + note, flagged: false }
    }).then(() => {
      refetch()
      setIsDialogOpen(!isDialogOpen)
      setNote('')
    })
  }
  function handleNoteModal(userId = '', username = '', type = '') {
    setId(userId)
    setName(username)
    setIsDialogOpen(!isDialogOpen)
    const NoteTypes = {
      Note: 'Note',
      Answered: 'Answered',
      Missed: 'Missed'
    }
    setModalAction(NoteTypes[type])
  }
  function inputToSearch() {
    setRedirect('/search')
  }
  function handleInputChange(event) {
    setType(event.target.value)
    setSearchType('type')
  }

  function handleLabelChange(event) {
    setLabels(event.target.value)
    setSearchType('label')
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

  // reset pagination when the filter changes
  useEffect(() => {
    setOffset(0)
  }, [type])



  if (loading || labelsLoading) return <Loading />
  if (error || labelsError) return <ErrorPage error={error.message || labelsError.message} />
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
        <CustomizedDialogs
          open={open}
          saveAction="Save"
          dialogHeader="Filter by User Phone # (provide a comma delimited list)"
          handleBatchFilter={handleBatchFilter}
          handleModal={handleFilterModal}>
          <TextField rows={5}
            multiline className="form-control" onChange={event => setSearchValue(event.target.value)} />
        </CustomizedDialogs>
        <ModalDialog
          handleClose={handleNoteModal}
          handleConfirm={handleSaveNote}
          open={isDialogOpen}
        >
          {modalAction === 'Note' && (
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
          )}
          {modalAction === 'Answered' && (

            <div className="form-group">
              <h6>
                Add Outgoing call answered for <strong>{userName}</strong>{' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder="Type action note here"
              />
              {mutationLoading && <p className="text-center">Saving note ...</p>}
            </div>
          )}
          {modalAction === 'Missed' && (

            <div className="form-group">
              <h6>
                Add Outgoing call not answered for <strong>{userName}</strong>{' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder="Type action note here"
              />
              {mutationLoading && <p className="text-center">Saving note ...</p>}
            </div>
          )}
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
        <Grid container>
          <Grid item xs={'auto'}>
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
                    {selected.map((value, i) => (
                      <Chip key={i} label={value} />
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
              {Boolean(type.length) && (
                <Button onClick={() => setType([])}>Clear Filter</Button>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-mutiple-chip-label">Filter by Labels</InputLabel>
              <Select
                labelId="select-by-label"
                id="role-chip"
                multiple
                value={labels}
                onChange={handleLabelChange}
                input={<Input id="select-by-label" />}
                renderValue={selected => (
                  <div>
                    {selected.map((value, i) => (
                      <Chip key={i} label={value} />
                    ))}
                  </div>
                )}
              >
                {labelsData.labels.map(label => (
                  <MenuItem key={label.id} value={label.shortDesc}>
                    {label.shortDesc}
                  </MenuItem>
                ))}
              </Select>
              {Boolean(labels.length) && (
                <Button onClick={() => setLabels([])}>Clear Filter</Button>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="contained"
              color="primary"
              className={classes.filterButton}
              style={{backgroundColor: theme.primaryColor}}
              endIcon={<Icon>search</Icon>} onClick={handleFilterModal}>Filter by Phone #</Button>
            {Boolean(phoneNumbers.length) && (
              <Button onClick={() => setPhoneNumbers([])}>Clear Filter</Button>
            )}
          </Grid>

        </Grid>
        <br />
        <br />

 
        <UserListCard userData={data} handleNoteModal={handleNoteModal} />
      
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
  table: {
    display: 'block',
    width: '100%',
    overflowX: 'auto'
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
    minWidth: 150,
    maxWidth: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  filterButton: {
    
    textTransform: 'none'
  }
}))

