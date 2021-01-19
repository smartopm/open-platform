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
import { propAccessor, toCamelCase } from '../../utils/helpers';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../Loading';
import { useStyles } from '../Dialog'
import { userSubStatus } from '../../utils/constants';

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
          {Object.entries(userSubStatus).map(([key, val], index) => (
            <Fragment key={key}>
              <StatusCount
                count={propAccessor(data?.substatusQuery, toCamelCase(key))}
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
    <ListItem style={{ height: 32, cursor: 'pointer' }} onClick={handleFilter}>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>{count || 0}</ListItemSecondaryAction>
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
