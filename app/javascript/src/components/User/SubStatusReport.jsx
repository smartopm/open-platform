import React from 'react';
import PropTypes from 'prop-types';
import {
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  List,
  Dialog
} from '@material-ui/core';
import { propAccessor } from '../../utils/helpers';

const status = {
  applied: 'Applied',
  approved: 'Applied',
  architectureReviewed: 'Architecture Reviewed',
  interested: 'Interested',
  built: 'Built',
  contracted: 'Contracted',
  inConstruction: 'In Construction',
  movedIn: 'Moved In',
  paying: 'Paying',
  readyForConstruction: 'Ready For Construction'
};

export default function SubStatusReportDialog({ handleClose, open  }) {
  const data = [];
  return (
    <Dialog onClose={handleClose} aria-labelledby="substatus-report" open={open}>
      <List>
        {Object.entries(status).map(([key, val]) => (
          <StatusCount
            key={status}
            count={propAccessor(data?.substatusQuery, key)}
            title={val}
          />
        ))}
      </List>
    </Dialog>
  );
}

export function StatusCount({ title, count }) {
  return (
    <ListItem>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>{count}</ListItemSecondaryAction>
    </ListItem>
  );
}

StatusCount.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

SubStatusReportDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}