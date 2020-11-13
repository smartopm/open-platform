/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation, useLazyQuery, useQuery } from 'react-apollo'
import { useParams, useHistory } from 'react-router'
import { UsersLiteQuery, flaggedNotes, TaskQuery, TaskStatsQuery } from '../../graphql/queries'
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
import Loading from '../Loading'
import { ModalDialog } from '../Dialog'

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
  const [currentTile, setCurrentTile] = useState('')
  const { taskId } = useParams()
  const history = useHistory()

  const taskQuery = {
    completedTasks: 'completed: true',
    tasksDueIn10Days: `due_date <= '${futureDateAndTimeToString(10)}' AND completed: false`,
    tasksDueIn30Days: `due_date <= '${futureDateAndTimeToString(30)}' AND completed: false`,
    tasksOpen: 'completed: false',
    tasksOpenAndOverdue: `due_date <= '${futureDateAndTimeToString(0)}' AND completed: false`,
    tasksWithNoDueDate: 'due_date:nil',
    myOpenTasks: `assignees: ${currentUser.name} AND completed: false`,
    totalCallsOpen: 'category: call AND completed: false',
    totalFormsOpen: 'category: form AND completed: false'
  }

  const taskCountData = useQuery(TaskStatsQuery)

  const [loadAssignees, { loading, data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: 'user_type = admin' },
    errorPolicy: 'all'
  })

  const [loadTask, { loading: taskLoading, data: taskData }] = useLazyQuery(TaskQuery, {
    variables: { taskId },
    errorPolicy: 'all',
    // fetchPolicy: 'cache-and-network'
  })

  // TODO: simplify this: @olivier
  const assignees = assignee.map((q) => `assignees = "${q}"`).join(' OR ')
  // eslint-disable-next-line no-nested-ternary
  const qr = query.length ? query : location === 'my_tasks' ? currentUser.name : assignees
  const [loadTasks, {
    loading: isLoading, error: tasksError, data, refetch, called
  }] = useLazyQuery(
    flaggedNotes,
    {
      variables: {
        offset,
        limit,
        query: `${qr} ${assignees.length ? `AND ${assignees}` : ''}`
      },
      fetchPolicy: 'network-only'
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
    // load tasks on runtime when we are on my task page from notification
    if (location !== 'todo') {
      loadTasks()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadAssignees, filterOpen, isAssignTaskOpen, location])

  useEffect(() => {
    if (taskId) {
      loadTask()
      setModalOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTask])

  useEffect(() => {
    if (taskCountData) {
      taskCountData.refetch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  function handleRefetch(){
    refetch()
    taskCountData.refetch()
  }

  // unassign the user if already assigned
  function handleDelete(userId, noteId) {
    return assignUnassignUser(noteId, userId)
  }
  function assignUnassignUser(noteId, userId) {
    setLoadingAssignee(true)
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => {
        if (called) {
          refetch()
        }
        taskCountData.refetch()
        setLoadingAssignee(false)
      })
      .catch((err) => setErrorMessage(err.message))
  }

  function handleCompleteNote(noteId, completed) {
    setMutationLoading(true)
    todoAction(noteId, completed)
    // allow the mutation above to finish running before refetching
    setTimeout(() => {
      refetch()
      taskCountData.refetch()
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
    loadTasks()
    setOpenFilter(!filterOpen)
  }

  function handleTaskFilter(_evt, key) {
    if (key === 'tasksWithNoDueDate') return
    setCurrentTile(key)
    setQuery(taskQuery[key])
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks()
  }

  function handleSelect() {
    setOpenFilter(!filterOpen)
  }

  function closeAndExit() {
    setModalOpen(false)
    history.replace('/todo')
  }

  if (isLoading || taskLoading) return <Loading />
  if (tasksError) return <ErrorPage error={tasksError.message} />

  return (
    <>
      <div className="container" data-testid="todo-container">
        <ModalDialog
          open={isDialogOpen}
          handleClose={handleModal}
          handleConfirm={saveDate}
          action="save"
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
          fullWidth
          maxWidth="lg"
          onClose={openModal}
          aria-labelledby="task_modal"
        >
          {/* show task details when on task page load */}
          <DialogTitle id="task_modal">
            <CenteredContent>
              <span>{taskId ? 'Task Detail Page' : 'Create a task'}</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            {
              // eslint-disable-next-line no-nested-ternary
              !taskId ? (
                <TaskForm
                  refetch={handleRefetch}
                  close={() => setModalOpen(!open)}
                  assignUser={assignUnassignUser}
                  users={liteData?.usersLite}
                />
              // eslint-disable-next-line no-nested-ternary
              )
                : !taskData ? 'No Task found' : (
                  <>
                    <Task
                      key={taskData.task.id}
                      note={taskData.task}
                      message={message}
                      users={liteData?.usersLite || []}
                      handleCompleteNote={handleCompleteNote}
                      assignUnassignUser={assignUnassignUser}
                      loaded={loaded}
                      handleDelete={handleDelete}
                      handleModal={handleModal}
                      loading={loading}
                      loadingMutation={loadingMutation}
                      handleOpenTaskAssign={() => setAutoCompleteOpen(!isAssignTaskOpen)}
                      isAssignTaskOpen={isAssignTaskOpen}
                      currentUser={currentUser}
                    />
                    <CenteredContent>
                      <Button
                        variant="outlined"
                        color="primary"
                        aria-label="task_submit"
                        onClick={closeAndExit}
                      >
                        Close
                      </Button>
                    </CenteredContent>

                  </>
                )
            }
          </DialogContent>
        </Dialog>

        <div classes={classes.root}>
          {location === 'todo' && (
            <CenteredContent>
              <FilterComponent
                stateList={assignee}
                list={liteData?.usersLite || []}
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
            <TaskDashboard taskData={taskCountData} filterTasks={handleTaskFilter} currentTile={currentTile} />
          </Grid>
          <br />
          {data?.flaggedNotes.length ? data?.flaggedNotes.map((note) => (
            <Task
              key={note.id}
              note={note}
              message={message}
              users={liteData?.usersLite || []}
              handleCompleteNote={handleCompleteNote}
              assignUnassignUser={assignUnassignUser}
              loaded={loaded}
              handleDelete={handleDelete}
              handleModal={handleModal}
              loading={loading}
              loadingMutation={loadingMutation}
              handleOpenTaskAssign={() => setAutoCompleteOpen(!isAssignTaskOpen)}
              isAssignTaskOpen={isAssignTaskOpen}
              currentUser={currentUser}
            />
          )) : (
            <CenteredContent>Click a card above to filter</CenteredContent>
            )}
        </div>
        <br />
        <CenteredContent>
          <Paginate
            offSet={offset}
            limit={limit}
            active
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
    </>
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
