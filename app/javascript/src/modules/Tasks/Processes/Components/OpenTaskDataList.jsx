/* eslint-disable complexity */
/* eslint-disable max-len */
/* eslint-disable max-lines */
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from 'react-apollo';
import { Grid, IconButton, Typography, Button,
   Divider, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LinkToUserAvatar } from '../../Components/RenderTaskData';
import { dateToString } from '../../../../components/DateContainer';
import { Spinner } from '../../../../shared/Loading'
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectOpenTasksQuery } from '../../graphql/task_queries'
import { formatError } from '../../../../utils/helpers';


export default function OpenTaskDataList({
  taskId,
  handleTaskCompletion,
  handleTodoClick
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:800px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loadMoreError, setloadMoreError] = useState(null);
  const kebabMenuOpen = Boolean(anchorEl);
  const limit = 10;

  function openKebabMenu(event, _task) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTask(_task);
  }

  const { loading, error, data, fetchMore } = useQuery(ProjectOpenTasksQuery, {
    variables: { taskId, limit },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

function fetchMoreOpenTasks() {
  try {
    fetchMore({
      variables: {
        taskId,
        limit: Number(data?.projectOpenTasks?.length + limit),
        offset: data.projectOpenTasks.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return { ...prev, projectOpenTasks: [...prev.projectOpenTasks, ...fetchMoreResult.projectOpenTasks] };
      }
    });
  } catch (e) {
    setloadMoreError(e)
  }
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;

  return (
    <>
      {
        !data?.projectOpenTasks?.length && loading ? <Spinner /> : null
      }
      {
      data?.projectOpenTasks?.length? (
        <Grid container data-testid="open_task_container">
          <Grid item md={12} xs={12} style={{ marginBottom: '2px' }}>
            <Divider />
          </Grid>

          {data?.projectOpenTasks?.map(task => (
            <Fragment key={task.id}>
              <Grid container spacing={1} item md={4} xs={6} className={classes.bodyAlign}>
                <Grid item md={2} xs={2}>
                  <IconButton
                    aria-controls="task-completion-toggle-button"
                    aria-haspopup="true"
                    disabled
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

                <Grid item md={8} xs={10}>
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


              <Grid item md={3} xs={6} className={classes.dueDateAlign}>
                <Typography variant="body2" component="span" data-testid="task_due_date">
                  {t('task:sub_task.due')}
                  {task.dueDate ? dateToString(task.dueDate) : null}
                </Typography>

              </Grid>

              <Grid item md={1} xs={4} data-testid="task_assignee" style={{ display: 'flex', alignItems: 'center' }}>
                { task.assignees.length > 0 && (
                <Grid container style={{paddingLeft: '5px'}}>
                  {task.assignees.slice(0, 2).map(user => (
                    <Grid item md={4} xs={2} key={user.id}>
                      <LinkToUserAvatar key={user.id} user={user} />
                    </Grid>
                          ))}
                  <Grid item md={2} xs={1}>
                    {task.assignees.length > 2 && (
                    <IconButton
                      aria-controls="more-assignees"
                      aria-haspopup="true"
                      data-testid="more-assignees"
                      style={{
                    padding: 0,
                    margin: 0,
                    fontSize: '8px',
                    color: '#000000',
                    opacity: '0.2'
                  }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                            )}
                  </Grid>
                </Grid>
                  )}
              </Grid>

              <Grid item md={4} xs={8}>
                <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid item md={2} xs={2}>
                    <IconButton
                      aria-controls="task-subtasks-icon"
                      data-testid="task_subtasks_count"
                      onClick={() => handleTodoClick(task, 'processes', 'subtasks')}
                    >
                      <AccountTreeIcon
                        fontSize="small"
                        color={task?.subTasks?.length ? 'primary' : 'disabled'}
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={1}
                    xs={1}
                    className={classes.iconItem}
                    style={{ paddingLeft: '8px' }}
                  >
                    <span>{task?.subTasks?.length || 0}</span>
                  </Grid>
                  <Grid item md={2} xs={1}>
                    <IconButton aria-controls="task-comment-icon" data-testid="task_comments_count" onClick={() => handleTodoClick(task, 'processes', 'comments')}>
                      <QuestionAnswerIcon fontSize="small" color={task?.taskCommentsCount ? 'primary' : 'disabled'} />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={2}
                    xs={2}
                    className={classes.iconItem}
                    style={{ paddingLeft: '20px' }}
                  >
                    <span>{task?.taskCommentsCount || 0}</span>
                  </Grid>
                  <Grid item md={2} xs={1}>
                    <IconButton aria-controls="task-attach-file-icon" onClick={() => handleTodoClick(task, 'processes', 'documents')}>
                      <AttachFileIcon
                        fontSize="small"
                        color={task?.attachments?.length ? 'primary' : 'disabled'}
                      />
                    </IconButton>
                  </Grid>
                  <Grid
                    item
                    md={2}
                    xs={2}
                    className={classes.iconItem}
                    style={{ paddingLeft: '5px' }}
                  >
                    <span data-testid="file_attachments_total">{task.attachments?.length || 0}</span>
                  </Grid>
                  <Grid item md={1} xs={1}>
                    <IconButton
                      onClick={event => openKebabMenu(event, task)}
                      color="primary"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Grid>
                </Grid>

              </Grid>
              <Grid item md={12} xs={12} style={{ marginTop: '2px', marginBottom: '2px' }}>
                <Divider data-testid="closing_divider" />
              </Grid>


            </Fragment>

        ))}

          <Grid item md={12} xs={12}>
            {data.projectOpenTasks.length >= limit && (
            <>
              { loadMoreError && <CenteredContent>{formatError(loadMoreError.message)}</CenteredContent> }
              {loading ? (
                <Spinner />
                ) : (
                  <Button onClick={fetchMoreOpenTasks} className={classes.fetchMore}>
                    <Typography variant="body2" data-testid="sub_task_see_more">{t('task:sub_task.see_more')}</Typography>
                    <ArrowDropDownIcon />
                  </Button>
                )}
            </>
            )}
          </Grid>

        </Grid>

      ):(
        <Typography>{t('processes.no_open_tasks')}</Typography>
      )
    }
      <Menu
        id={`kabab-menu-${selectedTask?.id}`}
        anchorEl={anchorEl}
        open={kebabMenuOpen}
        onClose={() => setAnchorEl(null)}
        keepMounted={false}
        data-testid="more_details_menu"
      >
        <MenuItem
          id="open_sub_task_details"
          key="open_sub_task_details"
          onClick={() => handleTodoClick(selectedTask)}
        >
          {t('common:menu.open_task_details')}
        </MenuItem>
      </Menu>
    </>
  );
}

OpenTaskDataList.propTypes = {
  taskId: PropTypes.string.isRequired,
  handleTaskCompletion: PropTypes.func.isRequired,
  handleTodoClick: PropTypes.func.isRequired
};


const useStyles = makeStyles(() => ({
  taskBody: {
    maxWidth: '42ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px',
    paddingTop: '5px'
  },
  taskBodyMobile: {
    maxWidth: '17ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px',
    paddingTop: '5px'
  },

  iconItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px'
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  },
  bodyAlign: {
    paddingTop: '5px'
  },
  dueDateAlign: {
    paddingTop: '10px',
    justifyContent: 'center',
    '@media (min-device-width: 360px) and (max-device-height: 1368px) and (orientation: portrait)' : {
      textAlign: "right",
    },
  },
  fetchMore: {
    padding: '7px',
    marginTop: '16px'
  },
}));
