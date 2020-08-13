import React, { useState, Fragment } from 'react'
import { ModalDialog } from '../Dialog'
import {
  createMuiTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../Loading'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import { useQuery, useMutation } from 'react-apollo'
import { UsersLiteQuery, flaggedNotes } from '../../graphql/queries'
import { AssignUser } from '../../graphql/mutations'
import TaskForm from './TaskForm'
import ErrorPage from '../Error'
import Paginate from '../Paginate'
import CenteredContent from '../CenteredContent'
import FilterComponent from '../FilterComponent'
import Task from './Task'

// component needs a redesign both implementation and UI
export default function TodoList({
  isDialogOpen,
  handleModal,
  saveDate,
  selectedDate,
  handleDateChange,
  todoAction,
  location,
  currentUser
}) {
  const classes = useStyles()
  const limit = 50
  const [offset, setOffset] = useState(0)
  const [loaded, setLoadingAssignee] = useState(false)
  const [open, setModalOpen] = useState(false)
  const [message, setErrorMessage] = useState('')
  const [assignee, setAssignee] = useState([])

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
        limit,
        query:
          location === 'my_tasks'
            ? currentUser
            : assignee.map(query => `assignees = "${query}"`).join(' OR ')
      }
    }
  )

  const [assignUserToNote] = useMutation(AssignUser)

  function openModal() {
    setModalOpen(!open)
  }

  // unassign the user if already assigned
  function handleDelete(userId, noteId) {
    return assignUnassignUser(noteId, userId)
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

  function handleAssigneeInputChange(event) {
    setAssignee(event.target.value)
  }

  if (isLoading) return <Loading />
  if (tasksError) return <ErrorPage error={tasksError.message} />

  return (
    <Fragment>
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

        <Dialog
          // fullScreen={fullScreen}
          open={open}
          fullWidth={true}
          maxWidth={'lg'}
          onClose={openModal}
          aria-labelledby="task_modal"
        >
          <DialogTitle id="task_modal">
            <CenteredContent>
              <span>Create a task</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <TaskForm
              refetch={refetch}
              close={() => setModalOpen(!open)}
              assignUser={assignUnassignUser}
              users={liteData?.users}
            />
          </DialogContent>
        </Dialog>

        <div classes={classes.root}>
          {location === 'todo' && (
            <CenteredContent>
              <FilterComponent
                stateList={assignee}
                list={liteData?.users}
                handleInputChange={handleAssigneeInputChange}
                classes={classes}
                resetFilter={() => setAssignee([])}
                type="assignee"
              />
            </CenteredContent>
          )}
          <br />
          <ul className={css(styles.list)}>
            {data.flaggedNotes.length ? (
              data.flaggedNotes
                .filter(note => note.completed === false)
                .map(note => (
                  <Task
                    key={note.id}
                    note={note}
                    message={message}
                    users={liteData?.users}
                    handleCompleteNote={handleCompleteNote}
                    assignUnassignUser={assignUnassignUser}
                    loaded={loaded}
                    handleDelete={handleDelete}
                    handleModal={handleModal}
                    loading={loading}
                    classes={classes.listItem}
                  />
                ))
            ) : (
              <CenteredContent>There are no tasks</CenteredContent>
            )}
          </ul>
        </div>
        <br />
        <CenteredContent>
          <Paginate
            offSet={offset}
            limit={limit}
            active={true}
            handlePageChange={paginate}
          />
        </CenteredContent>
        <Fab
          variant="extended"
          onClick={openModal}
          className={`btn ${css(styles.getStartedButton)} `}
        >
          Create task
        </Fab>
      </div>
    </Fragment>
  )
}

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    width: '100%',
    overflowX: 'auto'
  },
  formControl: {
    minWidth: 160,
    maxWidth: 300
  },
  listItem: {
    position: 'relative',
    listStyle: 'none',
    padding: 15
  }
})

// this should be in one place, basically just one theme
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
    padding: 0
  },
  getStartedButton: {
    color: '#FFF',
    backgroundColor: '#69ABA4',
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%'
  }
})