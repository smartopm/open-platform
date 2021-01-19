import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  List,
  Dialog,
  DialogTitle,
} from '@material-ui/core';
import { useLazyQuery } from 'react-apollo';
import { propAccessor } from '../../utils/helpers';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import { useStyles } from '../Dialog'

const status = {
  applied: 'Applied',
  architectureReviewed: 'Architecture Reviewed',
  approved: 'Approved',
  contracted: 'Contracted',
  built: 'Built',
  inConstruction: 'In Construction',
  interested: 'Interested',
  movedIn: 'Moved In',
  paying: 'Paying',
  readyForConstruction: 'Ready For Construction'
};
export default function SubStatusReportDialog({ handleClose, open, handleFilter }) {
  const [getSubstatusReport, { loading, data, error }] = useLazyQuery(
    SubStatusQuery
  );
  const classes = useStyles();
  
  useEffect(() => {
    if (open) {
      getSubstatusReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="substatus-report"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className={classes.confirmDialogTitle}>Substatus</DialogTitle>
      {error && error.message}
      {loading ? (
        <Spinner />
      ) : (
        <List>
          {Object.entries(status).map(([key, val], index) => (
            <Fragment key={key}>
              <StatusCount
                count={propAccessor(data?.substatusQuery, key)}
                title={val}
                handleFilter={() => handleFilter(index)}
              />
              <hr style={{marginLeft: 16}} />
            </Fragment>
          ))}
        </List>
      )}
    </Dialog>
  );
}

export function StatusCount({ title, count, handleFilter }) {
  return (
    <ListItem style={{ height: 32 }} onClick={handleFilter}>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>{count}</ListItemSecondaryAction>
    </ListItem>
  );
}

StatusCount.defaultProps = {
  count: 0
}
StatusCount.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  handleFilter: PropTypes.func.isRequired,
};

SubStatusReportDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleFilter: PropTypes.func.isRequired,
};
