/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Grid, Button } from '@mui/material';
import { useMutation, useLazyQuery, useApolloClient } from 'react-apollo';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { UsersLiteQuery } from '../../../graphql/queries';
import { AssignUser, UpdateNote } from '../../../graphql/mutations';
import useFileUpload from '../../../graphql/useFileUpload';
import TaskForm from './TaskForm';
import ErrorPage from '../../../components/Error';
import Paginate from '../../../components/Paginate';
import CenteredContent from '../../../shared/CenteredContent';
import SearchInput from '../../../shared/search/SearchInput';
import TaskUpdate from '../containers/TaskUpdate';
import TaskQuickSearch from './TaskQuickSearch';
import { futureDateAndTimeToString, dateToString } from '../../../components/DateContainer';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { Spinner } from '../../../shared/Loading';
import QueryBuilder from '../../../components/QueryBuilder';
import { ModalDialog } from '../../../components/Dialog';
import { formatError, objectAccessor, useParamsQuery } from '../../../utils/helpers';
import useDebounce from '../../../utils/useDebounce';
import MessageAlert from '../../../components/MessageAlert';
import { TaskBulkUpdateMutation } from '../graphql/task_mutation';
import { TaskBulkUpdateAction, TaskQuickAction } from './TaskActionMenu';
import TodoItem from './TodoItem';
import SplitScreen from '../../../shared/SplitScreen';
import {
  tasksQueryBuilderInitialValue,
  tasksQueryBuilderConfig,
  tasksFilterFields
} from '../../../utils/constants';
import AccessCheck from '../../Permissions/Components/AccessCheck';
import { TasksLiteQuery } from '../graphql/task_queries';
import PageWrapper from '../../../shared/PageWrapper';

