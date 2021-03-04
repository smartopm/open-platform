import React from 'react';
import { Checkbox, Grid, IconButton, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { removeNewLines, sanitizeText } from '../../utils/helpers';
import DateContainer, { dateToString } from '../DateContainer';

// TODO: Put in a more shareable directory
export function LinkToUser({ userId, name }) {
  return (
    <Typography gutterBottom>
      <Link style={{ textDecoration: 'none', fontSize: '12px' }} to={`/user/${userId}`}>
        {name}
      </Link>
    </Typography>
  );
}

/**
 *
 * @param {object} data list of tasks
 * @param {function} handleChange a function that handles the checkbox for each task
 * @param {String[]} selectedTasks an array of task ids
 * @param {function} handleTaskDetails a function that routes to task details
 * @returns {object} an object with properties that DataList component uses to render
 */
export default function renderTaskData(data, handleChange, selectedTasks, handleTaskDetails) {
  return data.map(task => {
    return {
      Select: (
        <Grid item xs={12} sm={2}>
          <Checkbox
            checked={selectedTasks.includes(task.id)}
            onChange={() => handleChange(task.id)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
      ),
      Task: (
        <Grid item xs={12} sm={2}>
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
        <Grid item xs={12} sm={2}>
          <LinkToUser name={task.author.name} userId={task.author.id} />
          at &nbsp;
          <DateContainer date={task.createdAt} />
        </Grid>
      ),
      Duedate: (
        <Grid item xs={12} sm={2} style={{fontSize: '12px'}}>
          {task.dueDate ? dateToString(task.dueDate) : ' Never '}
        </Grid>
      ),
      Assignees: (
        <Grid item xs={12} sm={2}>
          {task.assignees.map(user => (
            <LinkToUser key={user.id} name={user.name} userId={user.id} />
          ))}
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} sm={1}>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={() => handleTaskDetails(task.id)}
          >
            <MoreHorizIcon />
          </IconButton>
        </Grid>
      )
    };
  });
}

LinkToUser.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
