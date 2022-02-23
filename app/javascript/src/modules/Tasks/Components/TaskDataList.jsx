/* eslint-disable max-lines */
/* eslint-disable complexity */
import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useQuery } from 'react-apollo';
import { Chip, Grid, IconButton, Typography } from '@material-ui/core';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import Hidden from '@material-ui/core/Hidden';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import Card from '../../../shared/Card';
import CustomProgressBar from '../../../shared/CustomProgressBar';
import { CommentQuery } from '../../../graphql/queries';


export default function TaskDataList({
  task,
  menuData,
  handleClick,
  styles,
  openSubTask,
  handleOpenSubTasksClick,
  handleTaskCompletion,
  clientView
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:800px)');

  const { data } = useQuery(CommentQuery, {
    variables: { taskId: task.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  return (
    <Card styles={styles} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid
          item
          md={3}
          xs={10}
          style={{ display: 'flex', alignItems: 'center' }}
          data-testid="task_body_section"
        >
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item md={2} xs={2}>
              <IconButton
                aria-controls="task-completion-toggle-button"
                aria-haspopup="true"
                data-testid="task_completion_toggle_button"
                onClick={() => handleTaskCompletion(task.id, !task.completed)}
                size="medium"
                disabled={clientView}
              >
                {task.completed ? (
                  <CheckCircleIcon htmlColor="#4caf50" />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </IconButton>
            </Grid>
            <Grid item md={8} xs={10}>
              {
                task.body.length > 35 ?
                (
                  <Tooltip
                    title={task.body}
                    arrow
                    placement="bottom"
                    componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: 'primary',
                        '& .MuiTooltip-arrow': {
                          color: 'primary'
                        }
                      }
                    }
                  }}
                  >
                    <Typography
                      variant="body2"
                      data-testid="task_body"
                      component="p"
                      className={matches ? classes.taskBodyMobile : classes.taskBody}
                    >
                      <span
                        data-testid='task-title'
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                           __html: sanitizeText(removeNewLines(task.body))
                        }}
                      />
                    </Typography>
                  </Tooltip>
                ): (
                  <Typography
                    variant="body2"
                    data-testid="task_body"
                    component="p"
                    className={matches ? classes.taskBodyMobile : classes.taskBody}
                  >
                    <span
                      data-testid='task-title'
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: sanitizeText(removeNewLines(task.body))
                      }}
                    />
                  </Typography>
                )
              }
            </Grid>
            <Grid item md={1} xl={1}>
              <Hidden smDown>
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  data-testid="task-item-menu"
                  dataid={task.id}
                  onClick={event => menuData.handleTodoMenu(event, task)}
                  color="primary"
                >
                  <MoreVertIcon />
                </IconButton>
              </Hidden>
            </Grid>
            {!clientView && (
              <Hidden smDown>
                <Divider orientation="vertical" flexItem sx={{ margin: '-20px 10px' }} />
              </Hidden>
            )}
          </Grid>
        </Grid>
        {!clientView && (
          <Hidden mdUp>
            <Grid item md={1} xs={1} style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.taskMenuIcon}>
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  data-testid="task-item-menu"
                  dataid={task.id}
                  onClick={event => menuData.handleTodoMenu(event, task)}
                  color="primary"
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Grid>
          </Hidden>
        )}
        <Hidden smDown>
          <Grid
            item
            data-testid="task_due_date"
            md={2}
            xs={12}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="body2" component="span">
              {task.dueDate && t('task:sub_task.due')}
              {task.dueDate && dateToString(task.dueDate)}
            </Typography>
          </Grid>
        </Hidden>
        {/* This will be changed to use a tooltip. Commenting out for now for reference */}
        {/* <Grid
          item
          md={1}
          xs={4}
          data-testid="task_assignee"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Hidden smDown>
            {task.assignees.length > 0 && (
              <Grid container style={{ paddingLeft: '5px' }}>
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
          </Hidden>
        </Grid> */}
        <Grid
          item
          data-testid="task_details_section"
          md={3}
          xs={10}
          className={classes.detailsSection}
        >
          <Grid
            container
            data-testid="progress_bar_small_screen"
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {!clientView && task?.subTasksCount > 0 && (
              <Grid item md={2} xs={4} className={classes.progressBar}>
                <Hidden mdUp>
                  <CustomProgressBar task={task} smDown />
                </Hidden>
              </Grid>
            )}

            <Grid item md={10} xs={6}>
              <Grid
                container
                style={{ display: 'flex', justifyContent: 'space-between' }}
                className={classes.detailsContainer}
              >
                <Grid item md={2} xs={1}>
                  <IconButton
                    aria-controls="task-subtasks-icon"
                    aria-haspopup="true"
                    data-testid="task_subtasks"
                    onClick={() => handleClick('subtasks')}
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
                  xs={1}
                  className={classes.iconItem}
                  style={{ marginLeft: '-20px' }}
                >
                  <span>{task?.subTasksCount}</span>
                </Grid>

                <Grid item md={2} xs={1}>
                  <IconButton
                    aria-controls="task-comment-icon"
                    aria-haspopup="true"
                    data-testid="task_comments"
                    onClick={() => handleClick('comments')}
                  >
                    <QuestionAnswerIcon
                      fontSize="small"
                      color={data?.taskComments.length ? 'primary' : 'disabled'}
                    />
                  </IconButton>
                </Grid>

                <Grid
                  item
                  md={1}
                  xs={1}
                  className={classes.iconItem}
                  style={{ marginLeft: '-20px' }}
                >
                  <span data-testid="task-comment">{data?.taskComments.length || 0}</span>
                </Grid>

                <Grid item md={2} xs={1}>
                  <IconButton
                    key={task.id}
                    aria-controls="task-attach-file-icon"
                    aria-haspopup="true"
                    data-testid="task_attach_file"
                    onClick={() => handleClick('documents')}
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
                  xs={1}
                  className={classes.iconItem}
                  style={{ marginLeft: '-25px' }}
                >
                  <span data-testid="file_attachments_total">{task.attachments?.length || 0}</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={1}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          data-testid="progress_bar_large_screen"
        >
          {!clientView && task?.subTasksCount > 0 && (
            <Hidden smDown>
              <CustomProgressBar task={task} smDown={false} />
            </Hidden>
          )}
        </Grid>
        <Grid item md={1} />
        <Grid
          item
          md={1}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
          data-testid="task_status"
        >
          <Hidden smDown>
            <Chip
              data-testid="task_status_chip"
              label={task?.status ? t(`task.${task.status}`) : t('task.not_started')}
              className={task?.status ? classes[task.status] : classes.not_started}
              style={{ color: 'white'}}
              size="small"
            />
          </Hidden>
        </Grid>
        <Grid
          item
          md={1}
          xs={2}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          className={classes.arrowDownUpIcon}
        >
          {task?.subTasksCount > 0 && (
            <IconButton
              aria-controls="show-task-subtasks-icon"
              aria-haspopup="true"
              data-testid="show_task_subtasks"
              onClick={e => handleOpenSubTasksClick(e)}
            >
              {openSubTask ? (
                <KeyboardArrowUpIcon fontSize="small" color="primary" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" color="primary" />
              )}
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}

const Task = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object),
  dueDate: PropTypes.string
};

