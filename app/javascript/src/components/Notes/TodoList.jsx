import React, { useState, Fragment,useEffect } from 'react'
import { ModalDialog } from '../Dialog'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CardActionArea
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import Loading from '../Loading'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation } from 'react-apollo'
import { UsersLiteQuery, flaggedNotes } from '../../graphql/queries'
import { AssignUser } from '../../graphql/mutations'
import { inDays } from '../../utils/helpers'
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
  const [loadingMutation, setMutationLoading] = useState(false)
  const [message, setErrorMessage] = useState('')
  const [assignee, setAssignee] = useState([])
<<<<<<< HEAD
  const [metric, setMetric] = useState()

=======
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
>>>>>>> e22c9daca0e17da58a3c422d4a34e059e35d73af
  const { loading, data: liteData } = useQuery(UsersLiteQuery, {
    variables: {
      query: "user_type='admin'"
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  // TODO: simplify this: @olivier
  const qr = query.length ? query : location === 'my_tasks' ? currentUser : assignee.map(query => `assignees = "${query}"`).join(' OR ')

  const { loading: isLoading, error: tasksError, data, refetch } = useQuery(
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
  useEffect(() => {
    if(data){
      setMetric(data.flaggedNotes)
    }
  },[]);
  const [assignUserToNote] = useMutation(AssignUser)

  function openModal() {
    setModalOpen(!open)
  }

  // unassign the user if already assigned
  function handleDelete(userId, noteId) {
    return assignUnassignUser(noteId, userId)
  }

  function filterCompleted() {
  return  setMetric(data.flaggedNotes.filter(note => note.completed === true))
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
  }
  if (isLoading) return <Loading />
  if (tasksError) return <ErrorPage error={tasksError.message} />
  console.log(data.flaggedNotes)
  console.log(metric)
  let activeTask = data.flaggedNotes.filter(note => note.completed === false)
    .length
  let dueInTen = data.flaggedNotes.filter(
    note =>
      note.completed === false &&
      inDays(new Date(note.createdAt), new Date(note.dueDate)) <= 10 &&
      inDays(new Date(note.createdAt), new Date(note.dueDate)) >= 0
  ).length
  let dueInThirty = data.flaggedNotes.filter(
    note =>
      note.completed === false &&
      inDays(new Date(note.createdAt), new Date(note.dueDate)) >= 10 &&
      inDays(new Date(note.createdAt), new Date(note.dueDate)) <= 30
  ).length
  let Overdue = data.flaggedNotes.filter(
    note =>
      note.completed === false &&
      inDays(new Date(note.createdAt), new Date(note.dueDate)) <= 0
  ).length

  let completed = data.flaggedNotes.filter(note => note.completed === true)
    .length
  console.log(dueInTen)
  return (
    <Fragment>
      <br />
      <div className="container-fluid">
        <Grid container spacing={3}>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <CardActionArea onClick={() => filterCompleted()}>
              <Cards title={'Active Tasks'} number={activeTask} />
            </CardActionArea>
          </Grid>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <Cards title={'Due in 10 days'} number={dueInTen} />
          </Grid>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <Cards title={'Due in 30 days'} number={dueInThirty} />
          </Grid>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <Cards title={'Overdue Tasks'} number={Overdue} />
          </Grid>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <Cards title={'My Tasks'} number={1} />
          </Grid>
          <Grid item lg={2} sm={4} xl={2} xs={6}>
            <Cards
              title={'Completed Tasks'}
              number={completed}
              onClick={() => console.log('bums')}
            />
          </Grid>
        </Grid>
      </div>
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
              />
            </CenteredContent>
          )}
<<<<<<< HEAD
          <ul className={css(styles.list)}>
            {data.flaggedNotes.length ? (
              data.flaggedNotes
                .filter(note => note.completed === false)
                .map(note => (
=======
          <br />
          <Grid container spacing={3}> 
            <TaskDashboard filterTasks={handleTaskFilter} />
          </Grid>
          <br />
            {data.flaggedNotes.length ? data.flaggedNotes.map(note => (
>>>>>>> e22c9daca0e17da58a3c422d4a34e059e35d73af
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
                    loadingMutation={loadingMutation}
                  />
                )
            ) : (
              <CenteredContent>There are no tasks</CenteredContent>
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
