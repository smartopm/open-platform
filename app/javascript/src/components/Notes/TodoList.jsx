/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  Divider,
  IconButton,
  Grid,
  Button
} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
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
import Task from './Task'
import TaskDashboard from './TaskDashboard'
import { futureDateAndTimeToString } from '../DateContainer'
import DatePickerDialog from '../DatePickerDialog'
import Loading from '../Loading'
import QueryBuilder from '../QueryBuilder'
import { ModalDialog } from '../Dialog'
import { pluralizeCount } from '../../utils/helpers'

function useDebounce(value, delay){
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

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
  const [query, setQuery] = useState('')
  const [currentTile, setCurrentTile] = useState('')
  const [displayBuilder, setDisplayBuilder] = useState('none')
  const [filterCount, setFilterCount] = useState(0)
  const [filterQuery, setFilterQuery] = useState('')
  const [searchInputQuery, setSearchInputQuery] = useState('')
  const { taskId } = useParams()
  const history = useHistory()
  const [userNameSearchTerm, setUserNameSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedFilterInputText = useDebounce(userNameSearchTerm, 500);

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

  // eslint-disable-next-line no-nested-ternary
  const qr = query.length ? query : location === 'my_tasks' ? `assignees: '${currentUser.name}'` : ''
  const [loadTasks, {
    loading: isLoading, error: tasksError, data, refetch, called
  }] = useLazyQuery(
    flaggedNotes,
    {
      variables: {
        offset,
        limit,
        // eslint-disable-next-line no-nested-ternary
        query: `${qr} ${filterQuery ? `AND ${filterQuery}` : searchInputQuery ? `AND ${searchInputQuery}` : ''}`
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
    if (location !== 'tasks') {
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
  }, [taskId])

  useEffect(() => {
    if (taskCountData) {
      taskCountData.refetch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => {
    if(debouncedFilterInputText){
      setFilterQuery(`${debouncedFilterInputText}`)
      loadTasks()
    }

    // for tasks searched using the top search bar input
    if(debouncedSearchText){
      setSearchInputQuery(`user: '${debouncedSearchText}'`)
      loadTasks()
    }
  }, [debouncedFilterInputText, debouncedSearchText, loadTasks])

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

  function handleTaskFilter(_evt, key) {
    if (key === 'tasksWithNoDueDate') return
    setCurrentTile(key)
    setQuery(taskQuery[key])
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks()
  }

  function closeAndExit() {
    setModalOpen(false)
    history.replace('/tasks')
  }

  function inputToSearch(e) {
    // debounce input from search bar input field
    const { value } = e.target
    setSearchText(value)
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
    setOpenFilter(!filterOpen)
  }

  function handleQueryOnChange(selectedOptions) {
    if(selectedOptions){
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate

      if(availableConjugate){
        const conjugate = andConjugate ? 'AND' : 'OR'
        let property = ''
        let value = null
        const queryText = availableConjugate.map(option => {
          let operator = Object.keys(option)[0]
          const [inputFilterProperty, inputFilterValue] = option[operator]
          
          property = filterFields[inputFilterProperty.var]
          value = inputFilterValue
          operator = property === 'assignees' ? '=' : ':'
          
          return `${property}${operator} '${value}'`
        })
        .join(` ${conjugate} `)

        // debounce only for user's Name
        if(property === 'user') {
          setUserNameSearchTerm(queryText)
          setFilterCount(availableConjugate.length)
        }

        if(property === 'assignees' && value){
          setFilterQuery(queryText)
          setFilterCount(availableConjugate.length)
        }
      }
    }
  }

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      assignee: {
        label: 'Assignee',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: liteData?.usersLite.map(u => {
            return { value: u.name, title: u.name }
          })
        }
      },
      userName: {
        label: 'User\'s Name',
        type: 'text',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
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
          field: 'assignee',
          operator: 'select_equals',
          value: [''],
          valueSrc: ['value'],
          valueType: ['select']
        }
      }
    }
  }

  const filterFields = {
    assignee: 'assignees',
    userName: 'user',
  }

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
        
        <div className={classes.root}>
          <>
            <InputBase
              data-testid="search_input"
              className={classes.input}
              type="text"
              placeholder="Search Tasks"
              onChange={inputToSearch}
              value={searchText}
              inputProps={{ 'aria-label': 'search tasks' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              data-testid="toggle_filter_btn"
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={toggleFilterMenu}
            >
              <FilterListIcon />
            </IconButton>
            <div style={{ margin: '10px 19px 10px 0' }}>
              {filterCount
                ? `${filterCount} ${pluralizeCount(filterCount, 'Filter')}`
                : 'Filter'}
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
        {isLoading || taskLoading ? 
        (<Loading />)  : (
          <>
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
          </>
)}
      </div>
    </>
  )
}

const useStyles = makeStyles(theme => ({
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
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
}))

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
