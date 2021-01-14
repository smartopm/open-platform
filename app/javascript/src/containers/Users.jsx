/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import { Redirect, Link , useLocation} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Divider, IconButton, InputBase, Grid } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import Nav from '../components/Nav'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersDetails, LabelsQuery, UsersCount } from '../graphql/queries'
import {
  CreateNote,
  SendOneTimePasscode,
  UserLabelCreate,
  CampaignCreateThroughUsers
} from '../graphql/mutations'
import { ModalDialog, ActionDialog } from '../components/Dialog'
import { userType, subStatus } from '../utils/constants'
import Paginate from '../components/Paginate'
import UserListCard from '../components/UserListCard'
import UsersActionMenu from '../components/UsersActionMenu'
import QueryBuilder from '../components/QueryBuilder'
import { dateToString } from '../utils/dateutil'

import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import { pluralizeCount, propAccessor } from '../utils/helpers'

const limit = 25
const USERS_CAMPAIGN_WARNING_LIMIT = 2000

export default function UsersList() {
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [offset, setOffset] = useState(0)
  const [note, setNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [userId, setId] = useState('')
  const [userName, setName] = useState('')
  const [displayBuilder, setDisplayBuilder] = useState('none')
  const [filterCount, setFilterCount] = useState(0)
  const [modalAction, setModalAction] = useState('')
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote)
  const authState = useContext(AuthStateContext)
  const [sendOneTimePasscode] = useMutation(SendOneTimePasscode)
  const [labelError, setError] = useState('')
  const [campaignCreate] = useMutation(CampaignCreateThroughUsers)
  const [campaignCreateOption, setCampaignCreateOption] = useState('none')
  const [openCampaignWarning, setOpenCampaignWarning] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectCheckBox, setSelectCheckBox] = useState(false)

  const { loading, error, data, refetch } = useQuery(UsersDetails, {
    variables: {
      query: searchQuery,
      limit,
      offset
    },
    fetchPolicy: 'cache-and-network'
  })

  let userList
  if (data) {
    userList = data.users.map(user => user.id)
  }

  function getQuery() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new URLSearchParams(useLocation().search);
  }

  const querry = getQuery()

  useEffect(() => {
    if (filterCount !== 0) {
      setOffset(0)
    } else {
      const offsetParams = querry.get('offset')
      setOffset(Number(offsetParams))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCount])


  // TODO: @dennis, add pop up for notes
  const [userLabelCreate] = useMutation(UserLabelCreate)
  const {
    loading: labelsLoading,
    error: labelsError,
    data: labelsData
  } = useQuery(LabelsQuery)

  const [fetchUsersCount, { data: usersCountData }] = useLazyQuery(UsersCount, {
    variables: { query: searchQuery }
  })

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate
      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR'
        const query = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0]
            // skipped nested object accessor here until fully tested 
            const property = filterFields[option[operator][0].var]
            let value = propAccessor(option, operator)[1]

            if (operator === '==') operator = '='
            if (property === 'date_filter') {
              operator = '>'
              value = dateToString(value)
            }

            return `${property} ${operator} "${value}"`
          })
          .join(` ${conjugate} `)
        setSearchQuery(query)
        setFilterCount(availableConjugate.length)
      }
    }
  }

  function handleSaveNote() {
    let noteType = ''
    if (modalAction === 'Answered') {
      noteType = 'Outgoing Call Answered: '
    } else if (modalAction === 'Missed') {
      noteType = 'Outgoing Call not Answered: '
    }
    noteCreate({
      variables: { userId, body: noteType + note, flagged: false }
    }).then(() => {
      refetch()
      setIsDialogOpen(!isDialogOpen)
      setNote('')
    })
  }
  function handleNoteModal(noteUserId = '', username = '', noteType = '') {
    setId(noteUserId)
    setName(username)
    setIsDialogOpen(!isDialogOpen)
    const NoteTypes = {
      Note: 'Note',
      Answered: 'Answered',
      Missed: 'Missed'
    }
    setModalAction(propAccessor(NoteTypes, noteType))
  }

  function inputToSearch() {
    setRedirect('/search')
  }

  function checkUserList(){
    if (
      !!selectedUsers.length &&
      !!userList.length &&
      selectedUsers.length === userList.length
    ) {
      setSelectedUsers([])
      setCampaignCreateOption('none')
    }
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
      checkUserList()
    } else {
      setOffset(offset + limit)
      checkUserList()
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function handleLabelSelect(labels) {
    let createLimit = null
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit
    if (userList) {
      userLabelCreate({
        variables: {
          query: searchQuery,
          limit: createLimit,
          labelId: labels.flatMap(l => l.id || []).toString(),
          userList: selectedUsers.toString()
        }
      })
        .then(() => {
          refetch()
        })
        .catch(labelErr => {
          setError(labelErr.message)
        })
    }
  }

  function setCampaignOption(option) {
    setCampaignCreateOption(option)
    if (option === 'all') {
      fetchUsersCount()
      setSelectedUsers([])
      setSelectCheckBox(true)
    }
    if (option === 'all_on_the_page') {
      setSelectCheckBox(false)
      setSelectedUsers(userList)
    }
    if (option === 'none') {
      setSelectCheckBox(false)
      setSelectedUsers([])
    }  
  }

  function setSelectAll() {
    if (
      !!selectedUsers.length &&
      !!userList.length &&
      selectedUsers.length === userList.length
    ) {
      setSelectedUsers([])
      setCampaignCreateOption('none')
    } else if (selectCheckBox) {
      setSelectCheckBox(false)
      setCampaignCreateOption('none')
    } else {
      setSelectedUsers(userList)
      setCampaignCreateOption('all_on_the_page')
    }
  }

  function handleUserSelect(user) {
    if (selectedUsers.length === 0) setCampaignCreateOption('none')

    let newSelected = []
    if (selectedUsers.includes(user.id)) {
      newSelected = selectedUsers.filter(id => id !== user.id)
    } else {
      newSelected = selectedUsers.concat(user.id)
    }
    setSelectedUsers(newSelected)
  }

  function createCampaign() {
    let createLimit = null
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit
    campaignCreate({
      variables: { query: searchQuery, limit: createLimit, userList: selectedUsers.toString() }
    })
      .then(res => {
        // eslint-disable-next-line no-shadow
        const { data } = res
        setRedirect(`/campaign/${data.campaignCreateThroughUsers.campaign.id}`)
      })
      .catch(campaignError => {
        setError(campaignError.message)
      })
  }

  function handleCampaignCreate() {
    if (
      campaignCreateOption === 'all' &&
      usersCountData.usersCount > USERS_CAMPAIGN_WARNING_LIMIT
    ) {
      setOpenCampaignWarning(true)
      return
    }
    createCampaign()
  }

  if (labelsLoading) return <Loading />
  if (error || labelsError)
    return <ErrorPage error={error.message || labelsError.message} />
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

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      role: {
        label: 'Role',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(userType).map(([key, val]) => {
            return { value: key, title: val }
          })
        }
      },
      label: {
        label: 'Label',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: labelsData.labels.map(label => {
            return { value: label.shortDesc, title: label.shortDesc }
          })
        }
      },
      phoneNumber: {
        label: 'Phone Number',
        type: 'text',
        valueSources: ['value']
      },
      loginAfter: {
        label: 'Login After',
        type: 'date',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
      subStatus: {
        label: 'Sub Status',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(subStatus).map(([key, val]) => {
            return { value: key, title: val }
          })
        }
      }
    }
  }

  const queryBuilderInitialValue = {
    // Just any random UUID
    id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'role',
          operator: 'select_equals',
          value: [''],
          valueSrc: ['value'],
          valueType: ['select']
        }
      }
    }
  }

  const filterFields = {
    role: 'user_type',
    label: 'labels',
    phoneNumber: 'phone_number',
    loginAfter: 'date_filter',
    subStatus: 'sub_status'
  }

  return (
    <>
      <Nav navName="Users" menuButton="back" backTo="/" />
      <div className="container">
        <ActionDialog
          open={openCampaignWarning}
          handleClose={() => setOpenCampaignWarning(false)}
          handleOnSave={createCampaign}
          message={`You are going to create a campaign for 2000+ users. We recommend using
          a smaller list. Do you still want to proceed?`}
        />
        <ModalDialog
          handleClose={handleNoteModal}
          handleConfirm={handleSaveNote}
          open={isDialogOpen}
        >
          {modalAction === 'Note' && (
            <div className="form-group">
              <h6>
                Add note for 
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="text"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder="Type action note here"
              />
              {mutationLoading && (
                <p className="text-center">Saving note ...</p>
              )}
            </div>
          )}
          {modalAction === 'Answered' && (
            <div className="form-group">
              <h6>
                Add Outgoing call answered for 
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder="Type action note here"
              />
              {mutationLoading && (
                <p className="text-center">Saving note ...</p>
              )}
            </div>
          )}
          {modalAction === 'Missed' && (
            <div className="form-group">
              <h6>
                Add Outgoing call not answered for 
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder="Type action note here"
              />
              {mutationLoading && (
                <p className="text-center">Saving note ...</p>
              )}
            </div>
          )}
        </ModalDialog>
        <div className={classes.root}>
          <>
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
              <FilterListIcon onClick={toggleFilterMenu} />
            </IconButton>
            <div style={{ margin: '10px 19px 10px 0' }}>
              {filterCount
                ? `${filterCount} ${pluralizeCount(filterCount, 'Filter')}`
                : 'Filter'}
            </div>
            <div className={classes.searchButton}>
              <Link to="/users/import" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  style={{ border: '1px #dfdfdf solid' }}
                >
                  UPLOAD
                </Button>
              </Link>
            </div>
          </>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <Grid container alignItems="center" style={{ width: '40%' }}>
            <div className="d-flex justify-content-center row">
              <span>{labelError}</span>
            </div>
          </Grid>

          <Grid
            container
            justify="flex-end"
            style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
              display: displayBuilder
            }}
          >
            <QueryBuilder
              handleOnChange={handleQueryOnChange}
              builderConfig={queryBuilderConfig}
              initialQueryValue={queryBuilderInitialValue}
              addRuleLabel="Add filter"
            />
          </Grid>
        </div>
        <br />
        {loading || labelsLoading ? (
          <Loading />
        ) : (
          <>
            <UsersActionMenu
              campaignCreateOption={campaignCreateOption}
              setCampaignCreateOption={setCampaignOption}
              selectedUsers={selectedUsers}
              userList={userList}
              setSelectAllOption={setSelectAll}
              handleCampaignCreate={handleCampaignCreate}
              handleLabelSelect={handleLabelSelect}
              usersCountData={usersCountData}
              selectCheckBox={selectCheckBox}
            />
            <UserListCard
              userData={data}
              handleNoteModal={handleNoteModal}
              currentUserType={authState.user.userType}
              sendOneTimePasscode={sendOneTimePasscode}
              handleUserSelect={handleUserSelect}
              selectedUsers={selectedUsers}
              offset={offset}
              selectCheckBox={selectCheckBox}
            />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Paginate
                count={data.users.length}
                active={false}
                offset={offset}
                handlePageChange={paginate}
                limit={limit}
              />
            </Grid>
          </>
        )}
      </div>
    </>
  )
}

export const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    flexWrap: 'wrap',
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
  },
  searchButton: {
    display: 'flex'
  },
  '@media only screen and (max-width: 768px)': {
    searchButton: {
      flexBasis: '100%'
    }
  }
}))
