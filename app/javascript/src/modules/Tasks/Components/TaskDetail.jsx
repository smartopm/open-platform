/* eslint-disable max-statements */
import React, { useState, useEffect, useContext } from 'react';
import { Grid } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { useMutation, useLazyQuery, useApolloClient, useQuery } from 'react-apollo';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UpdateNote } from '../../../graphql/mutations';
import { TaskReminderMutation, UnsetTaskReminderMutation } from '../graphql/task_reminder_mutation';
import TaskUpdateList from './TaskUpdateList';
import TaskComment from './TaskComment';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import { UsersLiteQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import TaskDocuments from './TaskDocuments';
import TaskInfoTop from './TaskInfoTop';
import TaskSubTask from './TaskSubTask';
import TaskDetailAccordion from './TaskDetailAccordion';
import { formatError, useParamsQuery } from '../../../utils/helpers';
import { SubTasksQuery, TaskDocumentsQuery } from '../graphql/task_queries';
import AddSubTask from './AddSubTask';
import useFileUpload from '../../../graphql/useFileUpload';
import AddDocument from './AddDocument';
import { SnackbarContext } from '../../../shared/snackbar/Context';
import { addHourToCurrentTime } from '../utils';

const initialData = {
  user: '',
  userId: ''
};

export default function TaskDetail({
  users,
  data,
  assignUser,
  refetch,
  currentUser,
  historyData,
  historyRefetch,
  taskId,
  handleSplitScreenOpen,
  handleSplitScreenClose,
  handleTaskCompletion,
  commentsRefetch,
  forProcess,
  fromLeadPage
}) {
  const [title, setTitle] = useState('');
  const limit = 3;
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState(false);
  const [userData, setData] = useState(initialData);
  const [taskUpdate] = useMutation(UpdateNote);
  const [autoCompleteOpen, setOpen] = useState(false);
  const [setReminder] = useMutation(TaskReminderMutation);
  const [unsetReminder] = useMutation(UnsetTaskReminderMutation);
  const [reminderTime, setReminderTime] = useState(null);
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const path = useParamsQuery();
  const tab = path.get('detailTab');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);

  const { showSnackbar, messageType } = useContext(SnackbarContext)

  // Todo: figure out why reusing the customautocomplete component does not work for task update
  const [searchedUser, setSearchUser] = useState('');
  const debouncedValue = useDebounce(searchedUser, 500);

  const [searchUser, { data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query:
        debouncedValue.length > 0
          ? debouncedValue
          : 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor OR user_type:site_worker OR user_type:developer',
      limit: 10
    },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  const { loading, data: subTaskData, refetch: subTaskRefetch, fetchMore } = useQuery(
    SubTasksQuery,
    {
      variables: { taskId, limit },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  const { onChange, signedBlobId, status } = useFileUpload({
    client: useApolloClient()
  });

  const { data: docData, loading: docLoading, error: docError, refetch: docRefetch } = useQuery(
    TaskDocumentsQuery,
    {
      variables: { taskId },
      fetchPolicy: 'cache-and-network'
    }
  );

  const menuData = {
    menuList: getMenuList(),
    anchorEl,
    handleTaskInfoMenu,
    open: anchorElOpen,
    handleClose,
    handleUnsetReminder: (e) => handleUnsetReminder(e),
  };

  function getMenuList() {
    return [
      {
        content: t('task:task.task_reminder_in_1_hr'),
        isAdmin: false,
        handleClick: () => setTaskReminder(1)
      },
      {
        content: t('task:task.task_reminder_in_24_hr'),
        isAdmin: false,
        handleClick: () => setTaskReminder(24)
      },
      {
        content: t('task:task.task_reminder_in_72_hr'),
        isAdmin: false,
        handleClick: () => setTaskReminder(72)
      }
    ];
  }

  function handleTaskComplete() {
    taskUpdate({
      variables: { id: data.id, completed: !taskStatus }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('task.update_successful') });
        refetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  function updateTask(newDueDate) {
    taskUpdate({
      variables: {
        id: data.id,
        body: title,
        dueDate: newDueDate,
        description,
        category: taskType,
        flagged: true,
        userId: userData.userId
      }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('task.update_successful') });
        refetch();
        historyRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  function setDefaultData() {
    setTitle(data.body);
    setTaskType(data.category);
    setTaskStatus(data.completed);
    setDescription(data.description);
    setDate(data.dueDate);
    setData({
      user: data.user?.name,
      userId: data.user?.id,
      imageUrl: data.user?.imageUrl
    });
  }

  function handleOpenAutoComplete() {
    setOpen(!autoCompleteOpen);
  }

  function timeFormat(time) {
    return `${dateToString(time)}, ${dateTimeToString(time)}`;
  }

  function setTaskReminder(hour) {
    setReminder({
      variables: { noteId: data.id, hour }
    })
      .then(() => {
        handleClose();
        const timeScheduled = addHourToCurrentTime(hour);
        setReminderTime(timeFormat(timeScheduled));
        showSnackbar({ type: messageType.success, message: t('task.update_successful') });
        refetch();
      })
      .catch(err => showSnackbar({ type: messageType.error, message: formatError(err.message) }));
  }

  function handleUnsetReminder(e){
    e.stopPropagation()

    unsetReminder({
      variables: { noteId: data.id }
    })
      .then(() => {
        setReminderTime(null);
        refetch();
        showSnackbar({ type: messageType.success, message: t('task.update_successful') });
      })
      .catch(err => showSnackbar({ type: messageType.error, message: formatError(err.message) }));
  }

  function currentActiveReminder() {
    const assignedNote = data.assigneeNotes?.find(
      assigneeNote => assigneeNote.userId === currentUser.id
    );

    const timeScheduled = reminderTime || new Date(assignedNote?.reminderTime);
    let formattedTime = null;
    if (timeScheduled && new Date(timeScheduled).getTime() > new Date().getTime()) {
      formattedTime = timeFormat(timeScheduled);
    }

    return formattedTime;
  }

  function handleTaskInfoMenu(event) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function isCurrentUserAnAssignee() {
    return data.assignees?.find(assignee => assignee.id === currentUser.id);
  }

  function setDueDate(date) {
    setDate(date);
    updateTask(date);
  }

  useEffect(() => {
    setDefaultData();
  }, [data]);

  return (
    <div data-testid='task-detail'>
      <form>
        <Grid style={{ paddingBottom: '20px' }}>
          <div className={classes.section} data-testid="task-info-section">
            <TaskInfoTop
              currentUser={currentUser}
              users={users}
              data={data}
              setDate={setDueDate}
              selectedDate={selectedDate}
              assignUser={assignUser}
              autoCompleteOpen={autoCompleteOpen}
              handleOpenAutoComplete={handleOpenAutoComplete}
              liteData={liteData}
              setSearchUser={setSearchUser}
              searchUser={searchUser}
              menuData={menuData}
              isAssignee={isCurrentUserAnAssignee}
              activeReminder={currentActiveReminder()}
              handleSplitScreenClose={handleSplitScreenClose}
              refetch={refetch}
              handleTaskComplete={handleTaskComplete}
              forProcess={forProcess}
              fromLeadPage={fromLeadPage}
            />
          </div>
          <div className={classes.section} data-testid="task-subtasks-section" id="anchor-section">
            <TaskDetailAccordion
              title={t('sub_task.sub_tasks')}
              styles={{ background: '#FAFAFA' }}
              openDetails={!matches ? true : tab === 'subtasks'}
              addButton={(
                <AddSubTask
                  refetch={subTaskRefetch}
                  assignUser={assignUser}
                  users={users}
                  taskId={taskId}
                />
              )}
              component={(
                <TaskSubTask
                  taskId={taskId}
                  handleSplitScreenOpen={handleSplitScreenOpen}
                  handleTaskCompletion={handleTaskCompletion}
                  loading={loading}
                  data={subTaskData}
                  fetchMore={fetchMore}
                />
              )}
            />
          </div>
          <div className={classes.section} data-testid="task-comments-section">
            <TaskDetailAccordion
              title={t('common:misc.comments')}
              styles={{ background: '#FAFAFA', padding: 0 }}
              component={(
                <TaskComment
                  taskId={taskId}
                  commentsRefetch={commentsRefetch}
                  forProcess={forProcess}
                  taskAssignees={data.assignees}
                  taskDocuments={data.attachments}
                />
              )}
              openDetails={!matches ? true : tab === 'comments'}
            />
          </div>
          <div className={classes.section} data-testid="task-documents-section">
            <TaskDetailAccordion
              title={t('document.documents')}
              styles={{ background: '#FAFAFA' }}
              addButton={(
                <AddDocument
                  onChange={onChange}
                  status={status}
                  signedBlobId={signedBlobId}
                  taskId={taskId}
                  refetch={refetch}
                />
              )}
              component={(
                <TaskDocuments
                  data={docData}
                  loading={docLoading}
                  error={docError?.message}
                  refetch={docRefetch}
                  status={status}
                />
              )}
              openDetails={!matches ? true : tab === 'documents'}
            />
          </div>
          <div className={classes.section} data-testid="task-updates-section">
            <TaskDetailAccordion
              title={t('task.updates')}
              styles={{ background: '#FAFAFA' }}
              component={<TaskUpdateList data={historyData} />}
              openDetails={!matches}
            />
          </div>
        </Grid>
      </form>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  section: {
    marginBottom: '32px'
  }
}));

TaskDetail.defaultProps = {
  users: [],
  data: {},
  historyData: [],
  taskId: '',
  handleSplitScreenOpen: () => {},
  handleSplitScreenClose: () => {},
  commentsRefetch: () => {},
  forProcess: false,
  fromLeadPage: false
};
TaskDetail.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  assignUser: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  currentUser: PropTypes.object.isRequired,
  historyData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ),
  historyRefetch: PropTypes.func.isRequired,
  taskId: PropTypes.string,
  handleSplitScreenOpen: PropTypes.func,
  handleSplitScreenClose: PropTypes.func,
  handleTaskCompletion: PropTypes.func.isRequired,
  commentsRefetch: PropTypes.func,
  forProcess: PropTypes.bool,
  fromLeadPage: PropTypes.bool
};
