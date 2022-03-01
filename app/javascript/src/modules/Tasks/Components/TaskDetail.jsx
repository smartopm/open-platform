/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import { Grid, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useLazyQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { UpdateNote } from '../../../graphql/mutations';
import { TaskReminderMutation } from '../graphql/task_reminder_mutation';
import TaskUpdateList from './TaskUpdateList';
import TaskComment from './TaskComment';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import { UsersLiteQuery } from '../../../graphql/queries';
import useDebounce from '../../../utils/useDebounce';
import TaskDocuments from './TaskDocuments';
import TaskInfoTop from './TaskInfoTop';
import TaskSubTask from './TaskSubTask';
import TaskDetailAccordion from './TaskDetailAccordion';
import { useParamsQuery } from '../../../utils/helpers';

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
  const [description, setDescription] = useState('');
  const [, setErrorMessage] = useState('');
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setDate] = useState(new Date());
  const [taskStatus, setTaskStatus] = useState(false);
  const [userData, setData] = useState(initialData);
  const [taskUpdate] = useMutation(UpdateNote);
  const [updated, setUpdated] = useState(false);
  const [autoCompleteOpen, setOpen] = useState(false);
  const [setReminder] = useMutation(TaskReminderMutation);
  const [reminderTime, setReminderTime] = useState(null);
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const path = useParamsQuery();
  const tab = path.get('detailTab');

  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);

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

  const menuData = {
    menuList: getMenuList(),
    anchorEl,
    handleTaskInfoMenu,
    open: anchorElOpen,
    handleClose
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
        setUpdated(true);
        refetch();
      })
      .catch(err => setErrorMessage(err));
  }

  function currentActiveReminder() {
    const assignedNote = data.assigneeNotes?.find(
      assigneeNote => assigneeNote.userId === currentUser.id
    );

    const timeScheduled = reminderTime || assignedNote?.reminderTime;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form>
        <Snackbar
          open={updated}
          autoHideDuration={3000}
          onClose={() => setUpdated(!updated)}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message={t('task.update_successful')}
        />

        <Grid>
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
              icon={(
                <AccountTreeIcon
                  fontSize="large"
                  color="primary"
                  data-testid="sub-task-accordion-icon"
                />
              )}
              title="Sub Tasks"
              styles={{ background: '#FAFAFA' }}
              openDetails={tab === 'subtasks'}
              component={(
                <TaskSubTask
                  taskId={taskId}
                  users={users}
                  assignUser={assignUser}
                  refetch={refetch}
                  handleSplitScreenOpen={handleSplitScreenOpen}
                  handleTaskCompletion={handleTaskCompletion}
                />
              )}
            />
          </div>
          <div className={classes.section} data-testid="task-comments-section">
            <TaskDetailAccordion
              icon={<QuestionAnswerIcon fontSize="large" color="primary" />}
              title="Comments"
              styles={{ background: '#FAFAFA', padding: 0 }}
              component={<TaskComment taskId={taskId} commentsRefetch={commentsRefetch} />}
              openDetails={tab === 'comments'}
            />
          </div>
          <div className={classes.section} data-testid="task-documents-section">
            <TaskDetailAccordion
              icon={<AttachFileIcon fontSize="large" color="primary" />}
              title="Documents"
              styles={{ background: '#FAFAFA' }}
              component={<TaskDocuments taskId={taskId} />}
              openDetails={tab === 'documents'}
            />
          </div>
          <div className={classes.section} data-testid="task-updates-section">
            <TaskDetailAccordion
              icon={<EventNoteIcon fontSize="large" color="primary" />}
              title="Updates"
              styles={{ background: '#FAFAFA' }}
              component={<TaskUpdateList data={historyData} />}
            />
          </div>
        </Grid>
      </form>
    </>
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
