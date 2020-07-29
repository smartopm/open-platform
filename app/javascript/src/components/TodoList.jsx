import React, { useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import { ModalDialog } from './Dialog'
import DateUtil from '../utils/dateutil'
import { createMuiTheme, Chip, Divider } from '@material-ui/core'
import { formatDistance } from 'date-fns'
import { StyleSheet, css } from 'aphrodite'
import Loading, { Spinner } from './Loading'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useQuery, useMutation } from 'react-apollo'
import { UsersLiteQuery, flaggedNotes } from '../graphql/queries'
import { AssignUser } from '../graphql/mutations'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { UserChip } from './UserChip'
import ErrorPage from './Error'
import Paginate from './Paginate'
import CenteredContent from './CenteredContent'

// component needs a redesign both implementation and UI
export default function TodoList({
  isDialogOpen,
  handleModal,
  saveDate,
  selectedDate,
  handleDateChange,
  todoAction
}) {
  const classes = useStyles()
  const limit = 50
  const [offset, setOffset] = useState(0)
  const [loaded, setLoadingAssignee] = useState(false)
  const [autoCompleteOpen, setOpen] = useState(false)
  const [id, setNoteId] = useState('')
  const [message, setErrorMessage] = useState('')
  const { loading, data: liteData } = useQuery(UsersLiteQuery, {
    variables: {
      query: "user_type='admin'"
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const { loading: isLoading, error: tasksError, data, refetch } = useQuery(
    flaggedNotes,
    {
      variables: {
        offset,
        limit
      },
    }
  )
  const [assignUserToNote] = useMutation(AssignUser)

  // unsubscribe the user if already subscribed
  function handleDelete(userId, noteId) {
    return assignUnassignUser(noteId, userId)
  }

  function handleOpenAutoComplete(_event, noteId) {
    setOpen(!autoCompleteOpen)
    setNoteId(noteId)
    setErrorMessage('')
  }

  function assignUnassignUser(noteId, userId) {
    setLoadingAssignee(true)
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => (refetch(), setLoadingAssignee(false)))
      .catch(err => setErrorMessage(err.message))
  }

  function handleCompleteNote(noteId, completed) {
    todoAction(noteId, completed)
    // allow the mutation above to finish running before refetching
    setTimeout(() => {
      refetch()
    }, 300)
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (isLoading) return <Loading />
  if (tasksError) return <ErrorPage error={tasksError.message} />

  return (
    <div className="container" data-testid="todo-container">
      <ModalDialog
        open={isDialogOpen}
        handleClose={handleModal}
        handleConfirm={saveDate}
      >
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Pick due date for this todo"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </ModalDialog>

      <div classes={classes.root}>
        <ul className={css(styles.list)}>
          {isLoading ? (
            <Loading />
          ) : data.flaggedNotes.length ? (
            data.flaggedNotes.map(note => (
              <li key={note.id} className={`${css(styles.listItem)}`}>
                <div className="custom-control custom-checkbox text">
                  <input
                    type="checkbox"
                    checked={note.completed}
                    onChange={() => handleCompleteNote(note.id, note.completed)}
                    className="custom-control-input"
                    id={`todo-check-${note.id}`}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`todo-check-${note.id}`}
                    style={{
                      textDecoration: note.completed && 'line-through',
                      fontSize: 17
                    }}
                  >
                    {note.body} {'  '}
                    <br />
                    <br />
                    <span>
                      By <i>{note.author.name}</i>
                    </span>
                  </label>

                  <label style={{ float: 'right', fontSize: 17 }}>
                    <span>
                      Due at:{' ' + DateUtil.formatDate(note.dueDate)}
                    </span>
                  </label>
                  {'  '}
                  <EditIcon
                    style={{
                      float: 'right',
                      cursor: 'pointer'
                    }}
                    fontSize="small"
                    color="inherit"
                    onClick={() => handleModal(note.id)}
                  />

                  <br />
                  <span style={{ marginRight: 10 }}>
                    Created{' '}
                    <i>
                      {formatDistance(new Date(note.createdAt), new Date(), {
                        addSuffix: true,
                        includeSeconds: true
                      })}
                    </i>
                  </span>
                  <span style={{ float: 'right' }}>
                    Associated with <i>{note.user.name}</i>
                  </span>
                </div>
                <br />
                {/* notes assignees */}
                {note.assignees.map(user => (
                  <UserChip
                    key={user.id}
                    user={user}
                    size="medium"
                    onDelete={() => handleDelete(user.id, note.id)}
                  />
                ))}
               
                {/* loader */}
                {loaded && id === note.id ? (
                  <Spinner />
                ) : (
                  <Chip
                    key={note.id}
                    variant="outlined"
                    label={autoCompleteOpen && id === note.id ? 'Close' : 'Add Assignee' }
                    size="medium"
                    icon={ autoCompleteOpen && id === note.id ? <CancelIcon /> : <AddCircleIcon />}
                    onClick={event => handleOpenAutoComplete(event, note.id)}
                  />
                )}
              {/* error message */}
              <br />
              {Boolean(message.length) && <span>{message}</span>}
              <br />
              <br />

                {/* autocomplete for assignees */}
                {
                // avoid opening autocomplete box for other notes
                autoCompleteOpen && id === note.id && (
                  <Autocomplete
                    clearOnEscape
                    clearOnBlur
                    loading={loading}
                    id={note.id}
                    options={liteData.users}
                    getOptionLabel={option => option.name}
                    style={{ width: 300 }}
                    onChange={(_evt, value) => {
                      // if nothing selected, ignore and move on
                      if (!value) {
                        return
                      }
                      // subscribe the user here
                      assignUnassignUser(note.id, value.id)
                    }}
                    renderInput={params => (
                      <TextField {...params} placeholder="Name of assignee" />
                    )}
                  />
                  )}
                <Divider />
              </li>
            ))
          ) : (
            <span>No Actions yet</span>
              )}
          
        </ul>
      </div>
      <CenteredContent>
            <Paginate
              offSet={offset}
              limit={limit}
              active={true}
              handlePageChange={paginate}
            />
          </CenteredContent>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%',
    overflowX: 'auto'
  }
})

const theme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#25c0b0'
      }
    },
    MuiPickersDay: {
      day: {
        color: '#25c0b0'
      },
      daySelected: {
        backgroundColor: '#25c0b0'
      },
      current: {
        color: '#25c0b0'
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#25c0b0'
      }
    }
  }
})

const styles = StyleSheet.create({
  list: {
    margin: 0,
    padding: 0,
  },
  listItem: {
    position: 'relative',
    listStyle: 'none',
    padding: 15
  }
})
