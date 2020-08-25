import React, { useState, Fragment, useEffect } from 'react'
import { ModalDialog } from '../Dialog'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid, Button
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../Loading'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, useLazyQuery } from 'react-apollo'
import { UsersLiteQuery, flaggedNotes } from '../../graphql/queries'
import { AssignUser } from '../../graphql/mutations'
import TaskForm from './TaskForm'
import ErrorPage from '../Error'
import Paginate from '../Paginate'
import CenteredContent from '../CenteredContent'
import FilterComponent from '../FilterComponent'
import Task from './Task'
import TaskDashboard from './TaskDashboard'
import { futureDateAndTimeToString } from '../DateContainer'
import DatePickerDialog from '../DatePickerDialog'

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
  const [filterOpen, setOpenFilter] = useState(false)
  const [isAssignTaskOpen, setAutoCompleteOpen] = useState(false)
  const [loadingMutation, setMutationLoading] = useState(false)
  const [message, setErrorMessage] = useState('')
  const [assignee, setAssignee] = useState([])
  const [query, setQuery] = useState('')

  const taskQuery = {
    completedTasks: 'completed: true',
    tasksDueIn10Days: `due_date <= '${futureDateAndTimeToString(10)}' AND completed: false`,
    tasksDueIn30Days: `due_date <= '${futureDateAndTimeToString(30)}' AND completed: false`,
    tasksOpen: 'completed: false',
    tasksOpenAndOverdue: `due_date <= '${futureDateAndTimeToString(0)}' AND completed: false`,
    tasksWithNoDueDate: 'due_date:nil',
    myOpenTasks: `assignees: ${currentUser} AND completed: false`,
    totalCallsOpen: 'category: call AND completed: false'
  }
  const [loadAssignees, { loading, data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query: "user_type='admin'"
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  // TODO: simplify this: @olivier
  const qr = query.length ? query : location === 'my_tasks' ? currentUser : assignee.map(query => `assignees = "${query}"`).join(' OR ')

  const [loadTasks, { loading: isLoading, error: tasksError, data, refetch }] = useLazyQuery(
    flaggedNotes,
    {
      variables: {
        offset,
        limit,
        query: `${!qr.length ? 'completed: false': qr}`
      },
      fetchPolicy: "network-only"
    }
  )

  const [assignUserToNote] = useMutation(AssignUser)

  function openModal() {
    setModalOpen(!open)
  }

  useEffect(() => {
    // only fetch admins when the  modal is opened or when the select is triggered
    if (open || filterOpen || isAssignTaskOpen) {
      loadAssignees()
    }
  }, [open, loadAssignees, filterOpen, isAssignTaskOpen])

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
    setMutationLoading(true)
    todoAction(noteId, completed)
    // allow the mutation above to finish running before refetching
    setTimeout(() => {
      refetch()
      setMutationLoading(false)
    }, 200)
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

  function handleTaskFilter(_evt, key) {
    if (key === 'tasksWithNoDueDate') return
    setQuery(taskQuery[key])
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks()
  }

  function handleSelect() {
    setOpenFilter(!filterOpen)
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
          action='save'
        >
            <DatePickerDialog
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              label="Pick due date for this todo"
            />
        </ModalDialog>

        <Dialog
          fullScreen
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
                list={liteData?.users || []}
                handleInputChange={handleAssigneeInputChange}
                classes={classes}
                resetFilter={() => setAssignee([])}
                type="assignee"
                filterOpen={filterOpen}
                handleOpenSelect={handleSelect}
              />
            </CenteredContent>
          )}
          <br />
          <Grid container spacing={3}> 
            <TaskDashboard filterTasks={handleTaskFilter} />
          </Grid>
          <br />
            {data?.flaggedNotes.length ? data?.flaggedNotes.map(note => (
                  <Task
                    key={note.id}
                    note={note}
                    message={message}
                    users={liteData?.users || []}
                    handleCompleteNote={handleCompleteNote}
                    assignUnassignUser={assignUnassignUser}
                    loaded={loaded}
                    handleDelete={handleDelete}
                    handleModal={handleModal}
                    loading={loading}
                    loadingMutation={loadingMutation}
                    handleOpenTaskAssign={() => setAutoCompleteOpen(!isAssignTaskOpen)}
                    isAssignTaskOpen={isAssignTaskOpen}
                  />
                )
            ) : (
              <CenteredContent>Click a card above to filter</CenteredContent>
            )}
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
          color="primary"
          className={`btn ${css(styles.taskButton)} `}
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

})

const styles = StyleSheet.create({
  taskButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    bottom: 20,
    right: 57,
    marginLeft: '30%',
    color: '#FFFFFF'
  }
})
