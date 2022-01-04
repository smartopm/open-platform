/* eslint-disable complexity */
/* eslint-disable max-len */
/* eslint-disable max-lines */
import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Checkbox, Grid, IconButton, Typography } from '@material-ui/core';
import Divider from '@mui/material/Divider';
import Hidden from '@material-ui/core/Hidden';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme, makeStyles } from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Box from '@mui/material/Box';
import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import DateContainer, { dateToString } from '../../../components/DateContainer';
import MenuList from '../../../shared/MenuList';
import UserAvatar from '../../Users/Components/UserAvatar';
import Card from '../../../shared/Card';
import CustomProgressBar from '../../../shared/CustomProgressBar';
// TODO: Put in a more shareable directory
export function LinkToUser({ userId, name }) {
  const theme = useTheme();
  return (
    <Typography gutterBottom>
      <Link
        style={{ textDecoration: 'none', fontSize: '12px', color: theme.palette.primary.main }}
        to={`/user/${userId}`}
      >
        {name}
      </Link>
    </Typography>
  );
}

export function LinkToUserAvatar({ user }) {
  return (
    <UserAvatar
      searchedUser={user}
      imageUrl={user.avatarUrl || user.imageUrl}
      customStyle={{ cursor: 'pointer', display: 'inline' }}
      size="xSmall"
      altText=""
      pathname={`/user/${user.id}`}
    />
  );
}

/**
 *
 * @param {object} task single task
 * @param {function} handleChange a function that handles the checkbox for each task
 * @param {String[]} selectedTasks an array of task ids
 * @returns {object} an object with properties that DataList component uses to render
 */
export default function renderTaskData({
  task,
  handleChange,
  selectedTasks,
  isSelected,
  menuData
}) {
  return [
    {
      Select: (
        <Grid item xs={12} sm={2} data-testid="subject">
          <Checkbox
            checked={selectedTasks.includes(task.id) || isSelected}
            onChange={() => handleChange(task.id)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
          />
        </Grid>
      ),
      Task: (
        <Grid item xs={12} sm={2} data-testid="task">
          <Typography variant="caption" gutterBottom>
            <span
              style={{ whiteSpace: 'pre-line' }}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: sanitizeText(removeNewLines(task.body))
              }}
            />
          </Typography>
        </Grid>
      ),
      'Created By': (
        <Grid item xs={12} sm={2} data-testid="createdby">
          <LinkToUser name={task.author.name} userId={task.author.id} />
          <DateContainer date={task.createdAt} />
        </Grid>
      ),
      Duedate: (
        <Grid item xs={12} sm={2} style={{ fontSize: '12px' }} data-testid="duedate">
          {task.dueDate ? dateToString(task.dueDate) : ' Never '}
        </Grid>
      ),
      Assignees: (
        <Grid item xs={12} sm={2} data-testid="assignee">
          {task.assignees.map(user => (
            <LinkToUser key={user.id} name={user.name} userId={user.id} />
          ))}
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} sm={1} data-testid="menu">
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            data-testid="todo-menu"
            onClick={event => menuData.handleTodoMenu(event)}
            color="primary"
          >
            <MoreHorizIcon />
          </IconButton>
          <MenuList
            open={menuData.open}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </Grid>
      )
    }
  ];
}

