/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add'
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import { StyleSheet, css } from 'aphrodite';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useLazyQuery } from 'react-apollo';
import { useParams, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { UsersLiteQuery, flaggedNotes } from '../../../graphql/queries';
import { AssignUser, UpdateNote } from '../../../graphql/mutations';
import TaskForm from './TaskForm';
import ErrorPage from '../../../components/Error';
import Paginate from '../../../components/Paginate';
import CenteredContent from '../../../components/CenteredContent';
import { TaskQuickSearch } from './TaskDashboard';
import { futureDateAndTimeToString, dateToString } from '../../../components/DateContainer';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { Spinner } from '../../../shared/Loading';
import QueryBuilder from '../../../components/QueryBuilder';
import { ModalDialog } from '../../../components/Dialog';
import { formatError, pluralizeCount, objectAccessor } from '../../../utils/helpers';
import useDebounce from '../../../utils/useDebounce';
import MessageAlert from '../../../components/MessageAlert';
import { TaskBulkUpdateMutation } from '../graphql/task_mutation';
import { TaskBulkUpdateAction, TaskQuickAction } from './TaskActionMenu';
import TodoItem from './TodoItem';

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
  const [open, setModalOpen] = useState(false);
  const [filterOpen, setOpenFilter] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [currentTile, setCurrentTile] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [filterCount, setFilterCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [searchInputQuery, setSearchInputQuery] = useState('');
  const { taskId } = useParams();
  const [parentTaskId, setParentTaskId] = useState('');
  const history = useHistory();
  const [userNameSearchTerm, setUserNameSearchTerm] = useState('');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const debouncedFilterInputText = useDebounce(userNameSearchTerm, 500);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [checkedOptions, setCheckOptions] = useState('none')
  const taskQuery = {
    completedTasks: 'completed: true',
    tasksDueIn10Days: `due_date >= '${dateToString(new Date())}' AND due_date <= '${futureDateAndTimeToString(10)}' AND completed: false`,
    tasksDueIn30Days: `due_date >= '${dateToString(new Date())}' AND due_date <= '${futureDateAndTimeToString(30)}' AND completed: false`,
    tasksOpen: 'completed: false',
    tasksOpenAndOverdue: `due_date <= '${futureDateAndTimeToString(0)}' AND completed: false`,
    tasksWithNoDueDate: 'due_date:nil',
    myOpenTasks: `assignees: ${currentUser?.name} AND completed: false`,
    totalCallsOpen: 'category: call AND completed: false',
    totalFormsOpen: 'category: form AND completed: false'
  };
  const [selectedTasks, setSelected] = useState([]);
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const { t } = useTranslation(['task', 'common'])

  const taskHeader = [
    { title: 'Select', col: 1 },
    { title: 'Task', value: t('common:table_headers.task'), col: 4 },
    { title: 'Created By', value: t('common:table_headers.created_by'), col: 3 },
    { title: 'Duedate', value: t('common:table_headers.due_date'), col: 1 },
    { title: 'Assignees',value: t('common:table_headers.assignees'), col: 2 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

  function handleChange(selectedId) {
    if (selectedTasks.includes(selectedId)) {
      const currentTasks = selectedTasks.filter(id => id !== selectedId);
      setSelected([...currentTasks]);
    } else {
      setSelected([...selectedTasks, selectedId]);
    }
  }

  function handleTaskDetails({ id, comment }) {
    history.push(`/tasks/${id}${comment ? '?comment=true' : ''}`);
  }

  const [loadAssignees, { data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker'},
    errorPolicy: 'all'
  });

  // eslint-disable-next-line no-nested-ternary
  const qr = query && query.length
    ? query
    : location === 'my_tasks'
    ? `assignees: '${currentUser.name}'`
    : '';

   const joinedTaskQuery =  `${qr} ${
    // eslint-disable-next-line no-nested-ternary
    filterQuery ? `AND ${filterQuery}` : searchInputQuery ? `AND ${searchInputQuery}` : ''
  }`
  const [
    loadTasks,
    { loading: isLoading, error: tasksError, data, refetch, called }
  ] = useLazyQuery(flaggedNotes, {
    variables: {
      offset,
      limit,
      query: joinedTaskQuery
    },
    fetchPolicy: 'network-only'
  });
  const [assignUserToNote] = useMutation(AssignUser);
  const [taskUpdate] = useMutation(UpdateNote)
  const [bulkUpdate] = useMutation(TaskBulkUpdateMutation)
  const taskListIds = data?.flaggedNotes.map(task => task.id)
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
  }

  function assignUnassignUser(noteId, userId) {
    assignUserToNote({ variables: { noteId, userId } })
      .then(() => {
        if (called) {
          refetch();
        }
      })
      .catch(err => setMessage(err.message));
  }

  function handleAddSubTask({ id }) {
    setParentTaskId(id);
    openModal();
  }

  function handleCompleteNote(noteId, completed) {
    taskUpdate({
      variables: { id: noteId, completed: !completed }
    })
      .then(() => {
        setMessage(`Task has been successfully marked as ${completed ? 'incomplete': 'complete'}`);
        setIsSuccessAlert(true);
        refetch()
      })
      .catch(err => {
        setMessage(formatError(err.message))
        setIsSuccessAlert(false);
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
    setCurrentTile(key);
    setQuery(objectAccessor(taskQuery, key));
    // show tasks when a filter has been applied, we might have to move this to useEffect
    loadTasks();
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
            const [inputFilterProperty, inputFilterValue] = objectAccessor(option, operator);

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

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessage('');
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

  function handleCheckOptions(option){
    setCheckOptions(option)
    switch (option) {
      case 'all':
       return setSelected([])
      case 'all_on_the_page':
       return setSelected(taskListIds)
      default:
        return setSelected([])
    }
  }

  function handleBulkUpdate(){
    // handle update here
    setBulkUpdating(true)
    bulkUpdate({ variables: {
      ids: selectedTasks,
      completed: currentTile !== 'completedTasks',
      query: joinedTaskQuery
    }})
    .then(() => {
      handleRefetch()
      setBulkUpdating(false)
      setSelected([])
      setIsSuccessAlert(true);
      setMessage(`Selected Tasks have been successfully marked as ${currentTile === 'completedTasks' ? 'incomplete' : 'complete'}`);
     })
    .catch(err => {
      setBulkUpdating(false)
      setIsSuccessAlert(false);
      setMessage(formatError(err.message))
    })
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
            label={t('common:form_placeholders.note_due_date')}
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
              <span>{taskId ? t('task.task_modal_detail_text') : t('task.task_modal_create_text')}</span>
            </CenteredContent>
          </DialogTitle>
          <DialogContent>
            <TaskForm
              refetch={handleRefetch}
              close={() => setModalOpen(!open)}
              assignUser={assignUnassignUser}
              users={liteData?.usersLite}
              parentTaskId={parentTaskId}
            />
          </DialogContent>
        </Dialog>
        <div className={classes.root}>
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
              <TaskQuickAction
                currentTile={currentTile}
                setSelectAllOption={setSelectAllOption}
                selectedTasks={selectedTasks}
                taskListIds={taskListIds}
                checkedOptions={checkedOptions}
                handleCheckOptions={handleCheckOptions}
                bulkUpdating={bulkUpdating}
                handleBulkUpdate={handleBulkUpdate}
              />
              <TaskQuickSearch filterTasks={handleTaskFilter} />
            </div>
            <div style={{ width: '43%', display: 'flex', alignItems: 'center'}}>
              <TextField
                data-testid="search_input"
                className={`border ${classes.input}`}
                onChange={inputToSearch}
                value={searchText}
                label={t('common:form_placeholders.search_tasks')}
                variant="outlined"
                margin="dense"
                style={{ width: '89%' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  'aria-label': 'search tasks'
                }}
              />
              <IconButton
                data-testid="toggle_filter_btn"
                type="submit"
                className={classes.iconButton}
                aria-label="search"
                onClick={toggleFilterMenu}
              >
                <FilterListIcon />
              </IconButton>
              <Typography>
                {filterCount ? `${filterCount} ${pluralizeCount(filterCount, 'Filter')}` : t('common:misc.filter')}
              </Typography>
            </div>
          </>
        </div>
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
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <br />
            <br />
            <TaskBulkUpdateAction
              checkedOptions={checkedOptions}
              bulkUpdating={bulkUpdating}
              handleBulkUpdate={handleBulkUpdate}
              selectedTasks={selectedTasks}
              currentTile={currentTile}
            />
            {data?.flaggedNotes.length ? (
              <div>
                {data?.flaggedNotes.map(task => (
                  <TodoItem
                    key={task.id}
                    task={task}
                    handleChange={handleChange}
                    selectedTasks={selectedTasks}
                    isSelected={checkedOptions === 'all'}
                    handleTaskDetails={handleTaskDetails}
                    handleCompleteNote={handleCompleteNote}
                    handleAddSubTask={handleAddSubTask}
                    headers={taskHeader}
                  />
                ))}
              </div>
            ) : (
              <CenteredContent>{t('task.click_a_card_to_filter')}</CenteredContent>
            )}
            <br />
            <CenteredContent>
              <Paginate offSet={offset} limit={limit} active={offset >= 1} handlePageChange={paginate} />
            </CenteredContent>
            <Fab
              variant="extended"
              onClick={openModal}
              color="primary"
              className={`${css(styles.taskButton)} `}
              data-testid="create_task_btn"
            >
              <AddIcon />
            </Fab>
          </>
        )}
      </div>
    </>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'right',
    justifyContent: 'space-between',
    width: '100%',
    overflowX: 'auto',
  },
  formControl: {
    minWidth: 160,
    maxWidth: 300
  },
  iconButton: {
  },
  divider: {
    height: 28,
    margin: 4
  },
  input: {
  }
}));

const styles = StyleSheet.create({
  taskButton: {
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    top: 60,
    right: 11,
    color: '#FFFFFF'
  }
});
