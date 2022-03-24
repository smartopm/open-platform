import React, { Fragment, useState } from 'react';
import { useQuery } from 'react-apollo';
import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';
import CenteredContent from '../../../shared/CenteredContent';
import { SubTasksQuery } from '../graphql/task_queries';
import { Spinner } from '../../../shared/Loading';
import TaskAddForm from './TaskForm';
import AccessCheck from '../../Permissions/Components/AccessCheck';

export default function TaskSubTask({
  taskId,
  users,
  assignUser,
  handleSplitScreenOpen,
  handleTaskCompletion
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const limit = 3;
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [open, setModalOpen] = useState(false);
  const { t } = useTranslation(['task', 'common']);

  const menuOpen = Boolean(anchorEl);

  const { loading, data, refetch, fetchMore } = useQuery(SubTasksQuery, {
    variables: { taskId, limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function handleOpenMenu(event, task) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSubTask(task);
  }

  function fetchMoreSubTasks() {
    try {
      fetchMore({
        variables: {
          taskId,
          limit: Number(data.taskSubTasks.length + limit),
          offset: data.taskSubTasks.length
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return { ...prev, taskSubTasks: [...prev.taskSubTasks, ...fetchMoreResult.taskSubTasks] };
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleAddSubTask() {
    setModalOpen(true);
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
        <Grid item md={9} xs={11} />  
        <Grid item md={3} xs={1} className={classes.addSubTask}>
          <AccessCheck module="note" allowedPermissions={['can_view_create_sub_task_button']}>
            <IconButton
              edge="end"
              onClick={handleAddSubTask}
              data-testid="add_sub_task_icon"
              color="primary"
              style={{ backgroundColor: 'transparent' }}
            >
              <div style={{ display: 'flex' }}>
                <AddCircleIcon />
                <Typography color="primary" style={{ padding: '2px 0 0 5px' }} variant="caption">
                  Add Task
                </Typography>
              </div>
            </IconButton>
          </AccessCheck>
        </Grid>
      </Grid>
      {data?.taskSubTasks?.length ? (
        <Grid container>
          <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
            <Divider />
          </Grid>
          {data.taskSubTasks.map(task => (
            <Fragment key={task.id}>
              <Grid container spacing={1} item md={4} xs={6} className={classes.bodyAlign}>
                <Grid item md={2}>
                  <IconButton
                    aria-controls="task-completion-toggle-button"
                    aria-haspopup="true"
                    data-testid="task_completion_toggle_button"
                    onClick={() => handleTaskCompletion(task.id, !task.completed)}
                    style={{ backgroundColor: 'transparent', margin: '-10px 0 0 -10px' }}
                  >
                    {task.completed ? (
                      <CheckCircleIcon htmlColor="#4caf50" />
                    ) : (
                      <CheckCircleOutlineIcon htmlColor="#acacac" />
                    )}
                  </IconButton>
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
              <Grid item md={3} xs={6} className={classes.bodyAlign} style={{ textAlign: 'right' }}>
                <Typography variant="body2" component="span">
                  {t('task:sub_task.due')}
                  {task.dueDate ? dateToString(task.dueDate) : 'Never '}
                </Typography>
              </Grid>
              <Grid item md={3} xs={7}>
                <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid item md={2} xs={2}>
                    <IconButton
                      aria-controls="task-subtasks-icon"
                      data-testid="task_subtasks_count"
                      onClick={() => handleSplitScreenOpen(task)}
                    >
                      <AccountTreeIcon
                        fontSize="small"
                        color={task?.subTasksCount ? 'primary' : 'disabled'}
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={1}
                    xs={2}
                    className={classes.iconItem}
                    style={{ paddingLeft: '8px' }}
                  >
                    <span>{task?.subTasksCount || 0}</span>
                  </Grid>
                  <Grid item md={2} xs={2}>
                    <IconButton
                      aria-controls="task-comment-icon"
                      data-testid="task_comments_count"
                      onClick={() => handleSplitScreenOpen(task)}
                    >
                      <QuestionAnswerIcon
                        fontSize="small"
                        color={task?.taskCommentsCount ? 'primary' : 'disabled'}
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={1}
                    xs={2}
                    className={classes.iconItem}
                    style={{ paddingLeft: '8px' }}
                  >
                    <span>{task?.taskCommentsCount || 0}</span>
                  </Grid>
                  <Grid item md={2} xs={2}>
                    <IconButton
                      aria-controls="task-attach-file-icon"
                      onClick={() => handleSplitScreenOpen(task)}
                    >
                      <AttachFileIcon
                        fontSize="small"
                        color={task?.attachments?.length ? 'primary' : 'disabled'}
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={1}
                    xs={2}
                    className={classes.iconItem}
                    style={{ paddingLeft: '5px' }}
                  >
                    <span data-testid="file_attachments_total">{task.attachments?.length || 0}</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2} xs={5} className={classes.bodyAlign} style={{ textAlign: 'right' }}>
                <IconButton
                  onClick={event => handleOpenMenu(event, task)}
                  color="primary"
                  style={{ marginTop: '-10px' }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '2px', marginBottom: '2px' }}>
                <Divider data-testid="closing_divider" />
              </Grid>
            </Fragment>
          ))}
          <Grid item md={12} xs={12}>
            {data.taskSubTasks.length >= limit && (
              <>
                {loading ? (
                  <Spinner />
                ) : (
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
        <Typography data-testid="no_subtasks" variant='caption'>{t('task:sub_task.no_sub_tasks')}</Typography>
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
    justifyContent: 'space-evenly'
  },
  taskBody: {
    maxWidth: '53ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px',
    marginTop: '5px'
  },
  taskBodyMobile: {
    maxWidth: '33ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '6px',
    marginTop: '5px'
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  },
  fetchMore: {
    padding: '7px',
    marginTop: '16px'
  },
  iconsMobile: {
    display: 'none'
  },
  icons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  iconItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px'
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end'
  }
}));
