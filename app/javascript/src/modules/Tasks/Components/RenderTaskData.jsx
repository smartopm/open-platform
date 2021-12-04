import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Checkbox, Grid, IconButton, Typography, Chip } from '@material-ui/core';
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
import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import DateContainer, { dateToString } from '../../../components/DateContainer';
import MenuList from '../../../shared/MenuList';
import UserAvatar from '../../Users/Components/UserAvatar';
import Card from '../../../shared/Card';

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
  handleChange,
  handleFileInputChange,
  selectedTasks,
  isSelected,
  menuData,
  clickable,
  handleClick,
  styles,
  openSubTask,
  handleOpenSubTasksClick
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:800px)');

  // This is not working as expected yet.
  function handleCheckbox(event, currentTask) {
    event.stopPropagation();
    handleChange(currentTask.id);
  }

  return (
    <Card clickData={{clickable, handleClick}} styles={styles} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={5} xs={8} style={{ display: 'flex', alignItems: 'center' }} data-testid="task_body_section">
          <Checkbox
            checked={selectedTasks.includes(task.id) || isSelected}
            onChange={event => handleCheckbox(event, task)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
            data-testid="task-select-action"
            size="small"
            key={task.id}
            style={{ padding: 0 }}
          />
          {task?.subTasks?.length > 0
            ? (
              <IconButton
                aria-controls="show-task-subtasks-icon"
                aria-haspopup="true"
                data-testid="show_task_subtasks"
                size="medium"
                onClick={handleOpenSubTasksClick}
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
                size="medium"
                disabled
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
          )}
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
        <Hidden mdUp>
          <Grid item md={1} xs={3} style={{display: 'flex', alignItems: 'center' }}>
            {task.completed
            ? <Chip size="small" label={t('task.complete')} className={classes.completed} />
            : <Chip size="small" label={t('task.open')} className={classes.open} />}
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid item md={1} xs={1} style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="task-item-menu"
              dataid={task.id}
              onClick={event => menuData.handleTodoMenu(event, task)}
              size="small"
              color="primary"
            >
              <MoreVertIcon />
            </IconButton>
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
          {task.assignees.length > 0 && (
            <Grid container>
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
                  size="small"
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
        <Grid item data-testid="task_details_section" md={2} xs={6}>
          <Grid container style={{ display: 'flex', justifyContent: 'end' }}>
            <Grid item md={2} xs={2}>
              <IconButton
                aria-controls="task-subtasks-icon"
                aria-haspopup="true"
                data-testid="task_subtasks"
                size="medium"
              >
                <AccountTreeIcon fontSize="small" color={task?.subTasks?.length ? 'primary': 'disabled'} />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={2} className={classes.iconItem}><span>{task?.subTasks?.length}</span></Grid>
            <Grid item md={2} xs={2}>
              <IconButton
                aria-controls="task-comment-icon"
                aria-haspopup="true"
                data-testid="task_comments"
                size="medium"
              >
                <QuestionAnswerIcon fontSize="small" color="disabled" />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={2} className={classes.iconItem}><span>0</span></Grid>
            <Grid item md={2} xs={2}>
              <IconButton
                key={task.id}
                aria-controls="task-attach-file-icon"
                aria-haspopup="true"
                data-testid="task_attach_file"
                component="label"
                size="medium"
              >
                <input
                  hidden
                  type="file"
                  onChange={event => handleFileInputChange(event, task)}
                  id="task-attach-file"
                />
                <AttachFileIcon fontSize="small" color={task?.documents?.length ? 'primary': 'disabled'} />
              </IconButton>
            </Grid>
            <Grid item md={1} xs={2} className={classes.iconItem}>
              <span data-testid="file_attachments_total">
                {task.documents?.length}
              </span>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }} data-testid="task_menu_section">
          <Hidden smDown>
            {task.completed
              ? <Chip size="small" label={t('task.complete')} className={classes.completed} /> 
              : <Chip size="small" label={t('task.open')} className={classes.open} />}
          </Hidden>
          <Hidden smDown>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="task-item-menu"
              dataid={task.id}
              onClick={event => menuData.handleTodoMenu(event, task)}
              size="small"
              color="primary"
            >
              <MoreVertIcon />
            </IconButton>
          </Hidden>
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
  clickable: false,
  handleClick: null,
  styles: {},
  openSubTask: false,
  handleOpenSubTasksClick: null,
}
TaskDataList.propTypes = {
  task: PropTypes.shape(Task).isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleFileInputChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  menuData: PropTypes.object.isRequired,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  openSubTask: PropTypes.bool,
  handleOpenSubTasksClick: PropTypes.func,
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
    fontSize: '14px',
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  }
}));
