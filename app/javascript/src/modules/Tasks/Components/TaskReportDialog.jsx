import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List, Dialog, DialogTitle } from '@mui/material';
import { useLazyQuery } from 'react-apollo';
import { objectAccessor, toCamelCase } from '../../../utils/helpers';
import { TaskStatsQuery } from '../graphql/task_queries';
import { Spinner } from '../../../shared/Loading';
import { useStyles } from '../../../components/Dialog';
import { taskStatus } from '../../../utils/constants';
import StatusCount from '../../../shared/Status';

export default function TaskReportDialog({ handleClose, open, handleFilter }) {
  const [getTaskStats, { loading, data, error }] = useLazyQuery(TaskStatsQuery);
  const classes = useStyles();

  useEffect(() => {
    if (open) {
      getTaskStats();
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
      <DialogTitle className={classes.confirmDialogTitle}>Tasks Status</DialogTitle>
      {error && error.message}
      {loading ? (
        <Spinner />
      ) : (
        <List>
          {Object.entries(taskStatus).map(([key, val], index) => (
            <Fragment key={key}>
              <StatusCount
                count={objectAccessor(data?.taskStats, toCamelCase(key))}
                title={val}
                handleFilter={() => handleFilter(index)}
              />
              <hr style={{ marginLeft: 16 }} />
            </Fragment>
          ))}
        </List>
      )}
    </Dialog>
  );
}

TaskReportDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleFilter: PropTypes.func.isRequired
};
