/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  Divider,
  IconButton,
  Grid,
  Button,
  Checkbox,
  Typography,
  Select,
  MenuItem
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import { StyleSheet, css } from 'aphrodite';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMutation, useLazyQuery, useQuery } from 'react-apollo';
import { useParams, useHistory } from 'react-router';
import { UsersLiteQuery, flaggedNotes, TaskQuery, TaskStatsQuery } from '../../graphql/queries';
import { AssignUser, UpdateNote } from '../../graphql/mutations';
import TaskForm from './TaskForm';
import ErrorPage from '../Error';
import Paginate from '../Paginate';
import CenteredContent from '../CenteredContent';
import Task from './Task';
import TaskDashboard from './TaskDashboard';
import { futureDateAndTimeToString } from '../DateContainer';
import DatePickerDialog from '../DatePickerDialog';
import Loading from '../../shared/Loading';
import QueryBuilder from '../QueryBuilder';
import { ModalDialog } from '../Dialog';
import { formatError, pluralizeCount, propAccessor } from '../../utils/helpers';
import useDebounce from '../../utils/useDebounce';
import DataList from '../../shared/list/DataList';
import ListHeaders from '../../shared/list/ListHeader';
import renderTaskData from './RenderTaskData';
import MessageAlert from '../MessageAlert';

