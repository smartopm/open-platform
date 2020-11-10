/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { Redirect, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Divider,
  IconButton,
  InputBase,
  Grid,
  CircularProgress
} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import TelegramIcon from '@material-ui/icons/Telegram'
import Nav from '../components/Nav'
import Loading from '../components/Loading'
import ErrorPage from '../components/Error'
import { UsersDetails, LabelsQuery } from '../graphql/queries'
import {
  CreateNote,
  SendOneTimePasscode,
  UserLabelCreate,
  CampaignCreateThroughUsers
} from '../graphql/mutations'
import { ModalDialog } from '../components/Dialog'
import { userType } from '../utils/constants'
import Paginate from '../components/Paginate'
import UserListCard from '../components/UserListCard'
import QueryBuilder from '../components/QueryBuilder'
import CreateLabel from '../components/CreateLabel'

import { Context as AuthStateContext } from './Provider/AuthStateProvider'
import { pluralizeCount } from '../utils/helpers'

const limit = 50

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
  const [labelLoading, setLabelLoading] = useState(false)
  const [labels, setLabels] = useState([])
  const [labelError, setError] = useState('')
  const [campaignCreate] = useMutation(CampaignCreateThroughUsers)

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

  // TODO: @dennis, add pop up for notes
  const [userLabelCreate] = useMutation(UserLabelCreate)
  const {
    loading: labelsLoading,
    error: labelsError,
    data: labelsData
  } = useQuery(LabelsQuery)

  function handleFilterQuery(query, count) {
    setSearchQuery(query)
    setFilterCount(count)
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
    setModalAction(NoteTypes[noteType])
  }

  function inputToSearch() {
    setRedirect('/search')
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
  }, [])

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function handleLabelSelect(lastLabel) {
    const { id, shortDesc } = lastLabel
    setLabelLoading(true)
    if (userList) {
      userLabelCreate({
        variables: { userId: userList.toString(), labelId: id }
      })
        .then(() => {
          refetch()
          setLabels([...labels, shortDesc])
          setLabelLoading(false)
        })
        .catch(labelErr => {
          setLabelLoading(false)
          setError(labelErr.message)
        })
    }
  }

  function handleCampaignCreate() {
    if (userList) {
      campaignCreate({
        variables: { userId: userList.toString() }
      })
        .then(res => {
          // eslint-disable-next-line no-shadow
          const { data } = res
          setRedirect(
            `/campaign/${data.campaignCreateThroughUsers.campaign.id}`
          )
        })
        .catch(campaignError => {
          setError(campaignError.message)
        })
    }
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
    loginAfter: 'date_filter'
  }

  return (
    <>
      <Nav navName="Users" menuButton="back" backTo="/" />
      <div className="container" style={{ position: 'relative' }}>
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
        <Grid container alignItems="center">
          <Grid
            item
            xs="auto"
            style={{ display: 'flex', alignItems: 'flex-end', margin: 5 }}
          >
            <CreateLabel handleLabelSelect={handleLabelSelect} />
          </Grid>
          <Grid
            item
            xs="auto"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            {labelLoading ? <CircularProgress size={25} /> : ''}
          </Grid>

          <Grid
            item
            xs="auto"
            style={{ display: 'flex', alignItems: 'flex-end', marginLeft: 5 }}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.filterButton}
              endIcon={<TelegramIcon />}
              onClick={handleCampaignCreate}
            >
              Create Campaign
            </Button>
          </Grid>
        </Grid>
        <br />
        <div className="d-flex justify-content-center row">
          <span>{labelError}</span>
        </div>

        <Grid
          container
          justify="flex-end"
          style={{
            width: '99%',
            position: 'absolute',
            zIndex: 1,
            marginTop: '-95px',
            display: displayBuilder
          }}
        >
          <QueryBuilder
            handleOnChange={handleFilterQuery}
            builderConfig={queryBuilderConfig}
            initialQueryValue={queryBuilderInitialValue}
            filterFields={filterFields}
          />
        </Grid>
        <br />
        {loading || labelsLoading ? (
          <Loading />
        ) : (
          <>
            <UserListCard
              userData={data}
              handleNoteModal={handleNoteModal}
              currentUserType={authState.user.userType}
              sendOneTimePasscode={sendOneTimePasscode}
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
