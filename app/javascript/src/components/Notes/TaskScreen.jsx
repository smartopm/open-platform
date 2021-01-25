import React, { useState } from 'react';
import { Checkbox, Grid, IconButton, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useQuery } from 'react-apollo';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flaggedNotes } from '../../graphql/queries';
import { removeNewLines, sanitizeText } from '../../utils/helpers';
import DateContainer, { dateToString } from '../DateContainer';
import DataList from '../List/DataList';
import TaskReportDialog from './TaskReportDialog';

const taskHeader = [
  {
    title: 'Select',
    col: 1
  },
  {
    title: 'Task',
    col: 4
  },
  {
    title: 'Created By',
    col: 3
  },
  {
    title: 'Due date',
    col: 1
  },
  {
    title: 'Assignees',
    col: 2
  },
  {
    title: 'Menu',
    col: 1
  }
];
export default function TaskScreen() {
  const { loading, error, data } = useQuery(flaggedNotes);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedTasks, setSelected] = useState([]);
  function handleReportDialog() {
    setStatusOpen(!statusOpen);
  }

  function handleChange(taskId) {
    let currentTasks = [];
    if (selectedTasks.includes(taskId)) {
      currentTasks = selectedTasks.filter(id => id !== taskId);
      setSelected([...currentTasks]);
    } else {
      setSelected([...selectedTasks, taskId]);
    }
  }

  function filterTaskByStatus() {}

  const history = useHistory();

  function handleTaskDetails(taskId) {
    history.push(`/tasks/${taskId}`);
  }

  if (loading) return 'loading';
  if (error) return error.message;

  return (
    <>
      <TaskReportDialog
        open={statusOpen}
        handleClose={handleReportDialog}
        handleFilter={filterTaskByStatus}
      />
      <DataList
        keys={taskHeader}
        data={taskData(data, handleChange, selectedTasks, handleTaskDetails)}
      />
    </>
  );
}

export function LinkToUser({ userId, name }) {
  return (
    <Typography gutterBottom>
      <Link style={{ textDecoration: 'none' }} to={`/user/${userId}`}>
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
export function taskData(data, handleChange, selectedTasks, handleTaskDetails) {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return data.flaggedNotes?.map(task => {
    return {
      Select: (
        <Grid item xs={1}>
          <Checkbox
            checked={selectedTasks.includes(task.id)}
            onChange={() => handleChange(task.id)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
      ),
      Task: (
        <Grid item xs={4}>
          <Typography variant="subtitle1" gutterBottom>
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
        <Grid item xs={2}>
          <LinkToUser name={task.author.name} userId={task.author.id} />
          at &nbsp;
          <DateContainer date={task.createdAt} />
        </Grid>
      ),
      'Due date': (
        <Grid item xs={1}>
          {task.dueDate ? dateToString(task.dueDate) : ' Never '}
        </Grid>
      ),
      Assignees: (
        <Grid item xs={2}>
          {task.assignees.map(user => (
            <LinkToUser key={user.id} name={user.name} userId={user.id} />
          ))}
        </Grid>
      ),
      Menu: (
        <Grid item xs={1}>
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
