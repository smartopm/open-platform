/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Grid,
  InputLabel,
  FormControl,
  Snackbar,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@material-ui/core';
import { useMutation, useLazyQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import AlarmIcon from '@material-ui/icons/Alarm';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DatePickerDialog from '../../../components/DatePickerDialog';
import CenteredContent from '../../../components/CenteredContent';
import { UpdateNote } from '../../../graphql/mutations';
import { TaskReminderMutation } from '../graphql/task_reminder_mutation';
import { UserChip } from './UserChip';
import { NotesCategories } from '../../../utils/constants';
import Toggler from '../../../components/Campaign/ToggleButton';
import { sanitizeText, pluralizeCount } from '../../../utils/helpers';
import RemindMeLaterMenu from './RemindMeLaterMenu';
import TaskUpdateList from './TaskUpdateList';
import TaskComment from './TaskComment';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import { UsersLiteQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import UserAutoResult from '../../../shared/UserAutoResult';
import TaskDocuments from './TaskDocuments';
import TaskInfoTop from './TaskInfoTop';

const initialData = {
  user: '',
  userId: ''
};

export default function TaskForm({
  users,
  data,
  assignUser,
  refetch,
  currentUser,
  historyData,
  historyRefetch,
  authState,
  taskId
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setErrorMessage] = useState('');
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState(false);
  const [loading, setLoadingStatus] = useState(false);
  const [userData, setData] = useState(initialData);
  const [taskUpdate] = useMutation(UpdateNote);
  const [updated, setUpdated] = useState(false);
  const [autoCompleteOpen, setOpen] = useState(false);
  const [setReminder] = useMutation(TaskReminderMutation);
  const [reminderTime, setReminderTime] = useState(null);
  const [mode, setMode] = useState('preview');
  const { t } = useTranslation(['task', 'common']);

  const [type, setType] = useState('task');
  const handleType = (_event, value) => {
    setType(value);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Todo: figure out why reusing the customautocomplete component does not work for task update
  const [searchedUser, setSearchUser] = useState('');
  const debouncedValue = useDebounce(searchedUser, 500);

  const allowedAssignees = ['admin', 'custodian', 'security_guard', 'contractor', 'site_worker'];

  const [searchUser, { data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: {
      query:
        debouncedValue.length > 0
          ? debouncedValue
          : 'user_type:admin OR user_type:custodian OR user_type:security_guard OR user_type:contractor',
      limit: 10
    },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  function handleSubmit(event) {
    event.preventDefault();
    setLoadingStatus(true);
    updateTask();
  }

  function handleTaskComplete() {
    // call the mutation with just the complete status
    setLoadingStatus(true);
    taskUpdate({
      variables: { id: data.id, completed: !taskStatus }
    })
      .then(() => {
        setLoadingStatus(false);
        setUpdated(true);
        refetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }

  function updateTask(newDueDate) {
    taskUpdate({
      variables: {
        id: data.id,
        body: title,
        dueDate: newDueDate || selectedDate,
        description,
        category: taskType,
        flagged: true,
        userId: userData.userId
      }
    })
      .then(() => {
        setLoadingStatus(false);
        setUpdated(true);
        refetch();
        historyRefetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }

  function setDefaultData() {
    setTitle(data.body);
    setTaskType(data.category);
    setTaskStatus(data.completed);
    setDescription(data.description);
    setDate(data.dueDate);
    setData({
      user: data.user.name,
      userId: data.user.id,
      imageUrl: data.user.imageUrl
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
        const timeScheduled = new Date(Date.now() + hour * 60 * 60000).toISOString();
        setReminderTime(timeFormat(timeScheduled));
      })
      .catch(err => setErrorMessage(err));
  }

  function currentActiveReminder() {
    const assignedNote = data.assigneeNotes.find(
      assigneeNote => assigneeNote.userId === currentUser.id
    );

    const timeScheduled = reminderTime || assignedNote?.reminderTime;
    let formattedTime = null;
    if (timeScheduled && new Date(timeScheduled).getTime() > new Date().getTime()) {
      formattedTime = timeFormat(timeScheduled);
    }

    return formattedTime;
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function isCurrentUserAnAssignee() {
    return data.assignees.find(assignee => assignee.id === currentUser.id);
  }

  function setDueDate(date) {
    setDate(date);
    updateTask(date);
  }

  useEffect(() => {
    setDefaultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid>
        <RemindMeLaterMenu
          taskId={data.id}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          setTaskReminder={setTaskReminder}
        />
      </Grid>
      <form onSubmit={handleSubmit}>
        {isCurrentUserAnAssignee() && (
          <Button
            color="primary"
            style={{
              float: 'right'
            }}
            onClick={handleOpenMenu}
          >
            {currentActiveReminder() ? t('task.change_reminder_text') : t('task.reminder_text')}
          </Button>
        )}
        {isCurrentUserAnAssignee() && currentActiveReminder() && (
          <>
            <Typography variant="subtitle1" style={{ margin: '5px 5px 10px 0', float: 'right' }}>
              {currentActiveReminder()}
            </Typography>
            <AlarmIcon style={{ float: 'right', marginTop: '5px' }} />
          </>
        )}
        <Snackbar
          open={updated}
          autoHideDuration={3000}
          onClose={() => setUpdated(!updated)}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message={t('task.update_successful')}
        />

        <Toggler
          type={type}
          handleType={handleType}
          data={{
            type: 'task',
            antiType: 'updates'
          }}
        />

        {type === 'task' ? (
          <>
            <TaskInfoTop
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
            />
            <TaskComment authState={authState} taskId={taskId} />
            <TaskDocuments documents={data.attachments} />
          </>
        ) : (
          <TaskUpdateList data={historyData} />
          )}
      </form>


    </>
  );
}

TaskForm.defaultProps = {
  users: [],
  data: {},
  historyData: [],
  authState: {},
  taskId: ''
};
TaskForm.propTypes = {
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
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object,
  taskId: PropTypes.string
};
