import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { CustomizedDialogs } from '../Dialog';
import MessageAlert from '../MessageAlert';
import DatePickerDialog from '../DatePickerDialog';
import { UserJourneyUpdateMutation } from '../../graphql/mutations/user_journey';
import { formatError } from '../../utils/helpers';

export default function UserJourneyDialog({ open, handleModalClose, refetch, log }) {
  const [state, setState] = useState({ isError: false, message: '', isOpen: false, isLoading: false });
  const [dates, setDates] = useState({ startDate: log.startDate, endDate: log.stopDate });
  const [updateUserJourney] = useMutation(UserJourneyUpdateMutation)  

  console.log(log)
    
    // force dates to update when we pick a different log
    useEffect(() => {
        setDates({ ...dates, startDate: log.startDate, endDate: log.stopDate })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

  function handleSubmit() {
    setState({ ...state, isLoading: true })
    updateUserJourney({
        variables: { id: log.id, startDate: dates.startDate, stopDate: dates.endDate }
    })
    .then(() => {
        setState({ ...state, isLoading: false, message: 'Successfully updated', isOpen: true })
        refetch();
    })
    .catch(error => {
        setState({ ...state, isLoading: false, message: formatError(error.message), isOpen: true, isError: true })
    })
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
          selectedDate={dates.startDate || new Date()}
          label="Customer Journey Start Date"
          handleDateChange={date => setDates({ ...dates, startDate: date })}
        />
        <DatePickerDialog
          key="end_date"
          selectedDate={dates.endDate || new Date()}
          label="Customer Journey End Date"
          handleDateChange={date => setDates({ ...dates, endDate: date })}
          minDate={dates.startDate}
          disablePastDate
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
      stopDate: PropTypes.string,
      startDate: PropTypes.string,
   }).isRequired,
  refetch: PropTypes.func.isRequired
};
