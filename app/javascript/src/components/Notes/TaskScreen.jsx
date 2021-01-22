import React from 'react';
import { Checkbox, IconButton, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useQuery } from 'react-apollo';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { flaggedNotes } from '../../graphql/queries';
import { removeNewLines, sanitizeText } from '../../utils/helpers';
import DateContainer, { dateToString } from '../DateContainer';
import DataList from '../List/DataList';

const taskHeader = [
  'Select',
  'Task',
  'Created By',
  'Date Created',
  'Due date',
  'Assignees',
  'Menu'
];

export default function TaskScreen() {
  const { loading, error, data } = useQuery(flaggedNotes);
  if (loading) return 'loading';
  if (error) return error.message;
  // the following are for prototyping
  function handleChange() {}
  const checked = false;
  const taskData = data.flaggedNotes?.map(task => {
    return {
      Select: (
        <Checkbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      ),
      Task: (
        <Typography variant="subtitle1" gutterBottom>
          <span
            style={{ whiteSpace: 'pre-line' }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeText(removeNewLines(task.body))
            }}
          />
        </Typography>
      ),
      'Created By': <LinkToUser name={task.author.name} userId={task.author.id} />,
      'Date Created': <DateContainer date={task.createdAt} />,
      'Due date': task.dueDate ? dateToString(task.dueDate) : ' Never ',
      Assignees: task.assignees.map(user => (
        <LinkToUser key={user.id} name={user.name} userId={user.id} />
      )),
      Menu: (
        <IconButton aria-controls="simple-menu" aria-haspopup="true">
          <MoreHorizIcon />
        </IconButton>
      )
    };
  });
  return <DataList keys={taskHeader} data={taskData} />;
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

LinkToUser.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
