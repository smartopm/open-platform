import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Button,
  useMediaQuery
} from '@mui/material';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';
import { Spinner } from '../../../shared/Loading';

export default function TaskSubTask({
  taskId,
  handleSplitScreenOpen,
  handleTaskCompletion,
  loading,
  data,
  fetchMore
}) {
  const classes = useStyles();
  const limit = 3;
  const matches = useMediaQuery('(max-width:800px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const { t } = useTranslation(['task', 'common']);

  const menuOpen = Boolean(anchorEl);

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

  function checkLastSubTask(index) {
    return index === data?.taskSubTasks?.length - 1;
  }

  return (
    <>
      {data?.taskSubTasks?.length ? (
        <Grid container>
          {data.taskSubTasks.map((task, index) => (
            <Grid
              container
              key={task.id}
              style={!checkLastSubTask(index) ? { borderBottom: '1px solid #EDEDED' } : {}}
            >
              <Grid
                container
                spacing={1}
                item
                md={4}
                xs={6}
                className={classes.bodyAlign}
                data-testid="body"
              >
                <Grid item md={2}>
                  <IconButton
                    aria-controls="task-completion-toggle-button"
                    aria-haspopup="true"
                    data-testid="task_completion_toggle_button"
                    onClick={() => handleTaskCompletion(task.id, !task.completed)}
                    style={{ backgroundColor: 'transparent', margin: '-10px 0 0 -10px' }}
                    size="large"
                  >
                    {task.completed ? (
                      <CheckCircleIcon htmlColor="#4caf50" data-testid="check-icon" />
                    ) : (
                      <CheckCircleOutlineIcon htmlColor="#acacac" />
                    )}
                  </IconButton>
                </Grid>
                <Grid item md={10} data-testid="task-body">
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
              <Grid
                item
                md={3}
                xs={6}
                className={classes.bodyAlign}
                style={{ textAlign: 'right' }}
                data-testid="due-date"
              >
                <Typography variant="body2" component="span">
                  {t('task:sub_task.due')}
                  {task.dueDate ? dateToString(task.dueDate) : 'Never '}
                </Typography>
              </Grid>
              <Grid item md={3} xs={7}>
                <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid item md={2} xs={2} data-testid="subtask-count">
                    <IconButton
                      aria-controls="task-subtasks-icon"
                      data-testid="task_subtasks_count"
                      onClick={() => handleSplitScreenOpen(task)}
                      size="large"
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
                  <Grid item md={2} xs={2} data-testid="comment-count">
                    <IconButton
                      aria-controls="task-comment-icon"
                      data-testid="task_comments_count"
                      onClick={() => handleSplitScreenOpen(task)}
                      size="large"
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
                  <Grid item md={2} xs={2} data-testid="attachment-count">
                    <IconButton
                      aria-controls="task-attach-file-icon"
                      onClick={() => handleSplitScreenOpen(task)}
                      size="large"
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
                    <span data-testid="file-attachments-total">
                      {task.attachments?.length || 0}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2} xs={5} className={classes.bodyAlign} style={{ textAlign: 'right' }}>
                <IconButton
                  onClick={event => handleOpenMenu(event, task)}
                  color="primary"
                  style={{ marginTop: '-10px' }}
                  size="large"
                  data-testid="subtask-options"
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>
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
        <Typography data-testid="no_subtasks" variant="caption">
          {t('task:sub_task.no_sub_tasks')}
        </Typography>
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

TaskSubTask.defaultProps = {
  loading: null,
  fetchMore: () => {},
  data: {}
};

TaskSubTask.propTypes = {
  taskId: PropTypes.string.isRequired,
  handleSplitScreenOpen: PropTypes.func.isRequired,
  handleTaskCompletion: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  fetchMore: PropTypes.func,
  data: PropTypes.shape({
    taskSubTasks: PropTypes.arrayOf(PropTypes.shape())
  })
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
