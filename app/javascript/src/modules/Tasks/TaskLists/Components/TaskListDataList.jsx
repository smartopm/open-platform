import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, IconButton, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import { Context as AuthContext } from '../../../../containers/Provider/AuthStateProvider';
import { removeNewLines, sanitizeText } from '../../../../utils/helpers';
import Card from '../../../../shared/Card';
import MenuList from '../../../../shared/MenuList';

export default function TaskListDataList({
  task,
  handleOpenSubTasksClick,
  handleTodoClick,
  handleAddSubTask,
  styles
}) {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:800px)');
  const mdUpHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const mdDownHidden = useMediaQuery(theme => theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const { t } = useTranslation('common');
  const authState = React.useContext(AuthContext);
  const taskPermissions = authState?.user?.permissions?.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canCreateNote = taskPermissions
    ? taskPermissions.permissions.includes('can_create_note')
    : false;

  const menuList = [
    {
      content: t('menu.open_task_details'),
      isAdmin: true,
      handleClick: () => handleTaskDetails()
    },
    {
      content: canCreateNote ? t('menu.add_subtask') : null,
      isAdmin: true,
      handleClick: () => handleCreateSubTask()
    }
  ];

  const menuData = {
    menuList,
    anchorEl,
    handleTodoMenu,
    open: anchorElOpen,
    handleClose
  };

  function handleTaskDetails() {
    setAnchorEl(null);
    handleTodoClick(selectedTask);
  }

  function handleTodoMenu(event, taskItem) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTask(taskItem);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setSelectedTask(null);
  }

  function handleCreateSubTask() {
    setAnchorEl(null);
    handleAddSubTask({ id: selectedTask.id });
  }

  function handleCaretIconClick(e) {
    setTasksOpen(!!tasksOpen);
    handleOpenSubTasksClick(e);
  }

  return (
    <Card styles={styles} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={6} xs={12} data-testid="task_body_section">
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
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
                    className={isMobile ? classes.taskBodyMobile : classes.taskBody}
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
                  className={isMobile ? classes.taskBodyMobile : classes.taskBody}
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
            </Grid>
            <Grid item md={1} xs={2}>
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

              {!mdUpHidden && (
                <Grid item md={1} xs={1} style={{ display: 'flex', alignItems: 'center' }}>
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
            </Grid>
            {!mdDownHidden && (
              <Divider orientation="vertical" flexItem sx={{ margin: '-20px 10px' }} />
            )}
          </Grid>
        </Grid>

        <Grid
          item
          md={6}
          xs={12}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
          className={classes.arrowDownUpIcon}
        >
          {task?.subTasksCount > 0 && (
            <IconButton
              aria-controls="show-task-subtasks-icon"
              aria-haspopup="true"
              data-testid="show_task_subtasks"
              onClick={e => handleCaretIconClick(e)}
              color="primary"
              size="large"
            >
              {tasksOpen ? (
                <KeyboardArrowUpIcon fontSize="small" color="primary" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" color="primary" />
              )}
            </IconButton>
          )}
        </Grid>

        <MenuList
          open={menuData.open}
          anchorEl={menuData.anchorEl}
          handleClose={menuData.handleClose}
          list={menuData.menuList.filter(menuItem => menuItem.content !== null)}
        />
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

TaskListDataList.defaultProps = {
  handleTodoClick: null,
  handleAddSubTask: null,
  styles: {},
  handleOpenSubTasksClick: null
};
TaskListDataList.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  handleTodoClick: PropTypes.func,
  handleAddSubTask: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  //   openSubTask: PropTypes.bool,
  handleOpenSubTasksClick: PropTypes.func
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

  detailsContainer: {
    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)': {
      justifyContent: 'flex-end'
    }
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
    '@media (min-device-width: 360px) and (max-device-height: 740px) and (orientation: portrait)': {
      marginLeft: '6px'
    },

    '@media (min-device-width: 390px) and (max-device-height: 844px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 393px) and (max-device-height: 851px) and (orientation: portrait)': {
      marginLeft: '12px'
    },

    '@media (min-device-width: 412px) and (max-device-height: 915px) and (orientation: portrait)': {
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
    },

    '@media (min-device-width: 820px) and (max-device-height: 1180px) and (orientation: portrait)': {
      // this is cringy
      marginLeft: '65px'
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
