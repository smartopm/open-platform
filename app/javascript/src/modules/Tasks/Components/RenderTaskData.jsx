import React from 'react';
import { Checkbox, Grid, IconButton, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/styles';
import { removeNewLines, sanitizeText } from '../../../utils/helpers';
import DateContainer, { dateToString } from '../../../components/DateContainer';
import MenuList from '../../../shared/MenuList'

// TODO: Put in a more shareable directory
export function LinkToUser({ userId, name }) {
  const theme = useTheme()
  return (
    <Typography gutterBottom>
      <Link style={{ textDecoration: 'none', fontSize: '12px', color: theme.palette.primary.main }} to={`/user/${userId}`}>
        {name}
      </Link>
    </Typography>
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
  menuData,
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
    <Grid item xs={12} sm={2} style={{fontSize: '12px'}} data-testid="duedate">
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
        onClick={(event) => menuData.handleTodoMenu(event)}
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

LinkToUser.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
