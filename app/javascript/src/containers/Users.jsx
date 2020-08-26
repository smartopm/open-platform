/* eslint-disable */
import React, { Fragment, useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import Nav from '../components/Nav'
import { Redirect } from 'react-router-dom'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersQuery, LabelsQuery } from '../graphql/queries'
import { UserLabelCreate, CampaignCreateThroughUsers } from '../graphql/mutations'
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
  CircularProgress,
  Chip
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { ModalDialog, CustomizedDialogs } from '../components/Dialog'
import { userType } from '../utils/constants'
import Paginate from '../components/Paginate'
import UserListCard from '../components/UserListCard'
import TelegramIcon from '@material-ui/icons/Telegram'
import CreateLabel from '../components/CreateLabel'
import FilterComponent from '../components/FilterComponent'
import DateFilterComponent from '../components/DateFilterComponent'
import { dateToString } from '../utils/dateutil'
const limit = 50

export default function UsersList() {
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false)
  const [type, setType] = useState([])
  const [labels, setLabels] = useState([])
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [offset, setOffset] = useState(0)
  const [note, setNote] = useState('')
  const [labelError, setError] = useState('')
  const [labelLoading, setLabelLoading] = useState(false)
  const [searchType, setSearchType] = useState('type')
  const [userId, setId] = useState('')
  const [userName, setName] = useState('')

  const [modalAction, setModalAction] = useState('')
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const [campaignCreate] = useMutation(CampaignCreateThroughUsers)
  const [filterType, setFilterType] = useState('')
  const [selectDateFrom, setSelectDateFrom] = useState('')
  const [selectDateTo, setSelectDateTo] = useState('')
  const [selectDateOn, setSelectDateOn] = useState('')

  const search = {
    type,
    phone: phoneNumbers,
    label: labels
  }
  function joinSearchQuery(query, type) {
    const types = {
      phone: 'phone_number',
      label: 'labels',
      type: 'user_type'
    }
    const filterType = types[type]
    return query.map(query => `${filterType} = "${query}"`).join(' OR ')
  }
  function specifyUserQuery() {
    if (selectDateFrom !== '') {
      return `date_filter > ${dateToString(selectDateFrom)}`
    }
    if (selectDateTo !== '') {
      return `date_filter < ${dateToString(selectDateTo)}`
    }
    if (selectDateOn !== '') {
      return `date_filter = ${dateToString(selectDateOn)}`
    }
    return joinSearchQuery(search[searchType], searchType)
  }
  const { loading, error, data, refetch } = useQuery(UsersQuery, {
    variables: {
      query: specifyUserQuery(),
      limit,
      offset
    },
    fetchPolicy: 'cache-and-network'
  })

  let userList
  if (data) {
    userList = data.users.map(user => user.id)
  }

  //TODO: @dennis, add pop up for notes 
  const [userLabelCreate] = useMutation(UserLabelCreate)
  const { loading: labelsLoading, error: labelsError, data: labelsData } = useQuery(LabelsQuery)
  function handleFilterModal() {
    setOpen(!open)
    setSearchType('phone')
  }
  function handleBatchFilter() {
    setPhoneNumbers(searchValue.split('\n').join(',').split(','))
    setOpen(!open)
  }
  function handleFilterInputChange(event) {
    setFilterType("")
    setFilterType(event.target.value)
  }
  function handleDateChangeFrom(date) {
    setSelectDateTo("")
    setSelectDateOn("")
    setSelectDateFrom(date)
  }
  function handleDateChangeTo(date) {
    setSelectDateFrom("")
    setSelectDateOn("")
    setSelectDateTo(date)
  }
  function handleDateChangeOn(date) {
    setSelectDateFrom("")
    setSelectDateTo("")
    setSelectDateOn(date)
  }
  function resetDateFilter() {
    setSelectDateFrom("")
    setSelectDateTo("")
    setSelectDateOn("")
    setFilterType("")
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

  function handleLabelSelect(lastLabel) {
    const { id, shortDesc } = lastLabel
    setLabelLoading(true)
    if (userList) {
      userLabelCreate({
        variables: { userId: userList.toString(), labelId: id }
      }).then(() => {
        refetch()
        setLabels([...labels, shortDesc])
        setLabelLoading(false)
      }).catch(error => {
        setLabelLoading(false)
        setError(error.message)
      })
    }
  }

  function handleCampaignCreate() {
    const filters = type.concat(labels)
    if (userList) {
      campaignCreate({
        variables: { filters: filters.join(), userIdList: userList.join() }
      }).then(res => {
        const { data } = res
        setRedirect(`/campaign/${data.campaignCreateThroughUsers.campaign.id}`)
      }).catch(error => {
        setError(error.message)
      })

    }

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
        <Grid container alignItems="center">
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
                <Button size="small" onClick={() => setType([])}>Clear Filter</Button>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <FilterComponent
              stateList={labels}
              list={labelsData.labels}
              handleInputChange={handleLabelChange}
              classes={classes}
              resetFilter={() => setLabels([])}
              type="labels"
            />
          </Grid>
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end', margin: 5 }}>
            <CreateLabel handleLabelSelect={handleLabelSelect} />
          </Grid>
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {labelLoading ? <CircularProgress size={25} /> : ''}
          </Grid>

          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="contained"
              color="primary"
              className={classes.filterButton}
              endIcon={<Icon>search</Icon>} onClick={handleFilterModal}>Filter by Phone #</Button>
            {Boolean(phoneNumbers.length) && (
              <Button size="small" onClick={() => setPhoneNumbers([])}>Clear Filter</Button>
            )}
          </Grid>
          <DateFilterComponent
            classes={classes}
            handleFilterInputChange={handleFilterInputChange}
            filterType={filterType}
            handleDateChangeFrom={handleDateChangeFrom}
            handleDateChangeTo={handleDateChangeTo}
            selectDateFrom={selectDateFrom}
            selectDateTo={selectDateTo}
            selectDateOn={selectDateOn}
            handleDateChangeOn={handleDateChangeOn}
            resetFilter={resetDateFilter}
          />
          <Grid item xs={'auto'} style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 5 }}>
            <Button variant="contained"
              color="primary"
              className={classes.filterButton}
              endIcon={<TelegramIcon />} onClick={handleCampaignCreate} >Create Campaign</Button>
          </Grid>
          
        </Grid>

        <br />
        <div className="d-flex justify-content-center row">
          {/* <span>{labelError ? "Error: Duplicate Label, Check if label is already assigned!" : ''}</span> */}

          <span>{labelError}</span>
        </div>

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