const taskHeader = [
  { title: 'Select', col: 1 },
  { title: 'Task', col: 4 },
  { title: 'Created By', col: 3 },
  { title: 'Duedate', col: 1 },
  { title: 'Assignees', col: 2 },
  { title: 'Menu', col: 1 }
];
// component needs a redesign both implementation and UI
export default function TodoList({
  isDialogOpen,
  handleModal,
  saveDate,
  selectedDate,
  handleDateChange,
  location,
  currentUser
}) {
  const classes = useStyles();
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [loaded, setLoadingAssignee] = useState(false);
  const [open, setModalOpen] = useState(false);
  const [filterOpen, setOpenFilter] = useState(false);
  const [isAssignTaskOpen, setAutoCompleteOpen] = useState(false);
  const [loadingMutation, setMutationLoading] = useState(false);
  const [message, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');
  const [currentTile, setCurrentTile] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [filterCount, setFilterCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [searchInputQuery, setSearchInputQuery] = useState('');
  const { taskId } = useParams();
  const history = useHistory();
  const [userNameSearchTerm, setUserNameSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedFilterInputText = useDebounce(userNameSearchTerm, 500);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [checkedOptions, setCheckOptions] = useState('none')
  const taskQuery = {
    completedTasks: 'completed: true',
    tasksDueIn10Days: `due_date <= '${futureDateAndTimeToString(10)}' AND completed: false`,
    tasksDueIn30Days: `due_date <= '${futureDateAndTimeToString(30)}' AND completed: false`,
    tasksOpen: 'completed: false',
    tasksOpenAndOverdue: `due_date <= '${futureDateAndTimeToString(0)}' AND completed: false`,
    tasksWithNoDueDate: 'due_date:nil',
    myOpenTasks: `assignees: ${currentUser?.name} AND completed: false`,
    totalCallsOpen: 'category: call AND completed: false',
    totalFormsOpen: 'category: form AND completed: false'
  };

  const [selectedTasks, setSelected] = useState([]);

  function handleChange(selectedId) {
    // let currentTasks = [];
    if (selectedTasks.includes(selectedId)) {
      const currentTasks = selectedTasks.filter(id => id !== selectedId);
      setSelected([...currentTasks]);
    } else {
      setSelected([...selectedTasks, selectedId]);
    }
  }
  console.log(selectedTasks)

  function handleTaskDetails({ id, comment }) {
    history.push(`/tasks/${id}${comment ? '?comment=true' : ''}`);
  }

  const taskCountData = useQuery(TaskStatsQuery);

  const [loadAssignees, { loading, data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: 'user_type = admin' },
    errorPolicy: 'all'
  });

  const [loadTask, { loading: taskLoading, data: taskData }] = useLazyQuery(TaskQuery, {
    variables: { taskId },
    errorPolicy: 'all'
    // fetchPolicy: 'cache-and-network'
  });

  // eslint-disable-next-line no-nested-ternary
  const qr = query.length
    ? query
    : location === 'my_tasks'
    ? `assignees: '${currentUser.name}'`
    : '';
  const [
    loadTasks,
    { loading: isLoading, error: tasksError, data, refetch, called }
  ] = useLazyQuery(flaggedNotes, {
    variables: {
      offset,
      limit,
      query: `${qr} ${
        // eslint-disable-next-line no-nested-ternary
        filterQuery ? `AND ${filterQuery}` : searchInputQuery ? `AND ${searchInputQuery}` : ''
      }`
    },
    fetchPolicy: 'network-only'
  });
  const [assignUserToNote] = useMutation(AssignUser);
  const [taskUpdate] = useMutation(UpdateNote)
  const taskListIds = data?.flaggedNotes.map(task => task.id)
  function openModal() {
    setModalOpen(!open);
  }

  useEffect(() => {
    // only fetch admins when the  modal is opened or when the select is triggered
    if (open || filterOpen || isAssignTaskOpen) {
      loadAssignees();
    }
    // load tasks on runtime when we are on my task page from notification
    if (location !== 'tasks') {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadAssignees, filterOpen, isAssignTaskOpen, location]);

  useEffect(() => {
    if (taskId) {
      loadTask();
      setModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  useEffect(() => {
    if (taskCountData) {
      taskCountData.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (debouncedFilterInputText) {
      setFilterQuery(`${debouncedFilterInputText}`);
      loadTasks();
    }

    // for tasks searched using the top search bar input
    if (debouncedSearchText) {
      setSearchInputQuery(`user: '${debouncedSearchText}'`);
      loadTasks();
    }
  }, [debouncedFilterInputText, debouncedSearchText, loadTasks]);

  function handleRefetch() {
    refetch();
    taskCountData.refetch();
  }

  // unassign the user if already assigned
  function handleDelete(userId, noteId) {
    return assignUnassignUser(noteId, userId);
  }
  function assignUnassignUser(noteId, userId) {
    setLoadingAssignee(true);
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => {
        if (called) {
          refetch();
        }
        taskCountData.refetch();
        setLoadingAssignee(false);
      })
      .catch(err => setErrorMessage(err.message));
  }

  function handleCompleteNote(noteId, completed) {
    handleTaskActionMenuClose()
    setMutationLoading(true);

    taskUpdate({
      variables: { id: noteId, completed: !completed }
    })
      .then(() => {
        setErrorMessage(`Task has been successfully marked as ${completed ? 'incomplete': 'complete'}`);
        setIsSuccessAlert(true);
        refetch()
        taskCountData.refetch()
        setMutationLoading(false)
      })
      .catch(err => {
        setErrorMessage(formatError(err.message))
        setIsSuccessAlert(false);
        setMutationLoading(false)
      })
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleTaskFilter(_evt, key) {
    if (key === 'tasksWithNoDueDate') return;
    setCurrentTile(key);
    setQuery(propAccessor(taskQuery, key));
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks();
  }

  function closeAndExit() {
    setModalOpen(false);
    history.replace('/tasks');
  }

  function inputToSearch(e) {
    // debounce input from search bar input field
    const { value } = e.target;
    setSearchText(value);
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
    setOpenFilter(!filterOpen);
  }

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and;
      const orConjugate = selectedOptions.logic?.or;
      const availableConjugate = andConjugate || orConjugate;

      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR';
        let property = '';
        let value = null;
        const queryText = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0];
            const [inputFilterProperty, inputFilterValue] = propAccessor(option, operator);

            property = filterFields[inputFilterProperty.var];
            value = inputFilterValue;
            operator = property === 'assignees' ? '=' : ':';

            return `${property}${operator} '${value}'`;
          })
          .join(` ${conjugate} `);

        // debounce only for user's Name
        if (property === 'user') {
          setUserNameSearchTerm(queryText);
          setFilterCount(availableConjugate.length);
        }

        if (property === 'assignees' && value) {
          setFilterQuery(queryText);
          setFilterCount(availableConjugate.length);
        }
      }
    }
  }

  function handleTaskActionMenuClose(){
    setActionMenuOpen(null)
  } 

  function handleTaskActionMenuOpen(e){
    setActionMenuOpen(e.currentTarget)
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  }

  const InitialConfig = MaterialConfig;
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      assignee: {
        label: 'Assignee',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: liteData?.usersLite.map(u => {
            return { value: u.name, title: u.name };
          })
        }
      },
      userName: {
        label: "User's Name",
        type: 'text',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      }
    }
  };

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
  };

  const filterFields = {
    assignee: 'assignees',
    userName: 'user'
  };

  function setSelectAllOption(){
    if(taskListIds.length === selectedTasks.length){
      setCheckOptions('none')
      setSelected([])
    } else {
      setCheckOptions('all_on_the_page')
      setSelected(taskListIds)
    }
  }

  function handleCheckOptions(event){
    setCheckOptions(event.target.value)
    const option = event.target.value
    switch (option) {
      case 'all':
        // fetch everything and mark checkbox as checked
        setSelected([])
        break;
      case 'all_on_the_page':
        // mark checkbox as checked and everything on the page
        setSelected(taskListIds)
      break
      default:
        setSelected([])
        break;
    }
    setCheckOptions(option)
  }

  if (tasksError) return <ErrorPage error={tasksError.message} />;

  return (
    <>
      <div className="container" data-testid="todo-container">
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={message}
          open={!!message}
          handleClose={handleMessageAlertClose}
        />
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
            {// eslint-disable-next-line no-nested-ternary
            !taskId ? (
              <TaskForm
                refetch={handleRefetch}
                close={() => setModalOpen(!open)}
                assignUser={assignUnassignUser}
                users={liteData?.usersLite}
              />
            ) : // eslint-disable-next-line no-nested-ternary
            !taskData ? (
              'No Task found'
            ) : (
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
              {filterCount ? `${filterCount} ${pluralizeCount(filterCount, 'Filter')}` : 'Filter'}
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
        {isLoading || taskLoading ? (
          <Loading />
        ) : (
          <>
            <Grid container spacing={3}>
              <TaskDashboard
                taskData={taskCountData}
                filterTasks={handleTaskFilter}
                currentTile={currentTile}
              />
            </Grid>

            <br />
            {
              currentTile && (
                <Grid item style={{ display: 'flex' }}>
                  <Grid>
                    <Checkbox
                      checked={selectedTasks.length === taskListIds.length}
                      onChange={setSelectAllOption}
                      name="select_all"
                      data-testid="select_all"
                      color="primary"
                      style={{ padding: '0px', marginRight: '15px' }}
                    />
                  </Grid>
                  <Typography> Select </Typography>
                  <Grid>
                    <Select
                      labelId="user-action-select"
                      id="user-action-select"
                      value={checkedOptions}
                      onChange={handleCheckOptions}
                      style={{ height: '23px', marginLeft: '10px' }}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="all_on_the_page">All on this page</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              )
            }
            <br />
            {data?.flaggedNotes.length ? (
              <div>
                {matches && <ListHeaders headers={taskHeader} />}
                <DataList
                  keys={taskHeader}
                  data={renderTaskData({
                    data: data?.flaggedNotes,
                    handleChange,
                    selectedTasks,
                    handleTaskDetails,
                    handleCompleteNote,
                    actionMenu: {
                      open: actionMenuOpen,
                      handleClose: handleTaskActionMenuClose,
                      handleOpen: handleTaskActionMenuOpen,
                    }
                  }
                  )}
                  hasHeader={false}
                />
              </div>
            ) : (
              <CenteredContent>Click a card above to filter</CenteredContent>
            )}
            <br />
            <CenteredContent>
              <Paginate offSet={offset} limit={limit} active handlePageChange={paginate} />
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
  );
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
  }
}));

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
});
