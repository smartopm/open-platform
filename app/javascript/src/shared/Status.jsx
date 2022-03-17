/* eslint-disable react/forbid-prop-types */
import React, { Fragment } from 'react';
import { ListItemText, ListItemSecondaryAction, ListItem, List } from '@mui/material';
import { string, number, func, object } from 'prop-types';
import { objectAccessor, toCamelCase } from '../utils/helpers';

export default function StatusCount({ title, count, handleFilter }) {
  return (
    <ListItem style={{ height: 16, cursor: 'pointer' }} onClick={handleFilter}>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>{count || 0}</ListItemSecondaryAction>
    </ListItem>
  );
}

export function StatusList({ data, statuses, handleFilter }) {
  return (
    <List dense>
      {Object.entries(statuses).map(([key, val], index) => (
        <Fragment key={key}>
          <StatusCount
            count={objectAccessor(data, toCamelCase(key))}
            title={val}
            handleFilter={() => handleFilter(index)}
          />
          <hr style={{ marginLeft: 16 }} />
        </Fragment>
      ))}
    </List>
  );
}

StatusList.defaultProps = {
  handleFilter: () => {}
};

StatusList.propTypes = {
  data: object.isRequired,
  statuses: object.isRequired,
  handleFilter: func
};

StatusCount.defaultProps = {
  count: 0
};
StatusCount.propTypes = {
  title: string.isRequired,
  count: number,
  handleFilter: func.isRequired
};
