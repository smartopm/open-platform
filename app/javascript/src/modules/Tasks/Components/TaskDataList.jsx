/* eslint-disable max-lines */
/* eslint-disable complexity */
import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useLocation } from 'react-router-dom';
import { Chip, Grid, IconButton, Typography, Badge } from '@mui/material';
import { useQuery } from 'react-apollo';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WidgetsIcon from '@mui/icons-material/Widgets';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';
import Card from '../../../shared/Card';
import CustomProgressBar from '../../../shared/CustomProgressBar';
import DateUtils from '../../../utils/dateutil';
import { CommentQuery } from '../../../graphql/queries';

export default function TaskDataList({
  task,
  menuData,
  handleClick,
  styles,
  openSubTask,
  handleOpenSubTasksClick,
  handleTaskCompletion,
  clientView,
  taskCommentHasReply,
  subTaskCard,
  alignStyles,
  handleOpenProjectClick,
  openProject,
  showWidgetsIcon,
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const location = useLocation();
  const matches = useMediaQuery('(max-width:800px)');
  const mdUpHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const mdDownHidden = useMediaQuery(theme => theme.breakpoints.down('md'));

  const overDue = DateUtils.isExpired(task?.dueDate);

  const { data } = useQuery(CommentQuery, {
    variables: { taskId: task.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function taskStatusCharacter() {
    const status = task?.status;
    switch (status) {
      case 'not_assigned':
        return 'N';
      case 'at_risk':
        return 'R';
      case 'needs_attention':
        return 'A';
      case 'in_progress':
        return 'P';
      case 'completed':
        return 'C';
      default:
        return 'N';
    }
  }

  function isTaskList()
  {
    return window.location.pathname === '/tasks/task_lists'
  }

  return (
    <Card styles={styles} contentStyles={{ padding: '4px' }} lateCard={mdDownHidden && overDue}>
      <Grid container>
        <Grid
          item
          md={4}
          xs={8}
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
              {task.body.length > 35 ? (
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
                      data-testid="task-title"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: sanitizeText(removeNewLines(task.body))
                      }}
                    />
                  </Typography>
                </Tooltip>
              ) : (
                <Typography
                  variant="body2"
                  data-testid="task_body"
                  component="p"
                  className={matches ? classes.taskBodyMobile : classes.taskBody}
                >
                  <span
                    data-testid="task-title"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: sanitizeText(removeNewLines(task.body))
                    }}
                  />
                </Typography>
              )}
              {task.submittedBy && !mdDownHidden && (
                <>
                  <Typography variant="caption">Submitted by</Typography>
                  {' '}
                  <Link to={`/user/${task.submittedBy?.id}`}>
                    <Typography variant="caption">{task.submittedBy?.name}</Typography>
                  </Link>
                </>
              )}
            </Grid>
            <Grid item md={1} xl={1} style={alignStyles}>
              {!mdDownHidden && (
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  data-testid="task-item-menu"
                  dataid={task.id}
                  onClick={event => menuData.handleTodoMenu(event, task)}
                  color="primary"
                  size="large"
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Grid>
            {!clientView && !mdDownHidden && (
              <Divider orientation="vertical" flexItem sx={{ margin: '-20px 10px' }} />
            )}
            {task.submittedBy && !mdUpHidden && (
              <Grid item sm={12} md={12} lg={12} xs={12} className={classes.submitedBy}>
                <Typography variant="caption">Submitted by</Typography>
                {' '}
                <Link to={`/user/${task.submittedBy.id}`}>
                  <Typography variant="caption">{task.submittedBy?.name}</Typography>
                </Link>
              </Grid>
            )}
          </Grid>
        </Grid>
        {!mdUpHidden && !subTaskCard && (
          <Grid item data-testid="open_details" xs={2}>
            <Grid
              container
              style={{ textAlign: 'right' }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={11} style={{ textAlign: 'right' }}>
                {showWidgetsIcon && (
                  <IconButton
                    color="primary"
                    size="large"
                    onClick={handleOpenProjectClick}
                    data-testid="open_task_details"
                    disabled={openSubTask}
                  >
                    <WidgetsIcon />
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={1} style={{ marginLeft: '-5px' }}>
                {location.pathname.match(/\bprocesses\b/) && taskCommentHasReply && (
                  <Badge
                    color="warning"
                    badgeContent={(
                      <Typography variant="caption" style={{ color: 'white' }}>
                        R
                      </Typography>
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
        {!mdUpHidden && subTaskCard && (
          <Grid
            item
            xs={2}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
            data-testid="task_status_mobile"
          >
            <Chip
              data-testid="task_status_chip_mobile"
              label={taskStatusCharacter()}
              className={task?.status ? classes[task.status] : classes.not_started}
              style={{ color: 'white' }}
              size="small"
            />
          </Grid>
        )}
        {!clientView && !mdUpHidden && (
          <Grid
            item
            md={1}
            xs={1}
            style={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}
          >
            <Box className={classes.taskMenuIcon}>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                data-testid="task-item-menu"
                dataid={task.id}
                onClick={event => menuData.handleTodoMenu(event, task)}
                color="primary"
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Grid>
        )}
        {!mdDownHidden && (
          <Grid
            item
            data-testid="task_due_date"
            md={2}
            xs={12}
            style={{ display: 'flex', alignItems: 'center' }}
            className={overDue ? classes.overDueColor : undefined}
          >
            <Typography variant="body2" component="span">
              {task.dueDate && t('task:sub_task.due')}
              {task.dueDate && dateToString(task.dueDate)}
            </Typography>
          </Grid>
        )}
        {(!mdDownHidden || (mdDownHidden && !subTaskCard)) && (
          <>
            <Grid
              item
              md={1}
              xs={4}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              data-testid="progress_bar_large_screen"
            >
              {!clientView && task?.subTasksCount > 0 && (
                <CustomProgressBar task={task} smDown={false} />
              )}
            </Grid>
            <Grid item md={1} xs={1} />
            <Grid
              item
              md={1}
              xs={5}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}
              data-testid="task_status"
            >
              {(!isTaskList()) && (
              <Chip
                data-testid="task_status_chip"
                label={task?.status ? t(`task.${task.status}`) : t('task.not_started')}
                className={task?.status ? classes[task.status] : classes.not_started}
                style={{ color: 'white' }}
                size="small"
              />
)}
            </Grid>
          </>
        )}
        {!mdDownHidden && (
          <>
            {!subTaskCard && (
              <Grid item data-testid="open_details" md={2}>
                <Grid
                  container
                  style={{ textAlign: 'right' }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item md={11} style={{ textAlign: 'right' }}>
                    {showWidgetsIcon && (
                      <IconButton
                        color="primary"
                        size="large"
                        onClick={handleOpenProjectClick}
                        disabled={openSubTask}
                      >
                        <WidgetsIcon />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item md={1} style={{ marginLeft: '-17px' }}>
                    {location.pathname.match(/\bprocesses\b/) && taskCommentHasReply && (
                      <Badge
                        color="warning"
                        badgeContent={(
                          <Typography variant="caption" style={{ color: 'white' }}>
                            R
                          </Typography>
                        )}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        )}
        {subTaskCard && (
          <Grid
            item
            data-testid="task_details_section"
            md={2}
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
                  {!mdUpHidden && <CustomProgressBar task={task} smDown />}
                </Grid>
              )}

              <Grid item md={10} xs={6}>
                <Grid
                  container
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  className={classes.detailsContainer}
                >
                  {location.pathname !== '/processes' && (
                    <>
                      <Grid item md={2} xs={1}>
                        <IconButton
                          aria-controls="task-subtasks-icon"
                          aria-haspopup="true"
                          data-testid="task_subtasks"
                          onClick={() => handleClick('subtasks')}
                          color="primary"
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
                        xs={1}
                        className={classes.iconItem}
                        style={{ marginLeft: '-11px' }}
                        color="primary"
                      >
                        <span data-testid="task-subtasks-count">{task?.subTasksCount}</span>
                      </Grid>
                    </>
                  )}

                  <Grid item md={2} xs={1}>
                    <IconButton
                      aria-controls="task-comment-icon"
                      aria-haspopup="true"
                      data-testid="task_comments"
                      onClick={() => handleClick('comments')}
                      color="primary"
                      size="large"
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
                    style={
                      location.pathname.match(/\bprocesses\b/) ? { marginLeft: '-53px' } : { marginLeft: '-11px' }
                    }
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
                      color="primary"
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
                    xs={1}
                    className={classes.iconItem}
                    style={
                      location.pathname.match(/\bprocesses\b/) ? { marginLeft: '-58px' } : { marginLeft: '-16px' }
                    }
                  >
                    <span data-testid="file_attachments_total">
                      {task.attachments?.length || 0}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
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
              color="primary"
              size="large"
              disabled={openProject}
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
  clientView: false,
  taskCommentHasReply: false,
  subTaskCard: false,
  alignStyles: {},
  handleOpenProjectClick: () => {},
  openProject: false,
  showWidgetsIcon: false,
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
  clientView: PropTypes.bool,
  taskCommentHasReply: PropTypes.bool,
  subTaskCard: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  alignStyles: PropTypes.object,
  handleOpenProjectClick: PropTypes.func,
  openProject: PropTypes.bool,
  showWidgetsIcon: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
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
  submitedBy: {
    paddingLeft: '20px'
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
  overDueColor: {
    color: theme.palette.error.main
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
  }
}));
