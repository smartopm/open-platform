import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-apollo'
import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Chip,
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer'
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';
import CenteredContent from '../../../shared/CenteredContent';
import { SubTasksQuery } from '../graphql/task_queries';
import { Spinner } from '../../../shared/Loading';
import TaskAddForm from './TaskForm';

export default function TaskSubTask({ taskId, users, assignUser, handleSplitScreenOpen, handleTaskCompletion }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const limit = 3;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubTask, setSelectedSubTask] = useState(null)
  const [open, setModalOpen] = useState(false);
  const { t } = useTranslation(['task', 'common']);

  const menuOpen = Boolean(anchorEl);

  const { loading, data, refetch, fetchMore } = useQuery(SubTasksQuery, {
    variables: { taskId, limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  function handleOpenMenu(event, task) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSubTask(task);
  }

  function fetchMoreSubTasks() {
    try {
      fetchMore({
        variables: { taskId, limit: Number(data.taskSubTasks.length + limit), offset: data.taskSubTasks.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return { ...prev, taskSubTasks: [...prev.taskSubTasks, ...fetchMoreResult.taskSubTasks]}
        }
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  function handleAddSubTask() {
   setModalOpen(true)
  }

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={() => setModalOpen(!open)}
        aria-labelledby="task_modal"
      >
        <DialogTitle id="task_modal">
          <CenteredContent>{t('task.task_modal_create_text')}</CenteredContent>
        </DialogTitle>
        <DialogContent>
          <TaskAddForm
            refetch={refetch}
            close={() => setModalOpen(!open)}
            assignUser={assignUser}
            users={users}
            parentTaskId={taskId}
          />
        </DialogContent>
      </Dialog>
      <Grid container className={classes.header}>
        <Grid item md={11} xs={11}>
          <Typography variant="h6" data-testid="sub_tasks_header">
            {t('task:sub_task.sub_tasks')}
          </Typography>
        </Grid>
        <Grid item md={1} xs={1} className={classes.addSubTask}>
          <IconButton
            edge="end"
            onClick={handleAddSubTask}
            size="small"
            data-testid="add_sub_task_icon"
            color="primary"
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
      {data?.taskSubTasks?.length ? (
        <Grid container>
          <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}><Divider /></Grid>
          {data.taskSubTasks.map(task => (
            <Fragment key={task.id}>
              <Grid container spacing={1} item md={5} xs={6} className={classes.bodyAlign}>
                <Grid item md={2}>
                  <Button
                    onClick={() => handleTaskCompletion(task.id, !task.completed)}
                    startIcon={
                      task.completed ? <CheckCircleIcon htmlColor='#4caf50' /> : <CheckCircleOutlineIcon />
                    }
                    style={{ textTransform: 'none' }}
                    data-testid="task_completion_toggle_button"
                  />
                </Grid>
                <Grid item md={10}>
                  <Typography
                    variant="body2"
                    data-testid="task_body"
                    component="p"
                    className={matches ? classes.taskBodyMobile : classes.taskBody}
                  >
                    {task.body}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item md={2} xs={6} className={classes.bodyAlign} style={{textAlign: 'right'}}>
                <Typography variant="body2" component="span">
                  {t('task:sub_task.due')}
                  {task.dueDate ? dateToString(task.dueDate) : 'Never '}
                </Typography>
              </Grid>
              <Grid item md={3} xs={6}>
                <Grid container>
                  <Grid item md={4} style={{display: 'flex'}}>
                    <IconButton
                      aria-controls="task-subtasks-icon"
                      data-testid="task_subtasks_count"
                      size="medium"
                    >
                      <AccountTreeIcon fontSize="small" color={task?.subTasks?.length ? 'primary': 'disabled'} />
                    </IconButton>
                    <span style={{paddingTop: '10px'}}>{task?.subTasks?.length || 0}</span>
                  </Grid>
                  <Grid item md={4} style={{display: 'flex'}}>
                    <IconButton
                      aria-controls="task-comment-icon"
                      data-testid="task_comments_count"
                      size="medium"
                    >
                      <QuestionAnswerIcon fontSize="small" color="disabled" />
                    </IconButton>
                    <span style={{paddingTop: '10px'}}>0</span>
                  </Grid>
                  <Grid item md={4} style={{display: 'flex'}}>
                    <IconButton
                      key={task.id}
                      aria-controls="task-attach-file-icon"
                      size="medium"
                    >
                      <AttachFileIcon fontSize="small" color={task?.documents?.length ? 'primary': 'disabled'} />
                    </IconButton>
                    <span style={{paddingTop: '10px'}} data-testid="file_attachments_total">{task.documents?.length}</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2} xs={6} className={classes.bodyAlign} style={{textAlign: 'right'}}>
                <Grid container>
                  <Grid item md={8} xs={8}>
                    {task.completed
                    ? <Chip size="small" label={t('task.complete')} className={classes.completed} />
                    : <Chip size="small" label={t('task.open')} className={classes.open} />}
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <IconButton
                      onClick={event => handleOpenMenu(event, task)}
                      size="small"
                      color="primary"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '2px', marginBottom: '2px' }}><Divider data-testid="closing_divider" /></Grid>
            </Fragment>
          ))}
          <Grid item md={12} xs={12}>
            {data.taskSubTasks.length >= limit && (
              <>
                {loading
                ? <Spinner />
                : (
                  <Button onClick={fetchMoreSubTasks} className={classes.fetchMore}>
                    <Typography variant="body2">{t('task:sub_task.see_more')}</Typography>
                    <ArrowDropDownIcon />
                  </Button>
                )}
              </>
            )}
          </Grid>
        </Grid>
      ) : (
        <Typography data-testid="no_subtasks">{t('task:sub_task.no_sub_tasks')}</Typography>
      )}
      <Menu
        id={`kabab-menu-${selectedSubTask?.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        keepMounted={false}
        data-testid="more_details_menu"
      >
        <MenuItem
          id="open_sub_task_details"
          key="open_sub_task_details"
          onClick={() => handleSplitScreenOpen(selectedSubTask)}
        >
          {t('common:menu.open_task_details')}
        </MenuItem>
      </Menu>
    </>
  );
}

TaskSubTask.propTypes = {
  taskId: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  assignUser: PropTypes.func.isRequired,
  handleSplitScreenOpen: PropTypes.func.isRequired,
  handleTaskCompletion: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  bodyAlign: {
    paddingTop: '10px'
  },
  alignText: {
    textAlign: 'right'
  },
  header: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  addSubTask: {
    display: 'flex',
    justifyContent: 'end'
  },
  details: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  taskBody: {
    maxWidth: '53ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  taskBodyMobile: {
    maxWidth: '33ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '6px'
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  },
  fetchMore:{
    padding: '7px',
  },
  iconsMobile: {
    display: 'none'
  },
  icons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  }
}));