TaskDataList.defaultProps = {
  handleClick: null,
  styles: {},
  openSubTask: false,
  handleOpenSubTasksClick: null,
  clientView: false
};
TaskDataList.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  menuData: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  openSubTask: PropTypes.bool,
  handleOpenSubTasksClick: PropTypes.func,
  handleTaskCompletion: PropTypes.func.isRequired,
  clientView: PropTypes.bool
};


const useStyles = makeStyles(() => ({
  taskBody: {
    maxWidth: '42ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  taskBodyMobile: {
    maxWidth: '30ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    width: '45%',
    justifyContent: 'space-evenly'
  },
  not_started: {
    background: grey[500]
  },
  at_risk: {
    background: '#C5261B'
  },
  in_progress: {
    background: '#2E72B2'
  },
  needs_attention: {
    background: '#F0C62D'
  },
  complete: {
    background: '#40A06A'
  },
  detailsContainer: {
    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)': {
      justifyContent: 'flex-end'
    }
  },
  iconItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    '@media (min-device-width: 320px) and (max-device-height: 1024px) and (orientation: portrait)': {
      paddingLeft: '20px'
    },
    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)': {
      marginLeft: '-85px !important'
    }
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  },
  taskMenuIcon: {
    '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)': {
      marginLeft: '6px'
    },
    '@media (min-device-width: 375px) and (max-device-height: 812px) and (orientation: portrait)': {
      marginLeft: '6px'
    },
    '@media (min-device-width: 360px) and (max-device-height: 640px) and (orientation: portrait)': {
      marginLeft: '7px'
    },

    '@media (min-device-width: 390px) and (max-device-height: 844px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 412px) and (max-device-height: 914px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 414px) and (max-device-height: 736px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 414px) and (max-device-height: 896px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)': {
      marginLeft: '20px'
    }
  },

  arrowDownUpIcon: {
    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)': {
      marginLeft: '-45px'
    },
    '@media (min-device-width: 540px) and (max-device-height: 720px) and (orientation: portrait)': {
      marginLeft: '-25px'
    }
  },
}));
