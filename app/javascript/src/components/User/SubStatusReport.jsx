import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle } from '@material-ui/core';
import { useLazyQuery } from 'react-apollo';
import { SubStatusQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import { useStyles } from '../Dialog';
import { userSubStatus } from '../../utils/constants';
import { StatusList } from '../../shared/Status';

export default function SubStatusReportDialog({ handleClose, open, handleFilter }) {
  const [getSubstatusReport, { loading, data, error }] = useLazyQuery(SubStatusQuery);
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
      {console.log(data)}
      <DialogTitle className={classes.confirmDialogTitle}>Substatus</DialogTitle>
      {error && error.message}
      {loading ? (
        <Spinner />
      ) : (
        <StatusList
          data={data?.substatusQuery || {}}
          statuses={userSubStatus}
          handleFilter={handleFilter}
        />
      )}
    </Dialog>
  );
}

SubStatusReportDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleFilter: PropTypes.func.isRequired
};