export function TaskDataList({
  task,
  menuData,
  handleClick,
  styles,
  openSubTask,
  handleOpenSubTasksClick,
  handleTaskCompletion
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:800px)');
  return (
    <Card styles={styles} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={5} xs={10} style={{ display: 'flex', alignItems: 'center' }} data-testid="task_body_section">
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item md={2} xs={2}>
              <IconButton
                aria-controls="task-completion-toggle-button"
                aria-haspopup="true"
                data-testid="task_completion_toggle_button"
                onClick={() => handleTaskCompletion(task.id, !task.completed)}
                size="medium"
              >
                { task.completed ? (
                  <CheckCircleIcon htmlColor="#4caf50" />
                  ) : (
                    <CheckCircleOutlineIcon />
                  )}
              </IconButton>
            </Grid>
            <Grid item md={8} xs={4}>
              <Typography
                variant="body2"
                data-testid="task_body"
                component="p"
                className={matches ? classes.taskBodyMobile : classes.taskBody}
              >
                <span
            // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
              __html: sanitizeText(removeNewLines(task.body))
            }}
                />
              </Typography>
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
            <Hidden smDown>
              <Divider orientation="vertical" flexItem sx={{margin: '-20px 0'}} />
            </Hidden>
          </Grid>
        </Grid>
        <Hidden mdUp>
          <Grid item md={1} xs={1} style={{ display: 'flex', alignItems: 'center', }}>
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
        <Hidden smDown>
          <Grid item data-testid="task_due_date" md={2} xs={12} style={{ display: 'flex', alignItems: 'center', }}>
            <Typography variant="body2" component="span">
              {t('task.due_date')}
              {task.dueDate ? dateToString(task.dueDate) : 'Never '}
            </Typography>
          </Grid>
        </Hidden>
        <Grid item md={1} xs={6} data-testid="task_assignee" style={{ display: 'flex', alignItems: 'center' }}>
          <Hidden smDown>
            {task.assignees.length > 0 && (
            <Grid container style={{paddingLeft: '5px'}}>
              {/* Restrict to 2 users */}
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
        </Grid>
        <Grid item data-testid="task_details_section" md={2} xs={10}>
          <Grid container style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid item md={2} xs={4}>
              <Hidden mdUp>
                <CustomProgressBar task={task} smDown />
              </Hidden>

            </Grid>

            <Grid item md={2} xs={1}>
              <IconButton
                aria-controls="task-subtasks-icon"
                aria-haspopup="true"
                data-testid="task_subtasks"
                onClick={handleClick}
              >
                <AccountTreeIcon fontSize="small" color={task?.subTasks?.length ? 'primary': 'disabled'} />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={1} className={classes.iconItem}><span>{task?.subTasks?.length}</span></Grid>
            <Grid item md={2} xs={1}>
              <IconButton
                aria-controls="task-comment-icon"
                aria-haspopup="true"
                data-testid="task_comments"
                onClick={handleClick}
              >
                <QuestionAnswerIcon fontSize="small" color="disabled" />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={1} className={classes.iconItem}><span>0</span></Grid>
            <Grid item md={2} xs={1}>
              <IconButton
                key={task.id}
                aria-controls="task-attach-file-icon"
                aria-haspopup="true"
                data-testid="task_attach_file"
                onClick={handleClick}
              >
                <AttachFileIcon fontSize="small" color={task?.documents?.length ? 'primary': 'disabled'} />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={1} className={classes.iconItem}>
              <span data-testid="file_attachments_total">
                {task.documents?.length}
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={1}
          style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end' }}
          data-testid="task_menu_section"
        >
          <Hidden smDown>
            <CustomProgressBar task={task} smDown={false} />
          </Hidden>

        </Grid>

        <Grid item md={1} xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} className={classes.arrowDownUpIcon}>
          {task?.subTasks?.length > 0
            ? (
              <IconButton
                aria-controls="show-task-subtasks-icon"
                aria-haspopup="true"
                data-testid="show_task_subtasks"
                onClick={(e) => handleOpenSubTasksClick(e)}
              >
                {openSubTask
                  ? <KeyboardArrowUpIcon fontSize="small" color="primary" />
                  : <KeyboardArrowDownIcon fontSize="small" color="primary" />}
              </IconButton>
            ) : (
              <IconButton
                aria-controls="show-task-subtasks-icon"
                aria-haspopup="true"
                data-testid="show_task_subtasks"
                disabled
              >
                <KeyboardArrowDownIcon fontSize="small" />
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
  handleOpenSubTasksClick: null
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
  handleTaskCompletion: PropTypes.func.isRequired
};
LinkToUser.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

LinkToUserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    avatarUrl: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired
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
    maxWidth: '17ch',
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

  taskMenuIcon: {
   '@media (min-device-width: 375px) and (max-device-height: 667px) and (orientation: portrait)' : {
    marginLeft: "6px",
  },
  '@media (min-device-width: 375px) and (max-device-height: 812px) and (orientation: portrait)' : {
    marginLeft: "6px",
  },
  '@media (min-device-width: 360px) and (max-device-height: 640px) and (orientation: portrait)' : {
    marginLeft: "7px",
  },
  '@media (min-device-width: 414px) and (max-device-height: 736px) and (orientation: portrait)' : {
    marginLeft: "12px",
  },
  '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)' : {
    marginLeft: "20px",
  },
  },

  arrowDownUpIcon: {
    '@media (min-device-width: 768px) and (max-device-height: 1024px) and (orientation: portrait)' : {
      marginLeft: "-45px",
    },

  }
}));
