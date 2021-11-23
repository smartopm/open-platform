import React from 'react';
import { useTranslation } from 'react-i18next';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Checkbox, Grid, IconButton, Typography, Chip } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AttachFileIcon from '@material-ui/icons/AttachFile';
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
  styles
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  // const matches = useMediaQuery('(max-width:1000px)');

  // This is not working as expected yet.
  function handleCheckbox(event, currentTask) {
    event.stopPropagation();
    handleChange(currentTask.id);
  }

  return (
    <Card clickData={{clickable, handleClick}} styles={styles}>
      <Grid container spacing={1}>
        <Grid item md={1} xs={2} data-testid="task_body_section">
          <Checkbox
            checked={selectedTasks.includes(task.id) || isSelected}
            onChange={event => handleCheckbox(event, task)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
            data-testid="task-select-action"
            size="small"
            key={task.id}
          />
        </Grid>
        <Grid item md={2} xs={5}>
          <Typography
            variant="body2"
            data-testid="task_body"
            component="p"
            className={classes.taskBody}
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
          <Grid item md={1} xs={3} style={{paddingTop: '10px', textAlign: 'right'}}>
            {task.completed ? (
              <Chip size="small" label="Complete" className={classes.completed} />
        ) : (
          <Chip size="small" label="Open" className={classes.open} />
        )}
          </Grid>
        </Hidden>
        <Hidden mdUp>
          <Grid item md={1} xs={2} style={{textAlign: 'right', paddingTop: '8px'}}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="task-item-menu"
              dataid={task.id}
              onClick={event => menuData.handleTodoMenu(event, task)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Hidden>
        <Grid item data-testid="task_due_date" md={2} xs={12} style={{paddingTop: '10px'}}>
          <Typography variant="body2" component="span">
            {t('task.due_date')}
            {task.dueDate ? dateToString(task.dueDate) : 'Never '}
          </Typography>
        </Grid>
        <Grid item md={2} xs={6} data-testid="task_assignee">
          {task.assignees.length > 0 ? (
            <>
              <Typography variant="body2">
                {t('task.assigned_to')}
              </Typography>
              {/* Restrict to 2 users */}
              <div style={{display: 'flex'}}>
                {task.assignees.slice(0, 2).map(user => (
                  <LinkToUserAvatar key={user.id} user={user} />
                ))}
                <div>
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
                </div>
              </div>
            </>
          ) : (
            <Typography variant="body2">
              {t('task.no_assignee')}
            </Typography>
          )}
        </Grid>
        <Grid item data-testid="task_details_section" md={3} xs={6}>
          <Grid container>
            <Grid item md={4}>
              <IconButton
                aria-controls="task-subtasks-icon"
                aria-haspopup="true"
                data-testid="task_subtasks"
              >
                <AccountTreeIcon fontSize="small" color="primary" />
                <span style={{ fontSize: '14px' }}>{task?.subTasks?.length}</span>
              </IconButton>
            </Grid>
            <Grid item md={4}>
              <IconButton
                aria-controls="task-comment-icon"
                aria-haspopup="true"
                data-testid="task_comments"
              >
                <QuestionAnswerIcon fontSize="small" color="primary" />
                <span style={{ fontSize: '14px' }}>0</span>
              </IconButton>
            </Grid>
            <Grid item md={4}>
              <IconButton
                key={task.id}
                aria-controls="task-attach-file-icon"
                aria-haspopup="true"
                data-testid="task_attach_file"
                component="label"
              >
                <input
                  hidden
                  type="file"
                  onChange={event => handleFileInputChange(event, task)}
                  id="task-attach-file"
                />
                <AttachFileIcon fontSize="small" color="disabled" />
                <span style={{ fontSize: '14px' }} data-testid="file_attachments_total">
                  {task.documents?.length}
                </span>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Hidden smDown>
          <Grid item md={1} style={{paddingTop: '10px'}}>
            {task.completed ? (
              <Chip size="small" label="Complete" className={classes.completed} />
        ) : (
          <Chip size="small" label="Open" className={classes.open} />
        )}
          </Grid>
        </Hidden>
        <Hidden smDown>
          <Grid item md={1} style={{textAlign: 'right', paddingTop: '8px'}}>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              data-testid="task-item-menu"
              dataid={task.id}
              onClick={event => menuData.handleTodoMenu(event, task)}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Hidden>
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
  taskListContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '60px'
  },
  section1: {
    display: 'flex',
    alignItems: 'center',
    width: '30%'
  },
  taskBody: {
    maxWidth: '36ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingTop: '10px'
  },
  section2: {
    width: '33%',
    display: 'flex',
    alignItems: 'center'
  },
  // taskAssignees: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   width: '50%',
  //   justifyContent: 'space-between'
  // },
  // taskAssigneesAvatar: {
  //   display: 'flex',
  //   width: '28%',
  //   justifyContent: 'space-between',
  //   fontSize: '10px'
  // },
  section3: {
    display: 'flex',
    width: '28%',
    alignItems: 'center'
  },
  section4: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end'
  },
  taskCreated: {
    display: 'flex',
    alignItems: 'center',
    width: '43%'
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    width: '45%',
    justifyContent: 'space-evenly'
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
