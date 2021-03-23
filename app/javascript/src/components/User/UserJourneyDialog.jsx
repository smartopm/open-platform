import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { CustomizedDialogs } from '../Dialog';
import MessageAlert from '../MessageAlert';
import DatePickerDialog from '../DatePickerDialog';
import { UserJourneyUpdateMutation } from '../../graphql/mutations/user_journey';
import { formatError } from '../../utils/helpers';

export default function UserJourneyDialog({ open, handleModalClose, refetch, log }) {
  const [state, setState] = useState({
    isError: false,
    message: '',
    isOpen: false,
    isLoading: false
  });
  const [startDate, setDates] = useState(log.startDate);
  const [updateUserJourney] = useMutation(UserJourneyUpdateMutation);
// console.log(log);
  // force startDate to update when we pick a different log
  useEffect(() => {
    setDates(log.startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    setState({ ...state, isLoading: true });
    updateUserJourney({
      variables: {
        id: log.id,
        userId: log.userId,
        startDate,
        previousStatus: log.previousStatus
      }
    })
      .then(() => {
        setState({ ...state, isLoading: false, message: 'Successfully updated', isOpen: true });
        refetch();
      })
      .catch(error => {
        setState({
          ...state,
          isLoading: false,
          message: formatError(error.message),
          isOpen: true,
          isError: true
        });
      });
  }
  return (
    <>
      <MessageAlert
        type={!state.isError ? 'success' : 'error'}
        message={state.message}
        open={state.isOpen}
        handleClose={() => setState({ ...state, isOpen: false })}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleModalClose}
        dialogHeader="Edit Start and End Date"
        handleBatchFilter={handleSubmit}
      >
        <DatePickerDialog
          key="start_date"
          selectedDate={startDate}
          label="Customer Journey Start Date"
          handleDateChange={date => setDates(date)}
          maxDate={log.stopDate || undefined}
          minDate={startDate}
        />
      </CustomizedDialogs>
    </>
  );
}

UserJourneyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  log: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    stopDate: PropTypes.string,
    startDate: PropTypes.string,
    previousStatus: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired
};