export default function TodoList({
  isDialogOpen,
  handleModal,
  saveDate,
  selectedDate,
  handleDateChange,
  location,
  currentUser
}) {
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setModalOpen] = useState(false);
  const [filterOpen, setOpenFilter] = useState(false);
  const [query, setQuery] = useState('');
  const [currentTile, setCurrentTile] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [, setFilterCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [parentTaskId, setParentTaskId] = useState('');
  const [subTasksCount, setSubTasksCount] = useState(0);
  const history = useHistory();
  const [userNameSearchTerm, setUserNameSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedFilterInputText = useDebounce(userNameSearchTerm, 500);
  const [taskUpdateStatus, setTaskUpdateStatus] = useState({ message: '', success: false });
  const [checkedOptions, setCheckOptions] = useState('none');
  const matches = useMediaQuery('(max-width:959px)');
  const smMatches = useMediaQuery('(max-width:1020px)');
  const taskQuery = {
    completedTasks: 'completed: true',
    tasksDueIn10Days: `due_date >= '${dateToString(
      new Date()
    )}' AND due_date <= '${futureDateAndTimeToString(10)}' AND completed: false`,
    tasksDueIn30Days: `due_date >= '${dateToString(
      new Date()
    )}' AND due_date <= '${futureDateAndTimeToString(30)}' AND completed: false`,
    tasksOpen: 'completed: false',
    tasksOpenAndOverdue: `due_date <= '${futureDateAndTimeToString(0)}' AND completed: false`,
    tasksWithNoDueDate: 'due_date:nil',
    myOpenTasks: `assignees: ${currentUser?.name} AND completed: false`,
    totalCallsOpen: 'category: call AND completed: false',
    processes: 'category: form AND completed: false'
  };
  const [selectedTasks, setSelected] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [splitScreenOpen, setSplitScreenOpen] = useState(false);
  const { t } = useTranslation(['task', 'common']);

  const path = useParamsQuery();
  const taskURLFilter = path.get('filter');
  const redirectedTaskId = path.get('taskId');

  const { onChange, signedBlobId, status } = useFileUpload({
    client: useApolloClient()
  });

  function handleChange(selectedId) {
    if (selectedTasks.includes(selectedId)) {
      const currentTasks = selectedTasks.filter(id => id !== selectedId);
      setSelected([...currentTasks]);
    } else {
      setSelected([...selectedTasks, selectedId]);
    }
  }

  const [loadAssignees, { data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query:
        'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker OR user_type:consultant OR user_type:developer'
    },
    errorPolicy: 'all'
  });

  // eslint-disable-next-line no-nested-ternary
  const qr =
    query && query.length
      ? query
      : location === 'my_tasks'
      ? `assignees: '${currentUser.name}'`
      : '';

  const joinedTaskQuery = `${qr} ${
    // eslint-disable-next-line no-nested-ternary
    filterQuery ? `AND ${filterQuery}` : searchText ? `AND ${searchText}` : ''
  }`;

  const [
    loadTasks,
    { loading: isLoading, error: tasksError, data, refetch, called }
  ] = useLazyQuery(TasksLiteQuery, {
    variables: {
      offset,
      limit,
      query: joinedTaskQuery
    },
    fetchPolicy: 'cache-and-network'
  });

  const [assignUserToNote] = useMutation(AssignUser);
  const [taskUpdate] = useMutation(UpdateNote);
  const [bulkUpdate] = useMutation(TaskBulkUpdateMutation);
  const taskListIds = data?.flaggedNotes.map(task => task.id);

  function openModal() {
    setModalOpen(!open);
  }

  useEffect(() => {
    // only fetch admins when the  modal is opened or when the select is triggered
    if (open || filterOpen) {
      loadAssignees();
    }
    // load tasks on runtime when we are on my task page from notification
    if (location !== 'tasks') {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadAssignees, filterOpen, location]);

  useEffect(() => {
    if (debouncedFilterInputText) {
      if (location !== 'my_tasks' && !taskURLFilter) {
        setQuery('completed: false');
      }
      setFilterQuery(`${debouncedFilterInputText}`);
      loadTasks();
    }

    // for tasks searched using the top search bar input
    if (debouncedSearchText) {
      if (location !== 'my_tasks' && !taskURLFilter) {
        setQuery('completed: false');
      }
      setSearchText(debouncedSearchText);
      loadTasks();
    }

    // TODO: Remove this quick fix after we move a modularized dashboard for each logged in user
    if (taskURLFilter) {
      if (taskURLFilter in taskQuery) {
        setCurrentTile(taskURLFilter);
        setQuery(objectAccessor(taskQuery, taskURLFilter));
        loadTasks();
      }
    }

    if (!query && !debouncedFilterInputText && !debouncedSearchText && !taskURLFilter) {
      // Default to my tasks filter
      setQuery(objectAccessor(taskQuery, 'myOpenTasks'));
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterInputText, debouncedSearchText, loadTasks]);

  function handleRefetch() {
    refetch();
  }

  useEffect(() => {
    if (status === 'DONE') {
      taskUpdate({ variables: { id: selectedTask.id, documentBlobId: signedBlobId } })
        .then(() => {
          refetch();
        })
        .catch(error => {
          setTaskUpdateStatus({
            ...taskUpdateStatus,
            success: false,
            message: formatError(error.message)
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedTask, signedBlobId, taskUpdate, refetch]);

  useEffect(() => {
    if (redirectedTaskId) {
      setSplitScreenOpen(true);
    }
  }, [redirectedTaskId]);

  function handleTaskCompletion(selectedTaskId, completed) {
    taskUpdate({ variables: { id: selectedTaskId, completed } })
      .then(() => {
        refetch();
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: true,
          message: `${t('task.task_marked_as')} ${
            completed ? t('task.complete') : t('task.incomplete')
          }`
        });
      })
      .catch(error => {
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: false,
          message: formatError(error.message)
        });
      });
  }

  function assignUnassignUser(noteId, userId) {
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => {
        if (called) {
          refetch();
        }
      })
      .catch(err =>
        setTaskUpdateStatus({ ...taskUpdateStatus, success: false, message: err.message })
      );
  }

  function handleAddSubTask(task) {
    setParentTaskId(task?.id);
    setSubTasksCount(task?.subTasksCount);
    openModal();
  }

  function handleCloseTaskForm() {
    if (open) {
      setParentTaskId('');
      setSubTasksCount(0);
    }
    setModalOpen(!open);
  }

  function handleUploadDocument(event, todoItem) {
    onChange(event.target.files[0]);
    setSelectedTask(todoItem);
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
    setCurrentTile(key);
    setQuery(objectAccessor(taskQuery, key));
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks();
    history.push(`/tasks?filter=${key}`);
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

  const builderConfig = {
    ...tasksQueryBuilderConfig,
    fields: {
      assignee: {
        ...tasksQueryBuilderConfig.fields.assignee
      },
      userName: {
        ...tasksQueryBuilderConfig.fields.userName
      }
    }
  };

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
            const [inputFilterProperty, inputFilterValue] = objectAccessor(option, operator);

            property = tasksFilterFields[inputFilterProperty.var];
            value = inputFilterValue;
            operator = ':';

            return `${property}${operator} '${value}'`;
          })
          .join(` ${conjugate} `);

        // debounce only for user's Name
        setUserNameSearchTerm(queryText);
        setFilterCount(availableConjugate.length);
      }
    }
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setTaskUpdateStatus({
      ...taskUpdateStatus,
      message: ''
    });
  }

  function handleCheckOptions(option) {
    setCheckOptions(option);
    switch (option) {
      case 'all':
        return setSelected([]);
      case 'all_on_the_page':
        return setSelected(taskListIds);
      default:
        return setSelected([]);
    }
  }

  function handleBulkUpdate() {
    // handle update here
    setBulkUpdating(true);
    bulkUpdate({
      variables: {
        ids: selectedTasks,
        completed: currentTile !== 'completedTasks',
        query: joinedTaskQuery
      }
    })
      .then(() => {
        handleRefetch();
        setBulkUpdating(false);
        setSelected([]);
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: true,
          message: `${t('task.selected_task_marked_as')} ${
            currentTile === 'completedTasks' ? t('task.incomplete') : t('task.complete')
          }`
        });
      })
      .catch(err => {
        setBulkUpdating(false);
        setTaskUpdateStatus({
          ...taskUpdateStatus,
          success: false,
          message: formatError(err.message)
        });
      });
  }

  function handleTodoItemClick(task, pro, tab) {
    setSelectedTask(task);
    setSplitScreenOpen(true);
    history.push({
      pathname: '/tasks',
      search: `?taskId=${task?.id}&detailTab=${tab}`,
      state: { from: history.location.pathname, search: history.location.search }
    });
    window.document.getElementById('anchor-section').scrollIntoView();
  }

  function handleSplitScreenClose() {
    setSplitScreenOpen(false);
    if (history.location.state?.search?.includes('filter')) {
      return history.push({
        pathname: '/tasks',
        search: history.location.state.search
      });
    }
    return history.push('/tasks');
  }

  function handleTaskNotFoundError(error) {
    setSplitScreenOpen(false);
    setTaskUpdateStatus({ ...taskUpdateStatus, message: formatError(error.message) });
    history.push('/tasks');
  }

  const rightPanelObj = [
    {
      mainElement: matches ? (
        <IconButton color="primary" data-testid="search" onClick={() => setSearchOpen(!searchOpen)}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 1
    },
    {
      mainElement: (
        <TaskQuickAction checkedOptions={checkedOptions} handleCheckOptions={handleCheckOptions} />
      ),
      key: 2
    },
    {
      mainElement: (
        <AccessCheck module="note" allowedPermissions={['can_view_create_task_button']} show404ForUnauthorized={false}>
          {smMatches ? (
            <Button
              onClick={openModal}
              variant="contained"
              color="primary"
              style={{ color: '#FFFFFF', margin: '0 5px 0 8px' }}
              data-testid="create_task_btn"
              disableElevation
            >
              <AddIcon />
            </Button>
          ) : (
            <Button
              startIcon={<AddIcon />}
              onClick={openModal}
              variant="contained"
              color="primary"
              style={{ color: '#FFFFFF' }}
              data-testid="create_task_btn"
              disableElevation
            >
              {t('common:misc.add_new')}
            </Button>
          )}
        </AccessCheck>
      ),
      key: 3
    },
    {
      mainElement: <TaskQuickSearch filterTasks={handleTaskFilter} currentTile={currentTile} />,
      key: 4
    }
  ];

  if (tasksError) return <ErrorPage error={tasksError.message} />;

  return (
    <>
      <Dialog fullScreen open={open} fullWidth onClose={openModal} aria-labelledby="task_modal">
        <TaskForm
          refetch={handleRefetch}
          close={() => handleCloseTaskForm()}
          assignUser={assignUnassignUser}
          users={liteData?.usersLite}
          parentTaskId={parentTaskId}
          subTasksCount={subTasksCount}
        />
      </Dialog>
      <PageWrapper pageTitle={t('common:table_headers.task')} rightPanelObj={rightPanelObj}>
        <div data-testid="todo-container">
          <MessageAlert
            type={taskUpdateStatus.success ? 'success' : 'error'}
            message={taskUpdateStatus.message}
            open={!!taskUpdateStatus.message}
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
              label={t('common:form_placeholders.note_due_date')}
            />
          </ModalDialog>
          <Grid container spacing={1}>
            {searchOpen && (
              <>
                <Grid
                  item
                  md={4}
                  xs={8}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                  <SearchInput
                    filterRequired
                    title={t('common:form_placeholders.search_tasks')}
                    searchValue={searchText}
                    handleSearch={inputToSearch}
                    handleFilter={toggleFilterMenu}
                    handleClear={() => setSearchText('')}
                    data-testid="search_input"
                  />
                </Grid>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                  data-testid="filter_container"
                >
                  <Grid
                    container
                    style={{
                      width: '200%',
                      position: 'absolute',
                      zIndex: 1,
                      marginTop: '-2px',
                      display: displayBuilder
                    }}
                  >
                    <QueryBuilder
                      handleOnChange={handleQueryOnChange}
                      builderConfig={builderConfig}
                      initialQueryValue={tasksQueryBuilderInitialValue}
                      addRuleLabel="Add filter"
                    />
                  </Grid>
                </div>
              </>
            )}
          </Grid>
          <br />
          {isLoading ? (
            <Spinner />
          ) : (
            <div data-testid="todo-list-container">
              <TaskBulkUpdateAction
                checkedOptions={checkedOptions}
                bulkUpdating={bulkUpdating}
                handleBulkUpdate={handleBulkUpdate}
                selectedTasks={selectedTasks}
                currentTile={currentTile}
              />
              {Boolean(data?.flaggedNotes.length) && (
                <SplitScreen open={splitScreenOpen} onClose={() => setSplitScreenOpen(false)}>
                  <TaskUpdate
                    taskId={redirectedTaskId || data?.flaggedNotes[0].id}
                    handleSplitScreenOpen={handleTodoItemClick}
                    handleSplitScreenClose={handleSplitScreenClose}
                    handleTaskCompletion={handleTaskCompletion}
                    handleTaskNotFoundError={handleTaskNotFoundError}
                  />
                </SplitScreen>
              )}
              {data?.flaggedNotes.length ? (
                <div>
                  {data?.flaggedNotes.map(task => (
                    <TodoItem
                      key={task.id}
                      task={task}
                      query={joinedTaskQuery}
                      handleChange={handleChange}
                      selectedTasks={selectedTasks}
                      isSelected={checkedOptions === 'all'}
                      handleAddSubTask={handleAddSubTask}
                      handleUploadDocument={handleUploadDocument}
                      handleTodoClick={handleTodoItemClick}
                      handleTaskCompletion={handleTaskCompletion}
                      refetch={refetch}
                    />
                  ))}
                </div>
              ) : (
                <CenteredContent>{t('task.no_tasks')}</CenteredContent>
              )}
              <br />
              <CenteredContent>
                <Paginate
                  count={data?.flaggedNotes?.length}
                  offSet={offset}
                  limit={limit}
                  active={offset >= 1}
                  handlePageChange={paginate}
                />
              </CenteredContent>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}

TodoList.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
  saveDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  handleDateChange: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
};
